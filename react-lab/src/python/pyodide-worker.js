/* Web Worker que executa Python de verdade com Pyodide.
 *
 * Fica fora da thread principal para que input() possa bloquear com
 * Atomics.wait enquanto o usuário digita a resposta no terminal.
 * O arquivo é carregado como texto e vira um Blob Worker do tipo módulo,
 * o que permite importar pyodide.mjs do CDN sem depender de importScripts.
 */

const PYODIDE_VERSION = '314.0.7'
const CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

const decoder = new TextDecoder()

let pyodide = null
let control = null
let data = null
let fila = Promise.resolve()

function enviar(mensagem) {
  self.postMessage(mensagem)
}

async function inicializar() {
  if (pyodide) return

  enviar({ type: 'status', status: 'loading' })
  const modulo = await import(/* @vite-ignore */ `${CDN_BASE}pyodide.mjs`)
  pyodide = await modulo.loadPyodide({ indexURL: CDN_BASE })

  pyodide.setStdout({
    isatty: true,
    write: (buffer) => {
      enviar({ type: 'stdout', text: decoder.decode(buffer, { stream: true }) })
      return buffer.length
    },
  })

  pyodide.setStderr({
    isatty: true,
    write: (buffer) => {
      enviar({ type: 'stderr', text: decoder.decode(buffer, { stream: true }) })
      return buffer.length
    },
  })

  pyodide.setStdin({ stdin: lerEntrada, isatty: true })
  enviar({ type: 'ready' })
}

/**
 * Chamada pelo Python sempre que input() precisa de uma linha.
 * Bloqueia o worker até a thread principal publicar a resposta no
 * SharedArrayBuffer e chamar Atomics.notify.
 */
function lerEntrada() {
  if (!control || !data) return null

  Atomics.store(control, 0, 1)
  enviar({ type: 'input' })

  while (Atomics.load(control, 0) !== 2) {
    Atomics.wait(control, 0, 1)
  }

  const tamanho = Atomics.load(control, 1)
  Atomics.store(control, 0, 0)

  // TextDecoder recusa views sobre SharedArrayBuffer, então copiamos os bytes
  // para um buffer comum antes de decodificar.
  const copia = data.slice(0, tamanho)
  if (tamanho === 0) return '\n'

  return decoder.decode(copia)
}

function formatarErro(erro) {
  if (erro && typeof erro.message === 'string') {
    return `${erro.message}\n`
  }
  return `${String(erro)}\n`
}

async function executar(id, codigo) {
  try {
    await inicializar()
    enviar({ type: 'status', status: 'running' })

    const globals = pyodide.globals.get('dict')()
    try {
      await pyodide.runPythonAsync(codigo, { globals })
    } finally {
      globals.destroy()
    }

    enviar({ type: 'done', id, ok: true })
  } catch (erro) {
    enviar({ type: 'stderr', text: formatarErro(erro) })
    enviar({ type: 'done', id, ok: false })
  }
}

self.onmessage = (event) => {
  const mensagem = event.data

  if (mensagem.type === 'init') {
    if (mensagem.control) control = new Int32Array(mensagem.control)
    if (mensagem.data) data = new Uint8Array(mensagem.data)
    return
  }

  if (mensagem.type === 'run') {
    fila = fila.then(() => executar(mensagem.id, mensagem.code))
  }
}
