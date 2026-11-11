import { PageHeader } from '../components/PageHeader'
import { TodoApp } from '../components/todo/TodoApp'

export function TodoPage() {
  return (
    <div className="page">
      <div className="container container-narrow">
        <PageHeader
          eyebrow="Nível iniciante"
          titulo="To-Do List interativa"
          descricao="Adicione novas tarefas, marque como concluídas, remova itens e filtre a lista. As tarefas ficam salvas no navegador."
          conceitos={['useState', 'Componentização', '.map() com key', 'Eventos']}
        />

        <TodoApp />
      </div>
    </div>
  )
}
