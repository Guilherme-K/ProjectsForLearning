import olaMundo from './projects/ola-mundo.py?raw'
import calculadora from './projects/calculadora.py?raw'
import adivinhacao from './projects/adivinhacao.py?raw'
import cadastro from './projects/cadastro.py?raw'

export type NivelPython = 'Iniciante' | 'Intermediário'

export interface ProjetoPython {
  id: string
  arquivo: string
  titulo: string
  descricao: string
  nivel: NivelPython
  conceitos: string[]
  icone: string
  tom: string
  codigo: string
}

/**
 * Projetos Python próprios do terminal web.
 * Ficam separados de `python/atv.py`, que continua sendo a atividade em Python
 * executada localmente, sem interface.
 */
export const projetosPython: ProjetoPython[] = [
  {
    id: 'ola-mundo',
    arquivo: 'ola-mundo.py',
    titulo: 'Boas-vindas interativas',
    descricao:
      'Leia o nome e a idade, monte mensagens com f-strings e trate entradas inválidas.',
    nivel: 'Iniciante',
    conceitos: ['input()', 'variáveis', 'f-strings', 'try/except'],
    icone: 'fa-comment',
    tom: 'teal',
    codigo: olaMundo,
  },
  {
    id: 'calculadora',
    arquivo: 'calculadora.py',
    titulo: 'Calculadora de terminal',
    descricao:
      'Menu com quatro operações, leitura de números decimais e repetição até o usuário sair.',
    nivel: 'Iniciante',
    conceitos: ['funções', 'while', 'if/elif', 'float'],
    icone: 'fa-calculator',
    tom: 'blue',
    codigo: calculadora,
  },
  {
    id: 'adivinhacao',
    arquivo: 'adivinhacao.py',
    titulo: 'Jogo de adivinhação',
    descricao:
      'Um número aleatório entre 1 e 100, dicas de maior ou menor e contagem de tentativas.',
    nivel: 'Intermediário',
    conceitos: ['random', 'condicionais', 'contadores', 'validação'],
    icone: 'fa-dice',
    tom: 'orange',
    codigo: adivinhacao,
  },
  {
    id: 'cadastro',
    arquivo: 'cadastro.py',
    titulo: 'Cadastro em memória',
    descricao:
      'Liste, adicione e remova pessoas em uma lista de dicionários que dura só a execução.',
    nivel: 'Intermediário',
    conceitos: ['listas', 'dicionários', 'funções', 'menu'],
    icone: 'fa-address-book',
    tom: 'pink',
    codigo: cadastro,
  },
]
