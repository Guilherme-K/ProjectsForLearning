import { Icone } from '../Icone'

interface TaskSummaryProps {
  total: number
  concluidas: number
  onLimparConcluidas: () => void
}

export function TaskSummary({
  total,
  concluidas,
  onLimparConcluidas,
}: TaskSummaryProps) {
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100)

  return (
    <div className="task-summary">
      <div className="task-progress">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentual}
          aria-label="Progresso das tarefas"
        >
          <div className="progress-fill" style={{ width: `${percentual}%` }} />
        </div>
        <span>
          {concluidas} de {total} {total === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-sm btn-clear"
        onClick={onLimparConcluidas}
        disabled={concluidas === 0}
      >
        <Icone nome="fa-trash-can" tamanho={15} />
        Limpar concluídas
      </button>
    </div>
  )
}
