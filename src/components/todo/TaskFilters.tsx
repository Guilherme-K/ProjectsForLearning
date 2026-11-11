import type { Filtro } from '../../types'

interface TaskFiltersProps {
  filtro: Filtro
  contagens: Record<Filtro, number>
  onChange: (filtro: Filtro) => void
}

const opcoes: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'pendentes', rotulo: 'Pendentes' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
]

export function TaskFilters({ filtro, contagens, onChange }: TaskFiltersProps) {
  return (
    <div className="filters" role="group" aria-label="Filtrar tarefas">
      {opcoes.map(({ valor, rotulo }) => (
        <button
          key={valor}
          type="button"
          className={`filter-button ${filtro === valor ? 'active' : ''}`}
          aria-pressed={filtro === valor}
          onClick={() => onChange(valor)}
        >
          {rotulo}
          <span className="filter-count">{contagens[valor]}</span>
        </button>
      ))}
    </div>
  )
}
