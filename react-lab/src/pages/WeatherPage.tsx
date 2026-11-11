import { useState } from 'react'
import type { FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Icone } from '../components/Icone'

interface LocalClima {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

interface RespostaGeocodificacao {
  results?: LocalClima[]
}

interface ClimaAtual {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
}

interface ClimaDiario {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
}

interface RespostaClima {
  current: ClimaAtual
  daily: ClimaDiario
  timezone: string
}

interface InfoClima {
  descricao: string
  icone: string
}

const cidadesSugeridas = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Manaus',
]

function obterInfoClima(codigo: number, isDia = 1): InfoClima {
  switch (codigo) {
    case 0:
      return isDia
        ? { descricao: 'Céu limpo', icone: 'fa-sun' }
        : { descricao: 'Noite limpa', icone: 'fa-moon' }
    case 1:
      return isDia
        ? { descricao: 'Predominantemente limpo', icone: 'fa-cloud-sun' }
        : { descricao: 'Noite com poucas nuvens', icone: 'fa-cloud-moon' }
    case 2:
      return { descricao: 'Parcialmente nublado', icone: 'fa-cloud-sun' }
    case 3:
      return { descricao: 'Nublado', icone: 'fa-cloud' }
    case 45:
    case 48:
      return { descricao: 'Neblina', icone: 'fa-smog' }
    case 51:
    case 53:
    case 55:
      return { descricao: 'Garoa', icone: 'fa-cloud-rain' }
    case 56:
    case 57:
      return { descricao: 'Garoa congelante', icone: 'fa-cloud-rain' }
    case 61:
    case 63:
    case 65:
      return { descricao: 'Chuva', icone: 'fa-cloud-rain' }
    case 66:
    case 67:
      return { descricao: 'Chuva congelante', icone: 'fa-cloud-rain' }
    case 71:
    case 73:
    case 75:
    case 77:
      return { descricao: 'Neve', icone: 'fa-cloud-snow' }
    case 80:
    case 81:
    case 82:
      return { descricao: 'Pancadas de chuva', icone: 'fa-cloud-showers-heavy' }
    case 85:
    case 86:
      return { descricao: 'Pancadas de neve', icone: 'fa-cloud-snow' }
    case 95:
      return { descricao: 'Tempestade', icone: 'fa-cloud-bolt' }
    case 96:
    case 99:
      return { descricao: 'Tempestade com granizo', icone: 'fa-cloud-showers-heavy' }
    default:
      return { descricao: 'Condição não identificada', icone: 'fa-cloud' }
  }
}

function formatarDia(data: string, indice: number): string {
  if (indice === 0) return 'Hoje'

  const rotulo = new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'short',
  })

  return rotulo.charAt(0).toUpperCase() + rotulo.slice(1).replace('.', '')
}

