import { Link } from 'react-router-dom'
import { Icone } from '../components/Icone'

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="not-found">
          <span className="empty-state-icon">
            <Icone nome="fa-compass" tamanho={30} />
          </span>
          <span className="eyebrow">Erro 404</span>
          <h1>404</h1>
          <p>A página que você tentou acessar não existe ou foi movida.</p>
          <Link to="/" className="btn btn-primary">
            <Icone nome="fa-arrow-left" tamanho={17} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
