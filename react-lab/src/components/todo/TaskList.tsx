import type { Filtro, Tarefa } from '../../types'
import { Icone } from '../Icone'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tarefas: Tarefa[]
  filtro: Filtro
  onAlternar: (id: number) => void
  onRemover: (id: number) => void
}

const mensagens: Record<
  Filtro,
  { titulo: string; descricao: string; icone: string }
> = {
  todas: {
    titulo: 'Sua lista está vazia',
    descricao: 'Adicione a primeira tarefa usando o campo acima.',
    icone: 'fa-clipboard-list',
  },
  pendentes: {
    titulo: 'Tudo em dia!',
    descricao: 'Você não tem nenhuma tarefa pendente no momento.',
    icone: 'fa-check-double',
  },
  concluidas: {
    titulo: 'Nada concluído ainda',
    descricao: 'Marque uma tarefa como concluída para vê-la aqui.',
    icone: 'fa-check-double',
  },
}

export function TaskList({ tarefas, filtro, onAlternar, onRemover }: TaskListProps) {
  if (tarefas.length === 0) {
    const { titulo, descricao, icone } = mensagens[filtro]

    return (
      <div className="empty-state">
        <span className="empty-state-icon">
          <Icone nome={icone} tamanho={26} />
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
