import { Database, ShieldCheck, Sparkles } from 'lucide-react'

export function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-brand">
        <span className="brand-mark">
          <Sparkles size={19} aria-hidden="true" />
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
            <ShieldCheck size={18} aria-hidden="true" />
            Rota privada com redirecionamento inteligente
          </li>
          <li>
            <Database size={18} aria-hidden="true" />
            Sessão salva no navegador via localStorage
          </li>
          <li>
            <Sparkles size={18} aria-hidden="true" />
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
