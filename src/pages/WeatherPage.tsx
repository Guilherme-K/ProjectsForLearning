import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  CircleAlert,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  Moon,
  MoonStar,
  Search,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

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
  icone: LucideIcon
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
        ? { descricao: 'Céu limpo', icone: Sun }
        : { descricao: 'Noite limpa', icone: Moon }
    case 1:
      return isDia
        ? { descricao: 'Predominantemente limpo', icone: CloudSun }
        : { descricao: 'Noite com poucas nuvens', icone: MoonStar }
    case 2:
      return { descricao: 'Parcialmente nublado', icone: CloudSun }
    case 3:
      return { descricao: 'Nublado', icone: Cloud }
    case 45:
    case 48:
      return { descricao: 'Neblina', icone: CloudFog }
    case 51:
    case 53:
    case 55:
      return { descricao: 'Garoa', icone: CloudDrizzle }
    case 56:
    case 57:
      return { descricao: 'Garoa congelante', icone: CloudDrizzle }
    case 61:
    case 63:
    case 65:
      return { descricao: 'Chuva', icone: CloudRain }
    case 66:
    case 67:
      return { descricao: 'Chuva congelante', icone: CloudRain }
    case 71:
    case 73:
    case 75:
    case 77:
      return { descricao: 'Neve', icone: CloudSnow }
    case 80:
    case 81:
    case 82:
      return { descricao: 'Pancadas de chuva', icone: CloudRain }
    case 85:
    case 86:
      return { descricao: 'Pancadas de neve', icone: CloudSnow }
    case 95:
      return { descricao: 'Tempestade', icone: CloudLightning }
    case 96:
    case 99:
      return { descricao: 'Tempestade com granizo', icone: CloudHail }
    default:
      return { descricao: 'Condição não identificada', icone: Cloud }
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
  const IconeAtual = infoAtual?.icone

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
            <MapPin size={18} aria-hidden="true" />
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
              <Loader2 size={18} className="spin" aria-hidden="true" />
            ) : (
              <Search size={18} aria-hidden="true" />
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
            <CircleAlert size={18} aria-hidden="true" />
            <span>{erro}</span>
          </div>
        )}

        {carregando && (
          <div className="panel weather-loading" aria-live="polite">
            <Loader2 size={30} className="spin" aria-hidden="true" />
            <strong>Consultando o clima...</strong>
            <p>Buscando a cidade e montando a previsão dos próximos dias.</p>
          </div>
        )}

        {!carregando && !clima && !erro && (
          <div className="weather-empty">
            <CloudSun size={56} aria-hidden="true" />
            <strong>Qual é o clima por aí?</strong>
            <p>
              Busque uma cidade acima ou escolha uma das sugestões para começar.
            </p>
          </div>
        )}

        {!carregando && clima && local && infoAtual && IconeAtual && (
          <>
            <section className="weather-current" aria-label="Clima atual">
              <div className="weather-main">
                <div>
                  <span className="weather-location">
                    <MapPin size={15} aria-hidden="true" />
                    {local.name}
                    {local.admin1 ? `, ${local.admin1}` : ''}
                    {local.country ? ` · ${local.country}` : ''}
                  </span>

                  <div className="weather-temp">
                    {Math.round(clima.current.temperature_2m)}
                    <span>°C</span>
                  </div>

                  <p className="weather-desc">
                    <IconeAtual size={22} aria-hidden="true" />
                    {infoAtual.descricao}
                  </p>

                  <span className="weather-updated">
                    Atualizado às {formatarHora(clima.current.time)}
                  </span>
                </div>

                <div className="weather-art" aria-hidden="true">
                  <IconeAtual size={112} strokeWidth={1.25} />
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Thermometer size={15} aria-hidden="true" />
                    Sensação
                  </span>
                  <strong>{Math.round(clima.current.apparent_temperature)}°C</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Droplets size={15} aria-hidden="true" />
                    Umidade
                  </span>
                  <strong>{clima.current.relative_humidity_2m}%</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <Wind size={15} aria-hidden="true" />
                    Vento
                  </span>
                  <strong>{Math.round(clima.current.wind_speed_10m)} km/h</strong>
                </div>

                <div className="weather-detail">
                  <span className="weather-detail-label">
                    <CloudRain size={15} aria-hidden="true" />
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
                  const IconeDia = infoDia.icone

                  return (
                    <article key={dia} className="forecast-card">
                      <span className="forecast-day">
                        {formatarDia(dia, indice)}
                      </span>
                      <IconeDia
                        size={28}
                        className="forecast-icon"
                        aria-hidden="true"
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
