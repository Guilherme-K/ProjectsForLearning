import { Check, Trash2 } from 'lucide-react'
import type { Tarefa } from '../../types'

interface TaskItemProps {
  tarefa: Tarefa
  onAlternar: (id: number) => void
  onRemover: (id: number) => void
}

export function TaskItem({ tarefa, onAlternar, onRemover }: TaskItemProps) {
  const acao = tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'

  return (
    <li className={`task-item ${tarefa.concluida ? 'is-done' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={tarefa.concluida}
        aria-label={`${acao}: ${tarefa.texto}`}
        className="task-check"
        onClick={() => onAlternar(tarefa.id)}
      >
        {tarefa.concluida && <Check size={14} strokeWidth={3} aria-hidden="true" />}
      </button>

      <button
        type="button"
        className="task-text"
        onClick={() => onAlternar(tarefa.id)}
        title={acao}
      >
        {tarefa.texto}
      </button>

      <button
        type="button"
        className="icon-button task-delete"
        onClick={() => onRemover(tarefa.id)}
        aria-label={`Remover tarefa: ${tarefa.texto}`}
      >
        <Trash2 size={17} aria-hidden="true" />
      </button>
    </li>
  )
}
