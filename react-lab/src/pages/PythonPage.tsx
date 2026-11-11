import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Icone } from '../components/Icone'
import { projetosPython } from '../python/projects'
import type { NivelPython } from '../python/projects'
import { criarMotorPython, entradaNoTerminalDisponivel } from '../python/engine'
import type { MotorCallbacks, MotorPython, MotorStatus } from '../python/engine'

interface Segmento {
  id: number
  tipo: 'saida' | 'erro' | 'entrada' | 'sistema'
  texto: string
}

const LIMITE_SAIDA = 140_000

const rotuloStatus: Record<MotorStatus, string> = {
  ocioso: 'Pronto',
  carregando: 'Carregando Python',
  executando: 'Executando',
  aguardando: 'Aguardando entrada',
  concluido: 'Concluído',
  erro: 'Erro',
}

const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]/g

function limparTexto(texto: string): string {
  return texto.replace(ANSI, '').replace(/\r\n?/g, '\n')
}

function classeDoNivel(nivel: NivelPython): string {
  return nivel === 'Iniciante' ? 'iniciante' : 'intermediario'
}

export function PythonPage() {
  const [projetoId, setProjetoId] = useState(projetosPython[0].id)
  const [segmentos, setSegmentos] = useState<Segmento[]>([])
  const [status, setStatus] = useState<MotorStatus>('ocioso')
  const [entrada, setEntrada] = useState('')
  const [modoCompatibilidade] = useState(() => !entradaNoTerminalDisponivel())

  const motorRef = useRef<MotorPython | null>(null)
  const saidaRef = useRef<HTMLDivElement>(null)
  const entradaRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(0)
  const tamanhoRef = useRef(0)

  const projeto =
    projetosPython.find((item) => item.id === projetoId) ?? projetosPython[0]

  const adicionar = useCallback((tipo: Segmento['tipo'], texto: string) => {
    const limpo = limparTexto(texto)
    if (!limpo) return

    const id = idRef.current
    idRef.current += 1

    setSegmentos((atuais) => {
      const ultimo = atuais[atuais.length - 1]

      if (ultimo && ultimo.tipo === tipo) {
        return [...atuais.slice(0, -1), { ...ultimo, texto: ultimo.texto + limpo }]
      }

      return [...atuais, { id, tipo, texto: limpo }]
    })
  }, [])

  useEffect(() => {
    const caixa = saidaRef.current
    if (caixa) {
      caixa.scrollTop = caixa.scrollHeight
    }
  }, [segmentos, status])

  useEffect(() => {
    return () => {
      motorRef.current?.descartar()
      motorRef.current = null
    }
  }, [])

  const pararExecucao = useCallback(
    (mensagem = 'Execução interrompida pelo usuário.') => {
      motorRef.current?.parar()
      setStatus('ocioso')
      setEntrada('')
      adicionar('sistema', `\n${mensagem}\n`)
    },
    [adicionar],
  )

  const executar = useCallback(() => {
    if (
      status === 'carregando' ||
      status === 'executando' ||
      status === 'aguardando'
    ) {
      return
    }

    const motor = motorRef.current ?? criarMotorPython()
    motorRef.current = motor

    setSegmentos([])
    setEntrada('')
    setStatus('carregando')
    tamanhoRef.current = 0

    adicionar('sistema', `$ python ${projeto.arquivo}\n\n`)

    let limiteAtingido = false

    const callbacks: MotorCallbacks = {
      aoSaida: (texto, fluxo) => {
        if (limiteAtingido) return

        tamanhoRef.current += texto.length

        if (tamanhoRef.current > LIMITE_SAIDA) {
          limiteAtingido = true
          adicionar(
            'sistema',
            '\n\n[limite de saída atingido — execução interrompida]\n',
          )
          motor.parar()
          setStatus('ocioso')
          return
        }

        adicionar(fluxo === 'erro' ? 'erro' : 'saida', texto)
      },
      aoStatus: (novoStatus) => setStatus(novoStatus),
      aoPedirEntrada: () => {
        window.setTimeout(() => entradaRef.current?.focus(), 40)
      },
      aoFinalizar: (sucesso) => {
        adicionar(
          'sistema',
          sucesso
            ? '\n[processo finalizado]\n'
            : '\n[processo finalizado com erro]\n',
        )
      },
    }

    motor.executar(projeto.codigo, callbacks)
  }, [adicionar, projeto, status])

  function responder(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (status !== 'aguardando') return

    adicionar('entrada', `${entrada}\n`)
    motorRef.current?.enviarEntrada(entrada)
    setEntrada('')
    setStatus('executando')
    entradaRef.current?.focus()
  }

  function selecionarProjeto(id: string) {
    if (id === projetoId) return

    if (
      status === 'carregando' ||
      status === 'executando' ||
      status === 'aguardando'
    ) {
      motorRef.current?.parar()
    }

    setProjetoId(id)
    setSegmentos([])
    setEntrada('')
    setStatus('ocioso')
    tamanhoRef.current = 0
  }

  function limparTerminal() {
    setSegmentos([])
    setEntrada('')
    setStatus('ocioso')
    tamanhoRef.current = 0
  }

  const ocupado =
    status === 'carregando' ||
    status === 'executando' ||
    status === 'aguardando'

  return (
    <div className="page python-page">
      <PageHeader
        eyebrow="Projetos Python"
        titulo="Python real no navegador"
        descricao="Escolha um projeto, execute o código e responda às entradas do programa como em um terminal de verdade. O Python roda no seu navegador com Pyodide e nada é enviado para servidores."
        conceitos={['input()', 'print()', 'laços', 'condicionais', 'listas']}
      />

      {modoCompatibilidade && (
        <div className="py-notice" role="status">
          <Icone nome="fa-triangle-exclamation" tamanho={16} />
          <p>
            Este ambiente não oferece isolamento de origem, então as entradas usam
            a janela do navegador. Para o terminal integrado, execute o projeto com
            <code> npm run dev</code>.
          </p>
        </div>
      )}

      <div className="py-layout">
        <section className="py-projects" aria-label="Projetos Python disponíveis">
          <div className="py-projects-head">
            <h2>Escolha um projeto</h2>
            <span className="section-count">
              {projetosPython.length} arquivos
            </span>
          </div>

          <div className="py-project-list">
            {projetosPython.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`py-project ${
                  item.id === projetoId ? 'is-active' : ''
                }`}
                onClick={() => selecionarProjeto(item.id)}
                aria-pressed={item.id === projetoId}
              >
                <span className={`py-project-icon tone-${item.tom}`}>
                  <Icone nome={item.icone} tamanho={18} />
                </span>

                <span className="py-project-text">
                  <span className="py-project-title">
                    {item.titulo}
                    <span
                      className={`level-badge level-${classeDoNivel(item.nivel)}`}
                    >
                      {item.nivel}
                    </span>
                  </span>
                  <span className="py-project-desc">{item.descricao}</span>
                  <code>{item.arquivo}</code>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="py-terminal-panel" aria-label="Terminal de execução">
          <header className="py-terminal-head">
            <div className="py-terminal-title">
              <span className="py-dot py-dot-red" />
              <span className="py-dot py-dot-yellow" />
              <span className="py-dot py-dot-green" />
              <span className="py-terminal-file">terminal · {projeto.arquivo}</span>
            </div>

            <span className={`py-status py-status-${status}`}>
              {status === 'carregando' || status === 'executando' ? (
                <Icone nome="fa-spinner" tamanho={12} className="spin" />
              ) : (
                <span className="py-status-dot" />
              )}
              {rotuloStatus[status]}
            </span>
          </header>

          <div className="py-terminal-body">
            <div
              className="py-output"
              ref={saidaRef}
              role="log"
              aria-live="polite"
              aria-label="Saída do programa Python"
            >
              {segmentos.length === 0 && status === 'ocioso' && (
                <div className="py-empty">
                  <Icone nome="fa-terminal" tamanho={28} />
                  <strong>Terminal pronto</strong>
                  <p>
                    Clique em <b>Executar</b> para rodar{' '}
                    <code>{projeto.arquivo}</code>.
                  </p>
                </div>
              )}

              {segmentos.map((segmento) => (
                <span
                  key={segmento.id}
                  className={`py-chunk py-chunk-${segmento.tipo}`}
                >
                  {segmento.texto}
                </span>
              ))}

              {(status === 'carregando' || status === 'executando') && (
                <span className="py-cursor" aria-hidden="true" />
              )}
            </div>

            <form className="py-input-row" onSubmit={responder}>
              <span className="py-input-prompt" aria-hidden="true">
                &gt;
              </span>
              <input
                ref={entradaRef}
                value={entrada}
                onChange={(evento) => setEntrada(evento.target.value)}
                placeholder={
                  status === 'aguardando'
                    ? 'Digite a entrada e pressione Enter'
                    : 'Aguardando o programa pedir uma entrada…'
                }
                disabled={status !== 'aguardando'}
                aria-label="Entrada do programa Python"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={status !== 'aguardando'}
              >
                <Icone nome="fa-paper-plane" tamanho={14} />
                Enviar
              </button>
            </form>
          </div>

          <footer className="py-terminal-foot">
            <div className="py-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={executar}
                disabled={ocupado}
              >
                <Icone nome="fa-play" tamanho={14} />
                Executar
              </button>

              {!modoCompatibilidade && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => pararExecucao()}
                  disabled={status !== 'executando' && status !== 'aguardando'}
                >
                  <Icone nome="fa-stop" tamanho={14} />
                  Parar
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={limparTerminal}
                disabled={ocupado}
              >
                <Icone nome="fa-trash-can" tamanho={14} />
                Limpar
              </button>
            </div>

            <span className="py-engine">
              <Icone nome="fa-microchip" tamanho={13} />
              Pyodide · Python 3 no navegador
            </span>
          </footer>
        </section>
      </div>

      <details className="py-code panel">
        <summary>
          <Icone nome="fa-code" tamanho={15} />
          Ver o código de {projeto.arquivo}
        </summary>
        <pre>
          <code>{projeto.codigo}</code>
        </pre>
      </details>
    </div>
  )
}
