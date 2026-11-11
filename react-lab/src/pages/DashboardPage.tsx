import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Icone } from '../components/Icone'

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
    icone: 'fa-shield-halved',
    titulo: 'Rota privada',
    texto: 'Esta página só é exibida porque existe uma sessão ativa.',
  },
  {
    icone: 'fa-database',
    titulo: 'Sessão persistida',
    texto: 'O login continua válido ao recarregar a página, graças ao localStorage.',
  },
  {
    icone: 'fa-key',
    titulo: 'Autenticação simulada',
    texto: 'Cadastro e login são validados localmente, sem backend ou API externa.',
  },
]

const atalhos = [
  { para: '/tarefas', rotulo: 'To-Do List', icone: 'fa-list-check' },
  { para: '/calculadora', rotulo: 'Calculadora', icone: 'fa-calculator' },
  { para: '/cep', rotulo: 'Buscador de CEP', icone: 'fa-map-pin' },
  { para: '/clima', rotulo: 'Previsão do tempo', icone: 'fa-cloud-sun' },
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
                <Icone nome="fa-shield-halved" tamanho={14} />
                Sessão protegida
              </span>
              <h1>Olá, {usuario.nome.split(' ')[0]}!</h1>
              <p>{usuario.email}</p>
            </div>
          </div>

          <button type="button" className="btn btn-light" onClick={sair}>
            <Icone nome="fa-right-from-bracket" tamanho={17} />
            Encerrar sessão
          </button>
        </section>

        <div className="dashboard-grid">
          {informacoes.map(({ icone, titulo, texto }) => (
            <article key={titulo} className="panel dash-card">
              <Icone nome={icone} tamanho={22} />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>

        <section className="panel dashboard-links-panel">
          <h2>Continue praticando</h2>
          <p>Aproveite a sessão ativa e visite os outros projetos do React Lab.</p>

          <div className="dashboard-links">
            {atalhos.map(({ para, rotulo, icone }) => (
              <Link key={para} to={para} className="dashboard-link">
                <Icone nome={icone} tamanho={19} />
                <span>{rotulo}</span>
                <Icone nome="fa-arrow-right" tamanho={17} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
