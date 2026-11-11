# ProjectsForLearning

Repositório com projetos de estudo organizados por pasta.

## Estrutura

```text
.
├── react-lab/   # Aplicação React + TypeScript
└── python/      # Atividades em Python
```

## React Lab

Projetos de React organizados por nível: To-Do List interativa, contador, calculadora, buscador de CEP, previsão do tempo e autenticação com rotas protegidas.

A área `/python` leva um terminal interativo para o navegador: os programas em Python rodam de verdade com Pyodide e cada `input()` é respondido passo a passo no próprio terminal. Os arquivos usados ali ficam em `react-lab/src/python/projects/` e são separados das atividades da pasta `python/`.

A interface usa uma identidade visual inspirada no portal Sala do Futuro, com header branco, menu lateral, cards claros e a paleta azul institucional. O conteúdo e os projetos são originais.

```bash
cd react-lab
npm install
npm run dev
```

Documentação completa: [`react-lab/README.md`](react-lab/README.md).

## Python

Atividades e exercícios em Python ficam na pasta `python/`.

Os projetos do terminal web do React Lab ficam em `react-lab/src/python/projects/` e são executados no navegador com Pyodide, sem alterar as atividades locais desta pasta.
