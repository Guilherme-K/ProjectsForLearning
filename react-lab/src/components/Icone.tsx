import type { CSSProperties } from 'react'

interface IconeProps {
  /** Classe do Font Awesome, por exemplo "fa-list-check". */
  nome: string
  /** Tamanho em pixels (aplica font-size no ícone). */
  tamanho?: number
  className?: string
  estilo?: CSSProperties
}

/**
 * Ícone decorativo do Font Awesome.
 * O nome recebido é a classe do ícone, sem o prefixo de estilo.
 */
export function Icone({ nome, tamanho = 16, className, estilo }: IconeProps) {
  return (
    <i
      className={`fa-solid ${nome}${className ? ` ${className}` : ''}`}
      style={{ fontSize: `${tamanho}px`, ...estilo }}
      aria-hidden="true"
    />
  )
}
