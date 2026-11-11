import workerSource from './pyodide-worker.js?raw'

export type MotorStatus =
  | 'ocioso'
  | 'carregando'
  | 'executando'
  | 'aguardando'
  | 'concluido'
  | 'erro'

export interface MotorCallbacks {
  aoSaida: (texto: string, fluxo: 'saida' | 'erro') => void
  aoStatus: (status: MotorStatus) => void
  aoPedirEntrada: () => void
  aoFinalizar: (sucesso: boolean) => void
}

export interface MotorPython {
  readonly suportaParar: boolean
  executar: (codigo: string, callbacks: MotorCallbacks) => void
  enviarEntrada: (valor: string) => void
  parar: () => void
  descartar: () => void
}

const VERSAO_PYODIDE = '314.0.7'
const CDN_PYODIDE = `https://cdn.jsdelivr.net/pyodide/v${VERSAO_PYODIDE}/full/`
const TAMANHO_BUFFER_ENTRADA = 64 * 1024

const decoder = new TextDecoder()

/** O terminal integrado depende de SharedArrayBuffer e isolamento de origem. */
export function entradaNoTerminalDisponivel(): boolean {
  return (
    typeof SharedArrayBuffer !== 'undefined' &&
    typeof window !== 'undefined' &&
    window.crossOriginIsolated
  )
}

export function criarMotorPython(): MotorPython {
  return entradaNoTerminalDisponivel()
    ? new MotorWorker()
    : new MotorCompatibilidade()
}

type MensagemWorker =
  | { type: 'status'; status: 'loading' | 'running' }
  | { type: 'ready' }
  | { type: 'stdout'; text: string }
  | { type: 'stderr'; text: string }
  | { type: 'input' }
  | { type: 'done'; id: number; ok: boolean }

/**
 * Executa Pyodide em um Web Worker do tipo módulo.
 * A entrada do usuário é entregue por SharedArrayBuffer + Atomics.
 */
class MotorWorker implements MotorPython {
  readonly suportaParar = true

  private worker: Worker | null = null
  private urlBlob: string | null = null
  private control: Int32Array | null = null
  private dados: Uint8Array | null = null
  private callbacks: MotorCallbacks | null = null
  private pronto = false
  private executando = false
  private idAtual = 0

  executar(codigo: string, callbacks: MotorCallbacks) {
    if (this.executando) return

    this.callbacks = callbacks
    this.executando = true
    this.idAtual += 1

    const worker = this.garantirWorker()
    callbacks.aoStatus(this.pronto ? 'executando' : 'carregando')
    worker.postMessage({ type: 'run', id: this.idAtual, code: codigo })
  }

  enviarEntrada(valor: string) {
    if (!this.control || !this.dados) return

    const bytes = new TextEncoder().encode(valor)
    const tamanho = Math.min(bytes.length, this.dados.length)
    this.dados.set(bytes.subarray(0, tamanho), 0)

    Atomics.store(this.control, 1, tamanho)
    Atomics.store(this.control, 0, 2)
    Atomics.notify(this.control, 0)

    this.callbacks?.aoStatus('executando')
  }

  parar() {
    this.encerrarWorker()
    this.executando = false
    this.callbacks?.aoStatus('ocioso')
    this.callbacks = null
  }

  descartar() {
    this.encerrarWorker()
    this.callbacks = null
  }

  private garantirWorker(): Worker {
    if (this.worker) return this.worker

    const controleBuffer = new SharedArrayBuffer(16)
    const dadosBuffer = new SharedArrayBuffer(TAMANHO_BUFFER_ENTRADA)
    this.control = new Int32Array(controleBuffer)
    this.dados = new Uint8Array(dadosBuffer)

    const blob = new Blob([workerSource], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    this.urlBlob = url

    const worker = new Worker(url, { type: 'module' })
    this.worker = worker

    worker.onmessage = (evento: MessageEvent<MensagemWorker>) => {
      this.receber(evento.data)
    }

    worker.onerror = (evento) => {
      this.callbacks?.aoSaida(
        `Falha ao carregar o Python no navegador: ${
          evento.message || 'erro desconhecido'
        }\n`,
        'erro',
      )
      this.executando = false
      this.callbacks?.aoStatus('erro')
      this.callbacks?.aoFinalizar(false)
    }

    worker.postMessage({
      type: 'init',
      control: controleBuffer,
      data: dadosBuffer,
    })

    return worker
  }

  private receber(mensagem: MensagemWorker) {
    switch (mensagem.type) {
      case 'status':
        this.callbacks?.aoStatus(
          mensagem.status === 'loading' ? 'carregando' : 'executando',
        )
        break
      case 'ready':
        this.pronto = true
        break
      case 'stdout':
        this.callbacks?.aoSaida(mensagem.text, 'saida')
        break
      case 'stderr':
        this.callbacks?.aoSaida(mensagem.text, 'erro')
        break
      case 'input':
        this.callbacks?.aoStatus('aguardando')
        this.callbacks?.aoPedirEntrada()
        break
      case 'done':
        if (mensagem.id !== this.idAtual) return
        this.executando = false
        this.callbacks?.aoStatus(mensagem.ok ? 'concluido' : 'erro')
        this.callbacks?.aoFinalizar(mensagem.ok)
        break
    }
  }

  private encerrarWorker() {
    this.worker?.terminate()
    this.worker = null
    this.pronto = false

    if (this.urlBlob) {
      URL.revokeObjectURL(this.urlBlob)
      this.urlBlob = null
    }

    this.control = null
    this.dados = null
  }
}

interface PyodideApi {
  setStdout: (opcoes: {
    isatty?: boolean
    write: (buffer: Uint8Array) => number
  }) => void
  setStderr: (opcoes: {
    isatty?: boolean
    write: (buffer: Uint8Array) => number
  }) => void
  setStdin: (opcoes: {
    isatty?: boolean
    stdin: () => string | null
  }) => void
  runPythonAsync: (
    codigo: string,
    opcoes?: { globals?: unknown },
  ) => Promise<unknown>
  globals: { get: (nome: string) => () => unknown }
}

type CarregarPyodide = (opcoes: { indexURL: string }) => Promise<PyodideApi>

/**
 * Modo de compatibilidade para navegadores ou hospedagens sem
 * Cross-Origin-Isolation. Roda o Pyodide na thread principal e usa
 * window.prompt para cada input().
 */
class MotorCompatibilidade implements MotorPython {
  readonly suportaParar = false

