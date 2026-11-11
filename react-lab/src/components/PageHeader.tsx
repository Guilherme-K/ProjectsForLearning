import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  titulo: string
  descricao: string
  conceitos?: string[]
  children?: ReactNode
}

export function PageHeader({
  eyebrow,
  titulo,
  descricao,
  conceitos = [],
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{titulo}</h1>
      <p>{descricao}</p>

      {conceitos.length > 0 && (
        <ul className="concept-pills" aria-label="Conceitos praticados">
          {conceitos.map((conceito) => (
            <li key={conceito}>{conceito}</li>
          ))}
        </ul>
      )}

      {children}
    </header>
  )
}
