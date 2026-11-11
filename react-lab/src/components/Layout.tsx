import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Calculator,
  CloudSun,
  Hash,
  Home,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface LinkNavegacao {
  para: string
  rotulo: string
  icone: LucideIcon
  fim?: boolean
}

const linksPrincipais: LinkNavegacao[] = [
  { para: '/', rotulo: 'Início', icone: Home, fim: true },
]

const linksProjetos: LinkNavegacao[] = [
  { para: '/tarefas', rotulo: 'Tarefas', icone: ListTodo },
  { para: '/contador', rotulo: 'Contador', icone: Hash },
  { para: '/calculadora', rotulo: 'Calculadora', icone: Calculator },
  { para: '/cep', rotulo: 'CEP', icone: MapPin },
  { para: '/clima', rotulo: 'Clima', icone: CloudSun },
]

function obterIniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export function Layout() {
  const { usuario, logout } = useAuth()
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    setMenuAberto(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAberto])

  function sair() {
    setMenuAberto(false)
    logout()
    navegar('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <ScrollToTop />

      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setMenuAberto(false)}>
            <span className="brand-mark">
              <Sparkles size={19} aria-hidden="true" />
            </span>
            <span className="brand-text">
              <strong>Sala do Futuro</strong>
              <small>React Lab</small>
            </span>
          </Link>

          <div className="header-right">
            <span className="header-context">
              <span className="header-dot" aria-hidden="true" />
              Ambiente de estudos
            </span>

            <div className="nav-auth">
              {usuario ? (
                <>
                  <Link to="/dashboard" className="user-chip">
                    <span className="avatar" aria-hidden="true">
                      {obterIniciais(usuario.nome)}
                    </span>
                    <span className="user-chip-text">
                      <span className="user-chip-name">{usuario.nome.split(' ')[0]}</span>
                      <span className="user-chip-role">Meu painel</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm header-logout"
                    onClick={sair}
                  >
                    <LogOut size={15} aria-hidden="true" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cadastro" className="btn btn-secondary btn-sm header-signup">
                    <UserPlus size={15} aria-hidden="true" />
                    Criar conta
                  </Link>
                  <Link to="/login" className="btn btn-primary btn-sm">
                    <Lock size={15} aria-hidden="true" />
                    Entrar
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="menu-button"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              aria-controls="menu-principal"
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              {menuAberto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <button
          type="button"
          className={`sidebar-overlay ${menuAberto ? 'is-open' : ''}`}
          aria-label="Fechar menu de navegação"
          tabIndex={menuAberto ? 0 : -1}
          onClick={() => setMenuAberto(false)}
        />

        <aside
          id="menu-principal"
          className={`sidebar ${menuAberto ? 'is-open' : ''}`}
          aria-label="Menu lateral"
        >
          <nav className="sidebar-nav" aria-label="Navegação principal">
            <span className="sidebar-label">Visão geral</span>
            {linksPrincipais.map(({ para, rotulo, icone: Icone, fim }) => (
              <NavLink
                key={para}
                to={para}
                end={fim}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icone size={18} aria-hidden="true" />
                {rotulo}
              </NavLink>
            ))}

            <span className="sidebar-label">Projetos</span>
            {linksProjetos.map(({ para, rotulo, icone: Icone }) => (
              <NavLink
                key={para}
                to={para}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icone size={18} aria-hidden="true" />
                {rotulo}
              </NavLink>
            ))}

            <span className="sidebar-label">Conta</span>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} aria-hidden="true" />
              Meu painel
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            {usuario ? (
              <button type="button" className="sidebar-action" onClick={sair}>
                <LogOut size={17} aria-hidden="true" />
                Encerrar sessão
              </button>
            ) : (
              <Link to="/login" className="sidebar-action">
                <Lock size={17} aria-hidden="true" />
                Entrar na conta
              </Link>
            )}
            <p className="sidebar-note">
              React + TypeScript
              <br />
              Projeto de estudo
            </p>
          </div>
        </aside>

        <div className="content-shell">
          <main className="site-main">
            <Outlet />
          </main>

          <footer className="site-footer">
            <div className="footer-inner">
              <p>
                Sala do Futuro · React Lab — laboratório de estudos com React +
                TypeScript
              </p>
              <p>
                Inspirado visualmente no portal{' '}
                <a
                  href="https://saladofuturo.educacao.sp.gov.br/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sala do Futuro
                </a>{' '}
                · {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
