import { Icone } from './Icone'

export function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-brand">
        <span className="brand-mark">
          <Icone nome="fa-wand-magic-sparkles" tamanho={19} />
        </span>
        <span>
          <strong>Sala do Futuro</strong>
          <small>React Lab</small>
        </span>
      </div>

      <div className="auth-aside-content">
        <span className="auth-aside-eyebrow">Área do estudante</span>
        <h2>Seu progresso, em um só lugar.</h2>
        <p>
          Entre para acessar o dashboard protegido e continuar a trilha de
          projetos do laboratório.
        </p>

        <ul className="auth-aside-list">
          <li>
            <Icone nome="fa-shield-halved" tamanho={18} />
            Rota privada com redirecionamento inteligente
          </li>
          <li>
            <Icone nome="fa-database" tamanho={18} />
            Sessão salva no navegador via localStorage
          </li>
          <li>
            <Icone nome="fa-wand-magic-sparkles" tamanho={18} />
            Autenticação simulada, sem backend
          </li>
        </ul>
      </div>

      <p className="auth-aside-note">
        Visual inspirado no portal Sala do Futuro · projeto de estudo com React +
        TypeScript.
      </p>
    </aside>
  )
}