function formatarHora(data: string): string {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function WeatherPage() {
  const [cidade, setCidade] = useState('')
  const [local, setLocal] = useState<LocalClima | null>(null)
  const [clima, setClima] = useState<RespostaClima | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function consultarClima(nome: string) {
    const cidadeLimpa = nome.trim()

    if (!cidadeLimpa) {
      setErro('Digite o nome de uma cidade para consultar o clima.')
      return
    }

    setErro('')
    setCarregando(true)
    setLocal(null)
    setClima(null)

    try {
      const respostaGeo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cidadeLimpa,
        )}&count=1&language=pt&format=json`,
      )

      if (!respostaGeo.ok) throw new Error('Falha na geocodificação')

      const geocodificacao = (await respostaGeo.json()) as RespostaGeocodificacao
      const encontrado = geocodificacao.results?.[0]

      if (!encontrado) {
        setErro(`Não encontramos "${cidadeLimpa}". Tente outro nome de cidade.`)
        return
      }

      const respostaClima = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${encontrado.latitude}&longitude=${encontrado.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`,
      )

      if (!respostaClima.ok) throw new Error('Falha na previsão')

      const dados = (await respostaClima.json()) as RespostaClima
      setLocal(encontrado)
      setClima(dados)
    } catch {
      setErro('Não foi possível consultar o clima agora. Tente novamente em instantes.')
    } finally {
      setCarregando(false)
    }
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    void consultarClima(cidade)
  }

  const infoAtual = clima
    ? obterInfoClima(clima.current.weather_code, clima.current.is_day)
    : null

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Nível intermediário"
          titulo="Previsão do tempo"
          descricao="Digite o nome de uma cidade para ver as condições atuais e a previsão dos próximos cinco dias. Os dados vêm da API pública Open-Meteo."
          conceitos={['fetch + async/await', 'Estados de carregamento', 'Tratamento de erros', 'Tipagem de API']}
        />

        <form className="weather-search" onSubmit={enviar}>
          <label htmlFor="cidade" className="sr-only">
            Nome da cidade
          </label>
          <div className="input-with-icon">
            <Icone nome="fa-map-pin" tamanho={18} />
            <input
              id="cidade"
              type="text"
              placeholder="Ex.: São Paulo, Lisboa, Tóquio..."
              value={cidade}
              onChange={(evento) => {
                setCidade(evento.target.value)
                setErro('')
              }}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? (
              <Icone nome="fa-spinner" tamanho={18} className="spin" />
            ) : (
              <Icone nome="fa-magnifying-glass" tamanho={18} />
            )}
            Buscar clima
          </button>
        </form>

        <div className="city-chips">
          {cidadesSugeridas.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              className="city-chip"
              disabled={carregando}
              onClick={() => {
                setCidade(sugestao)
                void consultarClima(sugestao)
              }}
            >
              {sugestao}
            </button>
          ))}
        </div>

        {erro && (
          <div className="error-banner weather-error" role="alert">
            <Icone nome="fa-circle-exclamation" tamanho={18} />
            <span>{erro}</span>
          </div>
        )}

        {carregando && (
          <div className="panel weather-loading" aria-live="polite">
            <Icone nome="fa-spinner" tamanho={30} className="spin" />
            <strong>Consultando o clima...</strong>
            <p>Buscando a cidade e montando a previsão dos próximos dias.</p>
          </div>
        )}

        {!carregando && !clima && !erro && (
          <div className="weather-empty">
            <Icone nome="fa-cloud-sun" tamanho={56} />
            <strong>Qual é o clima por aí?</strong>
            <p>
              Busque uma cidade acima ou escolha uma das sugestões para começar.
            </p>
          </div>
        )}

        {!carregando && clima && local && infoAtual && (
          <>
            <section className="weather-current" aria-label="Clima atual">
              <div className="weather-main">
                <div>
                  <span className="weather-location">
                    <Icone nome="fa-map-pin" tamanho={15} />
                    {local.name}
                    {local.admin1 ? `, ${local.admin1}` : ''}
                    {local.country ? ` · ${local.country}` : ''}
                  </span>

                  <div className="weather-temp">
                    {Math.round(clima.current.temperature_2m)}
                    <span>°C</span>
                  </div>

                  <p className="weather-desc">
                    <Icone nome={infoAtual.icone} tamanho={22} />
                    {infoAtual.descricao}
                  </p>

                  <span className="weather-updated">
                    Atualizado às {formatarHora(clima.current.time)}
                  </span>
                </div>

                <div className="weather-art" aria-hidden="true">
                  <Icone nome={infoAtual.icone} tamanho={112} />
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Icone nome="fa-temperature-half" tamanho={15} />
                    Sensação
                  </span>
                  <strong>{Math.round(clima.current.apparent_temperature)}°C</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Icone nome="fa-droplet" tamanho={15} />
                    Umidade
                  </span>
                  <strong>{clima.current.relative_humidity_2m}%</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Icone nome="fa-wind" tamanho={15} />
                    Vento
                  </span>
                  <strong>{Math.round(clima.current.wind_speed_10m)} km/h</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Icone nome="fa-cloud-rain" tamanho={15} />
                    Chuva
                  </span>
                  <strong>{clima.current.precipitation} mm</strong>
                </div>
              </div>
            </section>

            <section className="weather-forecast" aria-label="Previsão de cinco dias">
              <div className="forecast-head">
                <h2>Próximos 5 dias</h2>
                <span>{clima.timezone}</span>
              </div>

              <div className="forecast-grid">
                {clima.daily.time.map((dia, indice) => {
                  const infoDia = obterInfoClima(
                    clima.daily.weather_code[indice] ?? 0,
                    1,
                  )

                  return (
                    <article key={dia} className="forecast-card">
                      <span className="forecast-day">
                        {formatarDia(dia, indice)}
                      </span>
                      <Icone
                        nome={infoDia.icone}
                        tamanho={28}
                        className="forecast-icon"
                      />
                      <span className="forecast-desc">{infoDia.descricao}</span>
                      <div className="forecast-temps">
                        <span className="forecast-max">
                          {Math.round(clima.daily.temperature_2m_max[indice] ?? 0)}°
                        </span>
                        <span className="forecast-min">
                          {Math.round(clima.daily.temperature_2m_min[indice] ?? 0)}°
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <p className="weather-source">
              Dados fornecidos por Open-Meteo · sem chave de API
            </p>
          </>
        )}
      </div>
    </div>
  )
}
