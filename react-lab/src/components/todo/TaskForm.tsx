import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icone } from '../Icone'

interface TaskFormProps {
  onAdicionar: (texto: string) => void
}

export function TaskForm({ onAdicionar }: TaskFormProps) {
  const [texto, setTexto] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const textoSemEspacos = texto.trim()

    if (!textoSemEspacos) {
      inputRef.current?.focus()
      return
    }

    onAdicionar(textoSemEspacos)
    setTexto('')
    inputRef.current?.focus()
  }

  return (
    <form className="todo-form" onSubmit={enviar}>
      <label htmlFor="nova-tarefa" className="sr-only">
        Nova tarefa
      </label>
      <input
        id="nova-tarefa"
        ref={inputRef}
        type="text"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder="O que você precisa fazer?"
        maxLength={120}
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">
        <Icone nome="fa-plus" tamanho={18} />
        Adicionar
      </button>
    </form>
  )
}
