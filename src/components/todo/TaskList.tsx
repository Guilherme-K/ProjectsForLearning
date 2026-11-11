import { CheckCheck, ClipboardList } from 'lucide-react'
import type { Filtro, Tarefa } from '../../types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tarefas: Tarefa[]
  filtro: Filtro
  onAlternar: (id: number) => void
  onRemover: (id: number) => void
}

const mensagens: Record<
  Filtro,
  { titulo: string; descricao: string; icone: typeof ClipboardList }
> = {
  todas: {
    titulo: 'Sua lista está vazia',
    descricao: 'Adicione a primeira tarefa usando o campo acima.',
    icone: ClipboardList,
  },
  pendentes: {
    titulo: 'Tudo em dia!',
    descricao: 'Você não tem nenhuma tarefa pendente no momento.',
    icone: CheckCheck,
  },
  concluidas: {
    titulo: 'Nada concluído ainda',
    descricao: 'Marque uma tarefa como concluída para vê-la aqui.',
    icone: CheckCheck,
  },
}

export function TaskList({ tarefas, filtro, onAlternar, onRemover }: TaskListProps) {
  if (tarefas.length === 0) {
    const { titulo, descricao, icone: Icone } = mensagens[filtro]

    return (
      <div className="empty-state">
        <span className="empty-state-icon">
          <Icone size={26} aria-hidden="true" />
        </span>
        <strong>{titulo}</strong>
        <p>{descricao}</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tarefas.map((tarefa) => (
        <TaskItem
          key={tarefa.id}
          tarefa={tarefa}
          onAlternar={onAlternar}
          onRemover={onRemover}
        />
      ))}
    </ul>
  )
}
