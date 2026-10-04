import type { ReactNode } from 'react'
import type { CurrentWeather, DayForecast } from '../api/openMeteo'
import {
  dewPointHint,
  feelsLikeHint,
  formatClock,
  formatTemp,
  formatVisibility,
  humidityHint,
  pressureHint,
  uvLevel,
  visibilityHint,
  windDirection,
  windHint,
} from '../lib/format'
import { Card } from './Card'
import { ArrowIcon } from './UiIcons'
import { WeatherIcon } from './WeatherIcon'

type TileProps = {
  icon: string
  label: string
  value: ReactNode
  hint: ReactNode
  /** Explicação curta do termo (glossário), mostrada ao passar o mouse. */
  about: string
}

function Tile({ icon, label, value, hint, about }: TileProps) {
  return (
    <div className="rounded-2xl bg-white/50 p-3 dark:bg-white/5" title={about}>
      <dt className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
        <WeatherIcon name={icon} alt="" className="-m-1 size-7 shrink-0" />
        {label}
      </dt>
      <dd className="mt-1">
        <span className="block text-xl font-semibold">{value}</span>
        <span className="block text-xs text-slate-600 dark:text-slate-400">{hint}</span>
      </dd>
    </div>
  )
}

/** "05:50" e "18:08" → "12h 18min" */
function daylight(sunrise: string, sunset: string): string {
  const toMin = (iso: string) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16))
  const total = toMin(sunset) - toMin(sunrise)
  return `${Math.floor(total / 60)}h ${total % 60}min de sol`
}

type Props = {
  current: CurrentWeather
  today: DayForecast
  className?: string
}

export function DetailsGrid({ current, today, className = '' }: Props) {
  const dir = windDirection(current.windDirection)

  return (
    <Card title="Detalhes" className={className}>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-3">
        <Tile
          icon="thermometer"
          label="Sensação"
          value={formatTemp(current.feelsLike)}
          hint={feelsLikeHint(current.temperature, current.feelsLike)}
          about="Temperatura que o corpo sente, considerando vento e umidade."
        />
        <Tile
          icon="humidity"
          label="Umidade"
          value={`${current.humidity}%`}
          hint={humidityHint(current.humidity)}
          about="Quanto vapor d'água há no ar. Abaixo de 30% o ar é seco e faz mal à saúde."
        />
        <Tile
          icon="raindrop"
          label="Ponto de orvalho"
          value={formatTemp(current.dewPoint)}
          hint={dewPointHint(current.dewPoint)}
          about="Temperatura em que o ar satura e forma orvalho. Acima de 20° o dia fica abafado."
        />
        <Tile
          icon="wind"
          label="Vento"
          value={`${Math.round(current.windSpeed)} km/h`}
          hint={
            <span className="inline-flex items-center gap-1">
              {/* A seta aponta para onde o vento sopra (oposto de onde vem). */}
              <span
                className="inline-block"
                style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
              >
                <ArrowIcon className="size-3.5" />
              </span>
              {windHint(current.windSpeed)} · do {dir}
            </span>
          }
          about="Velocidade média do vento e a direção de onde ele vem."
        />
        <Tile
          icon="windsock"
          label="Rajadas"
          value={`${Math.round(current.windGusts)} km/h`}
          hint="Picos de vento"
          about="Pico momentâneo do vento, mais forte que a média. É o que derruba galhos."
        />
        <Tile
          icon="uv-index"
          label="Índice UV"
          value={Math.round(current.uvIndex)}
          hint={`${uvLevel(current.uvIndex)} · máx. ${Math.round(today.uvIndexMax)} hoje`}
          about="Intensidade da radiação solar (0 a 11+). A partir de 6, use protetor solar."
        />
        <Tile
          icon="barometer"
          label="Pressão"
          value={`${Math.round(current.pressure)} hPa`}
          hint={pressureHint(current.pressure)}
          about="Peso do ar. O normal é cerca de 1013 hPa; pressão baixa costuma vir com mau tempo."
        />
        <Tile
          icon="mist"
          label="Visibilidade"
          value={formatVisibility(current.visibility)}
          hint={visibilityHint(current.visibility)}
          about="Distância em que se enxerga com clareza. Neblina e fumaça reduzem."
        />
        <Tile
          icon="sunrise"
          label="Nascer do sol"
          value={formatClock(today.sunrise)}
          hint={daylight(today.sunrise, today.sunset)}
          about="Horário local do nascer do sol hoje."
        />
        <Tile
          icon="sunset"
          label="Pôr do sol"
          value={formatClock(today.sunset)}
          hint="Horário local"
          about="Horário local do pôr do sol hoje."
        />
      </dl>
    </Card>
  )
}
