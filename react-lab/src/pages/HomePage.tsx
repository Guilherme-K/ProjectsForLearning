import { Link } from 'react-router-dom'
import { Icone } from '../components/Icone'

interface Recurso {
  para: string
  titulo: string
  descricao: string
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado'
  icone: string
  tom: string
}

interface Indicador {
  valor: string
  rotulo: string
  icone: string
  tom: string
}

const recursos: Recurso[] = [
  {
    para: '/tarefas',
    titulo: 'To-Do List interativa',
    descricao:
      'Adicione, conclua, remova e filtre tarefas. O projeto principal para dominar useState, componentes e eventos.',
    nivel: 'Iniciante',
    icone: 'fa-list-check',
    tom: 'blue',
  },
  {
    para: '/contador',
    titulo: 'Contador com passos',
    descricao:
      'Incremente, decremente e reinicie um valor. O exercício mais direto para entender o estado no React.',
    nivel: 'Iniciante',
    icone: 'fa-hashtag',
    tom: 'teal',
  },
  {
    para: '/calculadora',
    titulo: 'Calculadora funcional',
    descricao:
      'Operações encadeadas, porcentagem e suporte ao teclado, com toda a lógica matemática em TypeScript.',
    nivel: 'Iniciante',
    icone: 'fa-calculator',
    tom: 'green',
  },
  {
    para: '/cep',
    titulo: 'Buscador de CEP',
    descricao:
      'Consulte a API ViaCEP, trate erros e preencha automaticamente os campos de endereço.',
    nivel: 'Intermediário',
    icone: 'fa-map-pin',
    tom: 'orange',
  },
  {
    para: '/clima',
    titulo: 'Previsão do tempo',
    descricao:
      'Busque a cidade, consulte dados atuais e veja a previsão de cinco dias com a API Open-Meteo.',
    nivel: 'Intermediário',
    icone: 'fa-cloud-sun',
    tom: 'cyan',
  },
  {
    para: '/dashboard',
    titulo: 'Dashboard protegido',
    descricao:
      'Cadastro, login, contexto de autenticação e rotas privadas com redirecionamento inteligente.',
    nivel: 'Avançado',
    icone: 'fa-shield-halved',
    tom: 'navy',
  },
]

