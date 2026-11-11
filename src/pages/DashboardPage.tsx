import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  CloudSun,
  Database,
  KeyRound,
  ListTodo,
  LogOut,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function obterIniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
}

const informacoes = [
  {
    icone: ShieldCheck,
    titulo: 'Rota privada',
    texto: 'Esta página só é exibida porque existe uma sessão ativa.',
  },
  {
    icone: Database,
    titulo: 'Sessão persistida',
    texto: 'O login continua válido ao recarregar a página, graças ao localStorage.',
  },
  {
    icone: KeyRound,
    titulo: 'Autenticação simulada',
    texto: 'Cadastro e login são validados localmente, sem backend ou API externa.',
  },
]

const atalhos = [
  { para: '/tarefas', rotulo: 'To-Do List', icone: ListTodo },
  { para: '/calculadora', rotulo: 'Calculadora', icone: Calculator },
  { para: '/cep', rotulo: 'Buscador de CEP', icone: MapPin },
  { para: '/clima', rotulo: 'Previsão do tempo', icone: CloudSun },
]

export function DashboardPage() {
  const { usuario, logout } = useAuth()
  const navegar = useNavigate()

  if (!usuario) return null

  function sair() {
    logout()
    navegar('/login', { replace: true })
  }

  return (
    <div className="page">
      <div className="container">
        <section className="dashboard-hero">
          <div className="dashboard-user">
            <span className="dashboard-avatar" aria-hidden="true">
              {obterIniciais(usuario.nome)}
            </span>
            <div>
              <span className="dashboard-eyebrow">
                <ShieldCheck size={14} aria-hidden="true" />
                Sessão protegida
              </span>
              <h1>Olá, {usuario.nome.split(' ')[0]}!</h1>
              <p>{usuario.email}</p>
            </div>
          </div>

          <button type="button" className="btn btn-light" onClick={sair}>
            <LogOut size={17} aria-hidden="true" />
            Encerrar sessão
          </button>
        </section>

        <div className="dashboard-grid">
          {informacoes.map(({ icone: Icone, titulo, texto }) => (
            <article key={titulo} className="panel dash-card">
              <Icone size={22} aria-hidden="true" />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>

        <section className="panel dashboard-links-panel">
          <h2>Continue praticando</h2>
          <p>Aproveite a sessão ativa e visite os outros projetos do React Lab.</p>

          <div className="dashboard-links">
            {atalhos.map(({ para, rotulo, icone: Icone }) => (
              <Link key={para} to={para} className="dashboard-link">
                <Icone size={19} aria-hidden="true" />
                <span>{rotulo}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
