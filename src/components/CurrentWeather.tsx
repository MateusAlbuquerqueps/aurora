import type { CurrentWeather as Current, DayForecast, Place } from '../api/openMeteo'
import { formatClock, formatTemp } from '../lib/format'
import { getWeatherInfo } from '../lib/weatherCodes'
import { cardClass } from './Card'
import { WeatherIcon } from './WeatherIcon'

type Props = {
  place: Place
  current: Current
  today: DayForecast
  className?: string
}

export function CurrentWeather({ place, current, today, className = '' }: Props) {
  const info = getWeatherInfo(current.weatherCode, current.isDay)

  return (
    <section className={`${cardClass} p-5 sm:p-6 ${className}`} aria-label="Clima agora">
      <h1 className="text-2xl leading-tight font-semibold text-balance sm:text-3xl">{place.name}</h1>
      {place.region && (
        <p className="text-sm text-slate-600 dark:text-slate-400">{place.region}</p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <WeatherIcon name={info.iconName} alt="" className="-ml-3 size-28 shrink-0 sm:size-32" />
        <div className="min-w-0">
          <p className="text-6xl font-light tracking-tight sm:text-7xl">
            {formatTemp(current.temperature)}
            <span className="sr-only"> Celsius</span>
          </p>
          <p className="text-lg font-medium">{info.label}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
        Máx. <strong>{formatTemp(today.tempMax)}</strong> · Mín.{' '}
        <strong>{formatTemp(today.tempMin)}</strong> · Sensação{' '}
        <strong>{formatTemp(current.feelsLike)}</strong>
      </p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Atualizado às {formatClock(current.time)} (horário local)
      </p>
    </section>
  )
}
