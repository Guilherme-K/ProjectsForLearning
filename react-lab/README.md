# Sala do Futuro · React Lab — Projetos com React + TypeScript

Aplicação de estudo que reúne os três níveis pedidos no desafio: **iniciante**, **intermediário** e **avançado**. Todos os projetos funcionam de verdade, com layout responsivo e persistência local quando faz sentido.

O projeto principal é a **To-Do List interativa**, construída com `useState`, componentização, renderização de listas com `.map()` e manipulação de eventos.

A identidade visual foi inspirada no portal [Sala do Futuro](https://saladofuturo.educacao.sp.gov.br/), da Secretaria da Educação do Estado de São Paulo: header branco, menu lateral, cards claros, azul institucional e tipografia Open Sans. Todo o conteúdo, os textos e os projetos são originais deste laboratório de estudos.

As atividades só ficam disponíveis com uma sessão ativa: sem login, a home exibe um convite para entrar e as rotas dos projetos redirecionam para `/login`, voltando ao destino original após a autenticação.

Além dos projetos React, o laboratório tem uma área separada de **Python no navegador** (`/python`): um terminal que executa Python de verdade com Pyodide e permite responder a cada `input()` passo a passo. Os arquivos dessa área ficam em `src/python/projects/` e não se misturam com as atividades da pasta `python/` do repositório.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- Font Awesome 7 (ícones, via CDN da cdnjs)
- Open Sans (Google Fonts)
- Pyodide 314.0.7 (Python 3 no navegador, via CDN da jsDelivr)
- CSS puro e responsivo

## Design

- Header fixo de 64px com marca, contexto e controles de conta.
- Menu lateral com atalhos para os projetos e para o painel, liberados após o login; em telas menores ele vira uma gaveta com overlay.
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

O terminal Python usa `SharedArrayBuffer` para bloquear o Web Worker enquanto espera a resposta do usuário. Para isso, o `vite.config.ts` já envia os cabeçalhos `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy` e `Cross-Origin-Resource-Policy` em `dev` e `preview`. Ao publicar em outra hospedagem, configure os mesmos cabeçalhos; sem eles, a página continua funcionando, mas cada `input()` é pedido em uma janela do navegador (`window.prompt`).

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

## Python no navegador

A página `/python` executa **Python 3.14 de verdade** no navegador com [Pyodide](https://pyodide.org/), sem backend. O programa roda em um Web Worker e o terminal entrega cada `input()` ao usuário antes de continuar a execução.

Projetos disponíveis:

- `ola-mundo.py` — variáveis, `input()`, f-strings e `try/except`.
- `calculadora.py` — menu com quatro operações, repetição e leitura de decimais.
- `adivinhacao.py` — jogo com `random`, dicas de maior/menor e contador de tentativas.
- `cadastro.py` — listas, dicionários e menu para listar, adicionar e remover registros em memória.

Recursos do terminal:

- **Executar** inicia o programa e habilita o campo de entrada quando ele pede um valor.
- **Parar** encerra o Worker e libera uma nova execução.
- **Limpar** apaga a saída quando não há programa em execução.
- Prévia do código-fonte de cada arquivo.
- Limite de saída para evitar travamentos por programas muito verbosos.

Os arquivos ficam em `src/python/projects/` e são carregados como texto (`?raw`). Eles são independentes de `python/atv.py`, que continua sendo a atividade em Python executada localmente, sem interface web.

### Como o `input()` funciona

1. O Python chama `input()` dentro do Worker.
2. O Worker publica um pedido de entrada e bloqueia com `Atomics.wait`.
3. A thread principal mostra o campo, recebe a resposta e grava os bytes em um `SharedArrayBuffer`.
4. O Worker é acordado com `Atomics.notify` e devolve a linha ao Python.

Esse caminho exige `crossOriginIsolated`. Quando o isolamento não está disponível, o motor cai no modo de compatibilidade e usa `window.prompt` para cada entrada.

## Rotas

As rotas de atividades e o dashboard são protegidas por `ProtectedRoute`. Sem sessão ativa, o acesso redireciona para `/login` e retorna ao destino original após a autenticação.

| Rota           | Página                          | Acesso    |
| -------------- | ------------------------------- | --------- |
| `/`            | Início com visão geral          | Pública   |
| `/tarefas`     | To-Do List interativa           | Protegida |
| `/contador`    | Contador com passos             | Protegida |
| `/calculadora` | Calculadora funcional           | Protegida |
| `/cep`         | Buscador de CEP (ViaCEP)        | Protegida |
| `/clima`       | Previsão do tempo (Open-Meteo)  | Protegida |
| `/python`      | Python no navegador (Pyodide)   | Protegida |
| `/login`       | Login                           | Pública   |
| `/cadastro`    | Cadastro                        | Pública   |
| `/dashboard`   | Dashboard protegido             | Protegida |
| `*`            | Página 404                      | Pública   |

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
├── python/
│   ├── engine.ts             # Motor Pyodide (Worker + fallback)
│   ├── pyodide-worker.js     # Worker que executa o Python
│   ├── projects.ts           # Registro dos projetos Python
│   └── projects/             # Arquivos .py do terminal web
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
- Web Worker, `SharedArrayBuffer` e `Atomics` para entrada interativa
- Integração com Pyodide para executar Python no navegador
- Layout responsivo (mobile, tablet e desktop)
