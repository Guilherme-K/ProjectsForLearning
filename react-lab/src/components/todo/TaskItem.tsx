import type { Tarefa } from '../../types'
import { Icone } from '../Icone'

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
        {tarefa.concluida && <Icone nome="fa-check" tamanho={13} />}
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
        <Icone nome="fa-trash-can" tamanho={17} />
      </button>
    </li>
  )
}
