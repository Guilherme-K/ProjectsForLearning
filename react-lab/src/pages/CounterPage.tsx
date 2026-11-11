import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Icone } from '../components/Icone'

const passos = [1, 5, 10]

export function CounterPage() {
  const [contador, setContador] = useState(0)
  const [passo, setPasso] = useState(1)

  const sinal = contador > 0 ? 'positive' : contador < 0 ? 'negative' : ''

  return (
    <div className="page">
      <div className="container container-narrow">
        <PageHeader
          eyebrow="Nível iniciante"
          titulo="Contador interativo"
          descricao="Incremente, decremente e reinicie o valor. Escolha um passo para acelerar a contagem e observe o estado sendo atualizado na tela."
          conceitos={['useState', 'Eventos onClick', 'Renderização condicional']}
        />

        <section className="panel counter-panel" aria-label="Contador">
          <div className={`counter-display ${sinal}`}>
            <span className="counter-label">Valor atual</span>
            <strong className="counter-value" aria-live="polite">
              {contador}
            </strong>
            <span className="counter-hint">
              {contador === 0
                ? 'Comece a contar usando os botões abaixo'
                : `Variando de ${passo} em ${passo}`}
            </span>
          </div>

          <div className="counter-actions">
            <button
              type="button"
              className="btn btn-secondary counter-btn"
              onClick={() => setContador((valor) => valor - passo)}
              aria-label={`Diminuir ${passo}`}
            >
              <Icone nome="fa-minus" tamanho={26} />
            </button>

            <button
              type="button"
              className="btn btn-primary counter-btn"
              onClick={() => setContador((valor) => valor + passo)}
              aria-label={`Aumentar ${passo}`}
            >
              <Icone nome="fa-plus" tamanho={26} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-ghost counter-reset"
            onClick={() => setContador(0)}
            disabled={contador === 0}
          >
            <Icone nome="fa-rotate-left" tamanho={16} />
            Resetar
          </button>

          <div className="step-picker">
            <span>Passo:</span>
            {passos.map((opcao) => (
              <button
                key={opcao}
                type="button"
                className={passo === opcao ? 'active' : ''}
                aria-pressed={passo === opcao}
                onClick={() => setPasso(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
