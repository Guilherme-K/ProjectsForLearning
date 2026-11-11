# Sala do Futuro · React Lab — Projetos com React + TypeScript

Aplicação de estudo que reúne os três níveis pedidos no desafio: **iniciante**, **intermediário** e **avançado**. Todos os projetos funcionam de verdade, com layout responsivo e persistência local quando faz sentido.

O projeto principal é a **To-Do List interativa**, construída com `useState`, componentização, renderização de listas com `.map()` e manipulação de eventos.

A identidade visual foi inspirada no portal [Sala do Futuro](https://saladofuturo.educacao.sp.gov.br/), da Secretaria da Educação do Estado de São Paulo: header branco, menu lateral, cards claros, azul institucional e tipografia Open Sans. Todo o conteúdo, os textos e os projetos são originais deste laboratório de estudos.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- lucide-react (ícones)
- Open Sans (Google Fonts)
- CSS puro e responsivo

## Design

- Header fixo de 64px com marca, contexto e controles de conta.
- Menu lateral com atalhos para todos os projetos e para o painel protegido; em telas menores ele vira uma gaveta com overlay.
- Paleta baseada no portal: fundo `#F4F5F7`, texto `#183B56`, azul `#1565D8` e teal `#3091B1`.
- Cards com raio de 12–16px, sombras discretas e estados de foco acessíveis.
- Layout testado em 320, 375, 768, 1024 e 1440px, sem rolagem horizontal.

## Como rodar

Pré-requisito: Node.js 20.19+ (ou 22.12+).

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build    # checagem de tipos + build de produção
npm run preview  # serve o build de produção localmente
```

## Níveis e funcionalidades

### Iniciante

**To-Do List interativa** (`/tarefas`)

- Adicionar tarefas pelo formulário.
- Marcar/desmarcar como concluída clicando no marcador ou no texto, com riscado visual.
- Remover tarefas individualmente.
- Filtrar por **Todas**, **Pendentes** e **Concluídas**, com contadores.
- Barra de progresso, limpeza das tarefas concluídas e estado vazio.
- Tarefas salvas em `localStorage` (`react-lab:tarefas`).

Componentes separados: `TaskForm`, `TaskFilters`, `TaskList`, `TaskItem` e `TaskSummary`.

**Contador** (`/contador`)

- Incrementar, decrementar e reiniciar.
- Passo configurável (1, 5 ou 10).
- Cores diferentes para valores positivos e negativos.

**Calculadora** (`/calculadora`)

- Operações encadeadas de soma, subtração, multiplicação e divisão.
- Porcentagem, troca de sinal, ponto decimal, apagar e limpar.
- Suporte a teclado: números, `+ - * /`, `Enter`/`=`, `Esc`, `Backspace` e `%`.
- Lógica matemática em TypeScript, sem `eval`.

### Intermediário

**Buscador de CEP** (`/cep`)

- Consulta a API pública [ViaCEP](https://viacep.com.br/).
- Validação do formato do CEP, estado de carregamento e tratamento de erros.
- Exibe logradouro, bairro, cidade, UF, DDD e código IBGE.
- Sugestões de CEPs para teste.

**Previsão do tempo** (`/clima`)

- Busca cidade pela API de geocodificação do [Open-Meteo](https://open-meteo.com/).
- Mostra temperatura, sensação térmica, umidade, vento, precipitação e condição atual.
- Previsão de 5 dias com máximas e mínimas.
- Não exige chave de API.

### Avançado

**Autenticação simulada + rotas protegidas** (`/login`, `/cadastro`, `/dashboard`)

- Cadastro com validação de nome, e-mail e senha.
- Login com simulação de requisição assíncrona.
- Sessão persistida em `localStorage` (`react-lab:sessao`).
- Rota `/dashboard` protegida por `ProtectedRoute`: sem sessão, redireciona para `/login` e volta ao destino original após entrar.
- Logout disponível no header, no menu lateral e no dashboard.
- Dados de contas salvos em `react-lab:usuarios` — é uma simulação local, sem backend.

**Conta de demonstração**

```text
E-mail: demo@reactlab.dev
Senha:  123456
```

Também é possível criar uma conta nova em `/cadastro`.

## Rotas

| Rota           | Página                          |
| -------------- | ------------------------------- |
| `/`            | Início com visão geral          |
| `/tarefas`     | To-Do List interativa           |
| `/contador`    | Contador com passos             |
| `/calculadora` | Calculadora funcional           |
| `/cep`         | Buscador de CEP (ViaCEP)        |
| `/clima`       | Previsão do tempo (Open-Meteo)  |
| `/login`       | Login                           |
| `/cadastro`    | Cadastro                        |
| `/dashboard`   | Dashboard protegido             |
| `*`            | Página 404                      |

## Estrutura

```text
src/
├── components/
│   ├── Layout.tsx            # Header, menu lateral, footer e outlet
│   ├── AuthAside.tsx         # Painel visual compartilhado de login/cadastro
│   ├── PageHeader.tsx        # Cabeçalho reutilizável das páginas
│   ├── ProtectedRoute.tsx    # Guarda de rota autenticada
│   └── todo/
│       ├── TodoApp.tsx       # Estado principal da lista
│       ├── TaskForm.tsx
│       ├── TaskFilters.tsx
│       ├── TaskList.tsx
│       ├── TaskItem.tsx
│       └── TaskSummary.tsx
├── context/
│   └── AuthContext.tsx       # Login, cadastro, sessão e logout
├── hooks/
│   └── useLocalStorage.ts    # Persistência genérica
├── pages/                    # Uma página por projeto
├── App.tsx                   # Rotas
├── main.tsx                  # Entrada da aplicação
├── types.ts                  # Tipos compartilhados
└── index.css                 # Estilos globais e responsivos
```

## Conceitos praticados

- `useState`, `useMemo`, `useCallback`, `useEffect` e `useContext`
- Context API para autenticação
- Componentização e props tipadas
- Renderização de listas com `.map()` e `key` única
- Eventos de formulário, clique e teclado
- Requisições com `fetch`, estados de carregamento e erro
- Rotas com React Router, incluindo rotas protegidas
- Persistência com `localStorage`
- Layout responsivo (mobile, tablet e desktop)
