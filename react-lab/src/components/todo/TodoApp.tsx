import { useMemo, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Filtro, Tarefa } from '../../types'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { TaskSummary } from './TaskSummary'

const agora = Date.now()

const tarefasIniciais: Tarefa[] = [
  {
    id: agora - 2,
    texto: 'Revisar os conceitos de useState',
    concluida: true,
    criadaEm: agora - 2,
  },
  {
    id: agora - 1,
    texto: 'Criar um componente reutilizável',
    concluida: false,
    criadaEm: agora - 1,
  },
  {
    id: agora,
    texto: 'Praticar renderização de listas com .map()',
    concluida: false,
    criadaEm: agora,
  },
]

export function TodoApp() {
  const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>(
    'react-lab:tarefas',
    tarefasIniciais,
  )
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const contagens = useMemo<Record<Filtro, number>>(() => {
    const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length

    return {
      todas: tarefas.length,
      pendentes: tarefas.length - concluidas,
      concluidas,
    }
  }, [tarefas])

  const tarefasFiltradas = useMemo(() => {
    if (filtro === 'pendentes') {
      return tarefas.filter((tarefa) => !tarefa.concluida)
    }

    if (filtro === 'concluidas') {
      return tarefas.filter((tarefa) => tarefa.concluida)
    }

    return tarefas
  }, [filtro, tarefas])

  function adicionarTarefa(texto: string) {
    setTarefas((atuais) => [
      {
        id: Date.now(),
        texto,
        concluida: false,
        criadaEm: Date.now(),
      },
      ...atuais,
    ])
  }

  function alternarConclusao(id: number) {
    setTarefas((atuais) =>
      atuais.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa,
      ),
    )
  }

  function removerTarefa(id: number) {
    setTarefas((atuais) => atuais.filter((tarefa) => tarefa.id !== id))
  }

  function limparConcluidas() {
    setTarefas((atuais) => atuais.filter((tarefa) => !tarefa.concluida))
  }

  return (
    <section className="panel todo-panel" aria-label="Lista de tarefas">
      <div className="todo-panel-head">
        <div>
          <h2>Minha lista</h2>
          <p>Clique no texto ou no marcador para concluir uma tarefa.</p>
        </div>
        <span className="todo-total" aria-label={`${tarefas.length} tarefas no total`}>
          {tarefas.length}
        </span>
      </div>

      <TaskForm onAdicionar={adicionarTarefa} />

      <TaskFilters filtro={filtro} contagens={contagens} onChange={setFiltro} />

      <TaskList
        tarefas={tarefasFiltradas}
        filtro={filtro}
        onAlternar={alternarConclusao}
        onRemover={removerTarefa}
      />

      <TaskSummary
        total={contagens.todas}
        concluidas={contagens.concluidas}
        onLimparConcluidas={limparConcluidas}
      />

      <p className="todo-tip">
        <Lightbulb size={15} aria-hidden="true" />
        Suas tarefas ficam salvas neste navegador, mesmo ao recarregar a página.
      </p>
    </section>
  )
}
