import { useState } from 'react'
import type { FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Icone } from '../components/Icone'
import type { Endereco } from '../types'

interface CamposEndereco {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  complemento: string
  ddd: string
}

const camposIniciais: CamposEndereco = {
  cep: '',
  logradouro: '',
  bairro: '',
  localidade: '',
  uf: '',
  complemento: '',
  ddd: '',
}

const cepsSugeridos = [
  { cep: '01001000', rotulo: 'Sé, São Paulo' },
  { cep: '20040002', rotulo: 'Centro, Rio de Janeiro' },
  { cep: '30130010', rotulo: 'Centro, Belo Horizonte' },
  { cep: '80020310', rotulo: 'Centro, Curitiba' },
]

export function CepPage() {
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [campos, setCampos] = useState<CamposEndereco>(camposIniciais)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function consultarCep(valor: string) {
    setErro('')
    setEndereco(null)
    setCampos(camposIniciais)

    if (valor.length !== 8) {
      setErro('O CEP deve conter exatamente 8 números.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`)
      if (!resposta.ok) throw new Error('Falha na requisição')

      const dados = (await resposta.json()) as Endereco

      if (dados.erro) {
        setErro('CEP não encontrado. Confira os números e tente novamente.')
        return
      }

      setEndereco(dados)
      setCampos({
        cep: dados.cep || valor,
        logradouro: dados.logradouro || '',
        bairro: dados.bairro || '',
        localidade: dados.localidade || '',
        uf: dados.uf || '',
        complemento: dados.complemento || '',
        ddd: dados.ddd || '',
      })
    } catch {
      setErro('Erro ao buscar o CEP. Verifique sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    void consultarCep(cep)
  }

  function alterarCep(valor: string) {
    const digitos = valor.replace(/\D/g, '').slice(0, 8)
    setCep(digitos)
    setErro('')

    if (endereco) {
      setEndereco(null)
      setCampos(camposIniciais)
    }
  }

  function atualizarCampo(campo: keyof CamposEndereco, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }))
  }

  function limpar() {
    setCep('')
    setEndereco(null)
    setCampos(camposIniciais)
    setErro('')
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Nível intermediário"
          titulo="Buscador de CEP"
          descricao="Digite um CEP de 8 números e consulte a API pública ViaCEP. Os campos de endereço são preenchidos automaticamente e continuam editáveis."
          conceitos={['fetch + async/await', 'Formulário controlado', 'Tratamento de erros', 'Estados de carregamento']}
        />

        <div className="cep-layout">
          <section className="panel cep-panel" aria-label="Consulta de CEP">
            <h2>Consultar endereço</h2>
            <p className="panel-subtitle">
              A consulta é feita direto na API ViaCEP, sem necessidade de chave.
            </p>

            <form className="cep-form" onSubmit={enviar}>
              <label htmlFor="cep" className="sr-only">
                CEP
              </label>
              <div className="input-with-icon">
                <Icone nome="fa-map-pin" tamanho={18} />
                <input
                  id="cep"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={8}
                  placeholder="00000000"
                  value={cep}
                  onChange={(evento) => alterarCep(evento.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={carregando}>
                {carregando ? (
                  <Icone nome="fa-spinner" tamanho={18} className="spin" />
                ) : (
                  <Icone nome="fa-magnifying-glass" tamanho={18} />
                )}
                Buscar
              </button>
            </form>

            <p className="form-hint">
              Apenas números · {cep.length}/8 dígitos
            </p>

            {erro && (
              <div className="error-banner" role="alert">
                <Icone nome="fa-circle-exclamation" tamanho={18} />
                <span>{erro}</span>
              </div>
            )}

            <div className="suggestions">
              <span className="suggestions-label">Experimente:</span>
              <div className="suggestion-list">
                {cepsSugeridos.map(({ cep: sugestao, rotulo }) => (
                  <button
                    key={sugestao}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => {
                      setCep(sugestao)
                      void consultarCep(sugestao)
                    }}
                    disabled={carregando}
                  >
                    {sugestao} · {rotulo}
                  </button>
                ))}
              </div>
            </div>

            <div className="cep-info">
              <h3>O que acontece por trás?</h3>
              <ol>
                <li>O CEP é validado antes da requisição.</li>
                <li>O fetch consulta o endpoint JSON da ViaCEP.</li>
                <li>Estados de carregamento, sucesso e erro atualizam a tela.</li>
              </ol>
            </div>
          </section>

          <section className="panel cep-result" aria-live="polite">
            {carregando && (
              <div className="result-loading">
                <Icone nome="fa-spinner" tamanho={28} className="spin" />
                <strong>Consultando a ViaCEP...</strong>
                <p>Buscando os dados do CEP {cep}.</p>
              </div>
            )}

            {!carregando && !endereco && (
              <div className="cep-empty">
                <span className="empty-state-icon">
                  <Icone nome="fa-map-pin" tamanho={26} />
                </span>
                <strong>Nenhum endereço consultado</strong>
                <p>Digite um CEP ao lado ou escolha uma sugestão para começar.</p>
              </div>
            )}

            {!carregando && endereco && (
              <div className="address-result">
                <div className="result-head">
                  <div>
                    <span className="result-eyebrow">Endereço encontrado</span>
                    <h2>{endereco.logradouro || 'Logradouro não informado'}</h2>
                    <p>
                      {endereco.bairro || 'Bairro não informado'} ·{' '}
                      {endereco.localidade} - {endereco.uf}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={limpar}
                    aria-label="Limpar consulta"
                  >
                    <Icone nome="fa-xmark" tamanho={18} />
                  </button>
                </div>

                <div className="success-banner">
                  <Icone nome="fa-circle-check" tamanho={18} />
                  <span>
                    Dados preenchidos automaticamente. Você pode editar os campos
                    abaixo.
                  </span>
                </div>

                <div className="address-grid">
                  <div className="field">
                    <label htmlFor="campo-cep">CEP</label>
                    <input
                      id="campo-cep"
                      value={campos.cep}
                      onChange={(evento) => atualizarCampo('cep', evento.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="campo-ddd">DDD</label>
                    <input
                      id="campo-ddd"
                      value={campos.ddd}
                      onChange={(evento) => atualizarCampo('ddd', evento.target.value)}
                    />
                  </div>

                  <div className="field span-2">
                    <label htmlFor="campo-logradouro">Logradouro</label>
                    <input
                      id="campo-logradouro"
                      value={campos.logradouro}
                      onChange={(evento) =>
                        atualizarCampo('logradouro', evento.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="campo-bairro">Bairro</label>
                    <input
                      id="campo-bairro"
                      value={campos.bairro}
                      onChange={(evento) => atualizarCampo('bairro', evento.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="campo-cidade">Cidade</label>
                    <input
                      id="campo-cidade"
                      value={campos.localidade}
                      onChange={(evento) =>
                        atualizarCampo('localidade', evento.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="campo-uf">UF</label>
                    <input
                      id="campo-uf"
                      maxLength={2}
                      value={campos.uf}
                      onChange={(evento) =>
                        atualizarCampo('uf', evento.target.value.toUpperCase())
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="campo-complemento">Complemento</label>
                    <input
                      id="campo-complemento"
                      value={campos.complemento}
                      onChange={(evento) =>
                        atualizarCampo('complemento', evento.target.value)
                      }
                    />
                  </div>
                </div>

                <dl className="address-meta">
                  <div>
                    <dt>IBGE</dt>
                    <dd>{endereco.ibge || '—'}</dd>
                  </div>
                  <div>
                    <dt>Região</dt>
                    <dd>{endereco.regiao || '—'}</dd>
                  </div>
                  <div>
                    <dt>Estado</dt>
                    <dd>{endereco.estado || '—'}</dd>
                  </div>
                </dl>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