  private pyodide: PyodideApi | null = null
  private carregamento: Promise<PyodideApi> | null = null

  executar(codigo: string, callbacks: MotorCallbacks) {
    void this.rodar(codigo, callbacks)
  }

  enviarEntrada() {
    // A entrada é solicitada diretamente pelo window.prompt.
  }

  parar() {
    // A execução na thread principal não pode ser interrompida com segurança.
  }

  descartar() {
    this.pyodide = null
    this.carregamento = null
  }

  private async rodar(codigo: string, callbacks: MotorCallbacks) {
    callbacks.aoStatus('carregando')

    try {
      const pyodide = await this.obterPyodide()
      callbacks.aoStatus('executando')

      pyodide.setStdout({
        isatty: true,
        write: (buffer) => {
          callbacks.aoSaida(decoder.decode(buffer, { stream: true }), 'saida')
          return buffer.length
        },
      })

      pyodide.setStderr({
        isatty: true,
        write: (buffer) => {
          callbacks.aoSaida(decoder.decode(buffer, { stream: true }), 'erro')
          return buffer.length
        },
      })

      pyodide.setStdin({
        isatty: true,
        stdin: () => {
          callbacks.aoStatus('aguardando')
          const resposta = window.prompt('Entrada do programa Python:')
          callbacks.aoStatus('executando')
          if (resposta === null) return null
          // Uma linha vazia precisa virar "\n"; string vazia seria lida como EOF.
          return resposta === '' ? '\n' : resposta
        },
      })

      const globals = pyodide.globals.get('dict')()
      try {
        await pyodide.runPythonAsync(codigo, { globals })
      } finally {
        ;(globals as { destroy?: () => void }).destroy?.()
      }

      callbacks.aoStatus('concluido')
      callbacks.aoFinalizar(true)
    } catch (erro) {
      callbacks.aoSaida(formatarErro(erro), 'erro')
      callbacks.aoStatus('erro')
      callbacks.aoFinalizar(false)
    }
  }

  private obterPyodide(): Promise<PyodideApi> {
    if (this.pyodide) return Promise.resolve(this.pyodide)
    if (this.carregamento) return this.carregamento

    this.carregamento = new Promise<PyodideApi>((resolve, reject) => {
      const iniciar = async () => {
        try {
          const carregar = (
            window as unknown as { loadPyodide?: CarregarPyodide }
          ).loadPyodide

          if (!carregar) {
            throw new Error('Pyodide não foi carregado corretamente.')
          }

          const pyodide = await carregar({ indexURL: CDN_PYODIDE })
          this.pyodide = pyodide
          resolve(pyodide)
        } catch (erro) {
          this.carregamento = null
          reject(erro)
        }
      }

      const existente = document.querySelector<HTMLScriptElement>(
        'script[data-pyodide]',
      )

      if (existente) {
        void iniciar()
        return
      }

      const script = document.createElement('script')
      script.src = `${CDN_PYODIDE}pyodide.js`
      script.async = true
      script.dataset.pyodide = 'true'
      script.onload = () => void iniciar()
      script.onerror = () => {
        this.carregamento = null
        reject(new Error('Não foi possível carregar o Pyodide a partir do CDN.'))
      }
      document.head.appendChild(script)
    })

    return this.carregamento
  }
}

function formatarErro(erro: unknown): string {
  if (erro && typeof erro === 'object' && 'message' in erro) {
    return `${String((erro as { message: unknown }).message)}\n`
  }
  return `${String(erro)}\n`
}
