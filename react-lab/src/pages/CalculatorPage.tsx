import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Icone } from '../components/Icone'

type Operador = '+' | '-' | '×' | '÷'

interface EstadoCalculadora {
  display: string
  anterior: number | null
  operador: Operador | null
  aguardando: boolean
  historico: string
}

const estadoInicial: EstadoCalculadora = {
  display: '0',
  anterior: null,
  operador: null,
  aguardando: false,
  historico: '',
}

function formatar(valor: number): string {
  if (!Number.isFinite(valor)) return 'Erro'
  if (Object.is(valor, -0)) return '0'
  return String(Number(valor.toPrecision(12)))
}

function calcular(a: number, b: number, operador: Operador): number {
  switch (operador) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      return b === 0 ? Number.NaN : a / b
  }
}

interface CalcKeyProps {
  children: ReactNode
  onClick: () => void
  variant?: 'op' | 'fn' | 'equals' | 'zero'
  label?: string
}

function CalcKey({ children, onClick, variant, label }: CalcKeyProps) {
  const classe = `calc-key${variant ? ` calc-key-${variant}` : ''}`

  return (
    <button type="button" className={classe} onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

export function CalculatorPage() {
  const [estado, setEstado] = useState<EstadoCalculadora>(estadoInicial)

  const digitar = useCallback((digito: string) => {
    setEstado((atual) => {
      if (atual.display === 'Erro') {
        return { ...estadoInicial, display: digito }
      }

      if (atual.aguardando) {
        return { ...atual, display: digito, aguardando: false }
      }

      if (atual.display === '0') {
        return { ...atual, display: digito }
      }

      if (atual.display.replace(/[^0-9]/g, '').length >= 12) {
        return atual
      }

      return { ...atual, display: atual.display + digito }
    })
  }, [])

  const ponto = useCallback(() => {
    setEstado((atual) => {
      if (atual.display === 'Erro') {
        return { ...estadoInicial, display: '0.' }
      }

      if (atual.aguardando) {
        return { ...atual, display: '0.', aguardando: false }
      }

      if (atual.display.includes('.')) return atual

      return { ...atual, display: `${atual.display}.` }
    })
  }, [])

  const escolherOperador = useCallback((operador: Operador) => {
    setEstado((atual) => {
      if (atual.display === 'Erro') return atual

      const valorAtual = Number(atual.display)

      if (atual.anterior !== null && atual.operador && !atual.aguardando) {
        const resultado = calcular(atual.anterior, valorAtual, atual.operador)
        const expressao = `${formatar(atual.anterior)} ${atual.operador} ${formatar(valorAtual)}`

        if (!Number.isFinite(resultado)) {
          return {
            ...estadoInicial,
            display: 'Erro',
            historico: expressao,
          }
        }

        return {
          display: formatar(resultado),
          anterior: resultado,
          operador,
          aguardando: true,
          historico: `${formatar(resultado)} ${operador}`,
        }
      }

      return {
        ...atual,
        anterior: valorAtual,
        operador,
        aguardando: true,
        historico: `${formatar(valorAtual)} ${operador}`,
      }
    })
  }, [])

  const igual = useCallback(() => {
    setEstado((atual) => {
      if (atual.anterior === null || atual.operador === null) return atual

      const valorAtual = atual.aguardando ? atual.anterior : Number(atual.display)
      const resultado = calcular(atual.anterior, valorAtual, atual.operador)
      const expressao = `${formatar(atual.anterior)} ${atual.operador} ${formatar(valorAtual)} =`

      if (!Number.isFinite(resultado)) {
        return {
          ...estadoInicial,
          display: 'Erro',
          historico: expressao,
        }
      }

      return {
        display: formatar(resultado),
        anterior: null,
        operador: null,
        aguardando: true,
        historico: expressao,
      }
    })
  }, [])

  const limpar = useCallback(() => setEstado(estadoInicial), [])

  const apagar = useCallback(() => {
    setEstado((atual) => {
      if (atual.aguardando || atual.display === 'Erro') {
        return { ...atual, display: '0', aguardando: false }
      }

      const restante = atual.display.slice(0, -1)
      return {
        ...atual,
        display: restante === '' || restante === '-' ? '0' : restante,
      }
    })
  }, [])

  const alternarSinal = useCallback(() => {
    setEstado((atual) => {
      if (atual.display === '0' || atual.display === 'Erro') return atual

      return {
        ...atual,
        display: atual.display.startsWith('-')
          ? atual.display.slice(1)
          : `-${atual.display}`,
      }
    })
  }, [])

  const porcentagem = useCallback(() => {
    setEstado((atual) => {
      if (atual.display === 'Erro') return atual

      return {
        ...atual,
        display: formatar(Number(atual.display) / 100),
        aguardando: false,
      }
    })
  }, [])

  useEffect(() => {
    const mapaOperadores: Record<string, Operador> = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
    }

    function aoTeclar(evento: KeyboardEvent) {
      const { key } = evento

      if (/^[0-9]$/.test(key)) {
        evento.preventDefault()
        digitar(key)
        return
      }

      if (key === '.' || key === ',') {
        evento.preventDefault()
        ponto()
        return
      }

      if (key in mapaOperadores) {
        evento.preventDefault()
        escolherOperador(mapaOperadores[key])
        return
      }

      if (key === 'Enter' || key === '=') {
        evento.preventDefault()
        igual()
        return
      }

      if (key === 'Escape') {
        evento.preventDefault()
        limpar()
        return
      }

      if (key === 'Backspace') {
        evento.preventDefault()
        apagar()
        return
      }

      if (key === '%') {
        evento.preventDefault()
        porcentagem()
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [apagar, digitar, escolherOperador, igual, limpar, ponto, porcentagem])

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Nível iniciante"
          titulo="Calculadora funcional"
          descricao="Uma calculadora completa com operações encadeadas, porcentagem, troca de sinal e atalhos de teclado. Toda a lógica está em TypeScript, sem eval."
          conceitos={['useState', 'Lógica matemática', 'Eventos de teclado', 'Funções puras']}
        />

        <div className="calculator-wrap">
          <section className="calculator" aria-label="Calculadora">
            <div className="calc-display">
              <div className="calc-display-top">
                <span className="calc-history">{estado.historico || '\u00A0'}</span>
                <button
                  type="button"
                  className="calc-backspace"
                  onClick={apagar}
                  aria-label="Apagar último dígito"
                >
                  <Icone nome="fa-delete-left" tamanho={17} />
                </button>
              </div>
              <span
                className={`calc-value ${estado.display === 'Erro' ? 'is-error' : ''}`}
                aria-live="polite"
              >
                {estado.display}
              </span>
            </div>

            <div className="calc-grid">
              <CalcKey variant="fn" onClick={limpar} label="Limpar tudo">
                C
              </CalcKey>
              <CalcKey variant="fn" onClick={alternarSinal} label="Trocar sinal">
                ±
              </CalcKey>
              <CalcKey variant="fn" onClick={porcentagem} label="Porcentagem">
                %
              </CalcKey>
              <CalcKey variant="op" onClick={() => escolherOperador('÷')} label="Dividir">
                ÷
              </CalcKey>

              <CalcKey onClick={() => digitar('7')}>7</CalcKey>
              <CalcKey onClick={() => digitar('8')}>8</CalcKey>
              <CalcKey onClick={() => digitar('9')}>9</CalcKey>
              <CalcKey variant="op" onClick={() => escolherOperador('×')} label="Multiplicar">
                ×
              </CalcKey>

              <CalcKey onClick={() => digitar('4')}>4</CalcKey>
              <CalcKey onClick={() => digitar('5')}>5</CalcKey>
              <CalcKey onClick={() => digitar('6')}>6</CalcKey>
              <CalcKey variant="op" onClick={() => escolherOperador('-')} label="Subtrair">
                −
              </CalcKey>

              <CalcKey onClick={() => digitar('1')}>1</CalcKey>
              <CalcKey onClick={() => digitar('2')}>2</CalcKey>
              <CalcKey onClick={() => digitar('3')}>3</CalcKey>
              <CalcKey variant="op" onClick={() => escolherOperador('+')} label="Somar">
                +
              </CalcKey>

              <CalcKey variant="zero" onClick={() => digitar('0')}>
                0
              </CalcKey>
              <CalcKey onClick={ponto} label="Ponto decimal">
                .
              </CalcKey>
              <CalcKey variant="equals" onClick={igual} label="Calcular resultado">
                =
              </CalcKey>
            </div>
          </section>

          <aside className="panel calc-help">
            <h2>Como funciona</h2>
            <p>
              O estado guarda o valor exibido, o número anterior, o operador e se a
              calculadora está aguardando um novo número. Cada tecla apenas atualiza
              esse estado.
            </p>

            <ul>
              <li>
                <span>
                  <kbd>0</kbd>–<kbd>9</kbd>, <kbd>.</kbd>
                </span>
                Digitar números e decimais
              </li>
              <li>
                <span>
                  <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd> <kbd>/</kbd>
                </span>
                Escolher uma operação
              </li>
              <li>
                <span>
                  <kbd>Enter</kbd> ou <kbd>=</kbd>
                </span>
                Calcular o resultado
              </li>
              <li>
                <span>
                  <kbd>Esc</kbd>
                </span>
                Limpar a calculadora
              </li>
              <li>
                <span>
                  <kbd>Backspace</kbd>
                </span>
                Apagar o último dígito
              </li>
            </ul>

            <p className="calc-note">
              Dica: após o resultado, digite um número para iniciar um novo cálculo
              ou escolha um operador para continuar a partir dele.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