const indicadores: Indicador[] = [
  { valor: '6', rotulo: 'Projetos práticos', icone: 'fa-layer-group', tom: 'blue' },
  {
    valor: '3',
    rotulo: 'Níveis de desafio',
    icone: 'fa-graduation-cap',
    tom: 'teal',
  },
  { valor: '2', rotulo: 'APIs públicas', icone: 'fa-wifi', tom: 'green' },
  {
    valor: '100%',
    rotulo: 'Salvo no navegador',
    icone: 'fa-shield-halved',
    tom: 'orange',
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
        <section className="welcome">
          <div className="welcome-content">
            <span className="eyebrow">
              <Icone nome="fa-wand-magic-sparkles" tamanho={14} />
              Sala do Futuro · React Lab
            </span>

            <h1>
              Olá! Vamos aprender React <span className="text-highlight">na prática</span>?
            </h1>

            <p>
              Este é o seu espaço de estudos: uma trilha com projetos reais que vão
              da primeira lista de tarefas até autenticação com rotas protegidas.
            </p>

            <div className="hero-actions">
              <Link to="/tarefas" className="btn btn-primary">
                Começar pela To-Do List
                <Icone nome="fa-arrow-right" tamanho={17} />
              </Link>
              <a href="#recursos" className="btn btn-secondary">
                Explorar projetos
              </a>
            </div>
          </div>

          <div className="welcome-card" aria-label="Resumo da trilha">
            <span className="welcome-card-icon">
              <Icone nome="fa-compass" tamanho={22} />
            </span>
            <strong>Sua trilha de aprendizagem</strong>
            <p>6 projetos guiados, do useState às rotas protegidas.</p>
            <div className="welcome-progress">
              <span>Progresso da trilha</span>
              <strong>0 de 6</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '0%' }} />
            </div>
          </div>
        </section>

        <section className="stat-row" aria-label="Resumo do laboratório">
          {indicadores.map(({ valor, rotulo, icone, tom }) => (
            <article key={rotulo} className="stat-card">
              <span className={`stat-icon tone-${tom}`}>
                <Icone nome={icone} tamanho={20} />
              </span>
              <div>
                <strong>{valor}</strong>
                <span>{rotulo}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="portal-hero">
          <div className="portal-hero-content">
            <span className="portal-badge">
              <Icone nome="fa-wand-magic-sparkles" tamanho={14} />
              Trilha em destaque
            </span>
            <h2>Comece pela To-Do List e evolua até rotas protegidas</h2>
            <p>
              Cada projeto funciona de verdade no navegador e explora um conjunto
              diferente de conceitos: estado, componentes, eventos, APIs e
              autenticação.
            </p>
            <Link to="/tarefas" className="btn btn-light">
              Abrir To-Do List
              <Icone nome="fa-arrow-right" tamanho={17} />
            </Link>
          </div>

          <div className="portal-hero-panel" aria-hidden="true">
            <div className="preview-head">
              <span className="preview-dot" />
              Minhas tarefas
              <span className="preview-badge">3</span>
            </div>
            <div className="preview-item done">
              <span className="mini-check">
                <Icone nome="fa-check" tamanho={11} />
              </span>
              <span>Estudar useState</span>
            </div>
            <div className="preview-item done">
              <span className="mini-check">
                <Icone nome="fa-check" tamanho={11} />
              </span>
              <span>Componentizar a lista</span>
            </div>
            <div className="preview-item">
              <span className="mini-check" />
              <span>Consumir a API ViaCEP</span>
            </div>
          </div>
        </section>

        <section id="recursos" className="section">
          <div className="section-head">
            <div>
              <span className="section-kicker">Projetos</span>
              <h2>Escolha um projeto e comece</h2>
              <p>
                Cada página funciona de verdade e explora um conjunto diferente de
                conceitos.
              </p>
            </div>
            <span className="section-count">6 projetos disponíveis</span>
          </div>

          <div className="feature-grid">
            {recursos.map(({ para, titulo, descricao, nivel, icone, tom }) => (
              <Link key={para} to={para} className="feature-card">
                <span className={`feature-icon tone-${tom}`}>
                  <Icone nome={icone} tamanho={22} />
                </span>

                <div>
                  <h3>{titulo}</h3>
                  <p>{descricao}</p>
                </div>

                <div className="feature-meta">
                  <span className={`level-badge level-${classeDoNivel(nivel)}`}>
                    {nivel}
                  </span>
                  <Icone
                    nome="fa-arrow-right"
                    tamanho={18}
                    className="feature-arrow"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="inspiration-note">
          <span className="inspiration-icon">
            <Icone nome="fa-compass" tamanho={22} />
          </span>
          <div>
            <strong>Inspirado na Sala do Futuro</strong>
            <p>
              A identidade visual deste laboratório foi inspirada no portal Sala do
              Futuro, da Secretaria da Educação do Estado de São Paulo. Todo o
              conteúdo e os projetos são originais deste estudo de React.
            </p>
          </div>
          <a
            className="inspiration-link"
            href="https://saladofuturo.educacao.sp.gov.br/"
            target="_blank"
            rel="noreferrer"
          >
            Visitar portal
            <Icone nome="fa-arrow-up-right-from-square" tamanho={15} />
          </a>
        </section>

        <div className="stack-strip" aria-label="Tecnologias usadas">
          <span className="stack-label">Stack do projeto</span>
          {tecnologias.map((tecnologia) => (
            <span key={tecnologia} className="stack-item">
              <span className="stack-dot" aria-hidden="true" />
              {tecnologia}
            </span>
          ))}
          <span className="stack-check">
            <Icone nome="fa-circle-check" tamanho={15} />
            APIs públicas sem chave
          </span>
        </div>
      </div>
    </div>
  )
}
