import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="not-found">
          <span className="empty-state-icon">
            <Compass size={30} aria-hidden="true" />
          </span>
          <span className="eyebrow">Erro 404</span>
          <h1>404</h1>
          <p>A página que você tentou acessar não existe ou foi movida.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={17} aria-hidden="true" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
