import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  CloudSun,
  Hash,
  ListTodo,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Recurso {
  para: string
  titulo: string
  descricao: string
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado'
  icone: LucideIcon
  tom: string
}

const recursos: Recurso[] = [
  {
    para: '/tarefas',
    titulo: 'To-Do List interativa',
    descricao:
      'Adicione, conclua, remova e filtre tarefas. O projeto principal para dominar useState, componentes e eventos.',
    nivel: 'Iniciante',
    icone: ListTodo,
    tom: 'violet',
  },
  {
    para: '/contador',
    titulo: 'Contador com passos',
    descricao:
      'Incremente, decremente e reinicie um valor. O exercício mais direto para entender o estado no React.',
    nivel: 'Iniciante',
    icone: Hash,
    tom: 'blue',
  },
  {
    para: '/calculadora',
    titulo: 'Calculadora funcional',
    descricao:
      'Operações encadeadas, porcentagem e suporte ao teclado, com toda a lógica matemática em TypeScript.',
    nivel: 'Iniciante',
    icone: Calculator,
    tom: 'green',
  },
  {
    para: '/cep',
    titulo: 'Buscador de CEP',
    descricao:
      'Consulte a API ViaCEP, trate erros e preencha automaticamente os campos de endereço.',
    nivel: 'Intermediário',
    icone: MapPin,
    tom: 'orange',
  },
  {
    para: '/clima',
    titulo: 'Previsão do tempo',
    descricao:
      'Busque a cidade, consulte dados atuais e veja a previsão de cinco dias com a API Open-Meteo.',
    nivel: 'Intermediário',
    icone: CloudSun,
    tom: 'cyan',
  },
  {
    para: '/dashboard',
    titulo: 'Dashboard protegido',
    descricao:
      'Cadastro, login, contexto de autenticação e rotas privadas com redirecionamento inteligente.',
    nivel: 'Avançado',
    icone: ShieldCheck,
    tom: 'pink',
  },
]

function classeDoNivel(nivel: Recurso['nivel']): string {
  return nivel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const tecnologias = [
  'React 19',
  'TypeScript',
  'Vite',
  'React Router',
  'ViaCEP',
  'Open-Meteo',
]

export function HomePage() {
  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              React + TypeScript
            </span>

            <h1>
              Aprenda React construindo{' '}
              <span className="gradient-text">projetos de verdade.</span>
            </h1>

            <p>
              Uma coleção prática com os níveis iniciante, intermediário e avançado:
              da primeira lista de tarefas até autenticação com rotas protegidas.
            </p>

            <div className="hero-actions">
              <Link to="/tarefas" className="btn btn-primary">
                Começar pela To-Do List
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a href="#recursos" className="btn btn-secondary">
                Explorar projetos
              </a>
            </div>

            <ul className="hero-checks">
              <li>
                <CheckCircle2 size={17} aria-hidden="true" />
                Componentes e useState
              </li>
              <li>
                <CheckCircle2 size={17} aria-hidden="true" />
                Consumo de APIs
              </li>
              <li>
                <CheckCircle2 size={17} aria-hidden="true" />
                Rotas protegidas
              </li>
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="floating-card todo-preview">
              <div className="preview-head">
                <span className="preview-dot" />
                Minhas tarefas
                <span className="preview-badge">3</span>
              </div>
              <div className="preview-item done">
                <span className="mini-check">
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>Estudar useState</span>
              </div>
              <div className="preview-item done">
                <span className="mini-check">
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>Componentizar a lista</span>
              </div>
              <div className="preview-item">
                <span className="mini-check" />
                <span>Consumir a API ViaCEP</span>
              </div>
            </div>

            <div className="floating-card stat-preview">
              <TrendingUp size={22} />
              <div>
                <strong>6 projetos</strong>
                <span>para praticar</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="recursos" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Trilha prática</span>
              <h2>Escolha um projeto e comece</h2>
              <p>Cada página funciona de verdade e explora um conjunto diferente de conceitos.</p>
            </div>
          </div>

          <div className="feature-grid">
            {recursos.map(({ para, titulo, descricao, nivel, icone: Icone, tom }) => (
              <Link key={para} to={para} className="feature-card">
                <span className={`feature-icon tone-${tom}`}>
                  <Icone size={23} aria-hidden="true" />
                </span>

                <div>
                  <h3>{titulo}</h3>
                  <p>{descricao}</p>
                </div>

                <div className="feature-meta">
                  <span className={`level-badge level-${classeDoNivel(nivel)}`}>
                    {nivel}
                  </span>
                  <ArrowRight
                    size={18}
                    className="feature-arrow"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="stack-strip" aria-label="Tecnologias usadas">
            <span className="stack-label">Stack do projeto</span>
            {tecnologias.map((tecnologia) => (
              <span key={tecnologia} className="stack-item">
                <span className="stack-dot" aria-hidden="true" />
                {tecnologia}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
