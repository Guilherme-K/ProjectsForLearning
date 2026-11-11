import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Calculator,
  CloudSun,
  Hash,
  ListTodo,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface LinkNavegacao {
  para: string
  rotulo: string
  icone: LucideIcon
}

const links: LinkNavegacao[] = [
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
  const [menuAberto, setMenuAberto] = useState(false)

  function sair() {
    setMenuAberto(false)
    logout()
    navegar('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <ScrollToTop />

      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" onClick={() => setMenuAberto(false)}>
            <span className="brand-mark">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span>React Lab</span>
          </Link>

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

          <nav
            id="menu-principal"
            className={`main-nav ${menuAberto ? 'is-open' : ''}`}
            aria-label="Navegação principal"
          >
            {links.map(({ para, rotulo, icone: Icone }) => (
              <NavLink
                key={para}
                to={para}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuAberto(false)}
              >
                <Icone size={16} aria-hidden="true" />
                {rotulo}
              </NavLink>
            ))}

            <div className="nav-auth">
              {usuario ? (
                <>
                  <Link
                    to="/dashboard"
                    className="user-chip"
                    onClick={() => setMenuAberto(false)}
                  >
                    <span className="avatar" aria-hidden="true">
                      {obterIniciais(usuario.nome)}
                    </span>
                    <span className="user-chip-name">
                      {usuario.nome.split(' ')[0]}
                    </span>
                  </Link>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={sair}>
                    <LogOut size={15} aria-hidden="true" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm"
                  onClick={() => setMenuAberto(false)}
                >
                  <Lock size={15} aria-hidden="true" />
                  Entrar
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>React Lab · Projeto de estudo com React + TypeScript</p>
          <p>Dados salvos localmente no seu navegador · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
