export interface Tarefa {
  id: number
  texto: string
  concluida: boolean
  criadaEm: number
}

export type Filtro = 'todas' | 'pendentes' | 'concluidas'

export interface Endereco {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}
