import type { DayForecast } from '../api/openMeteo'
import { formatPrecip, formatTemp, formatWeekday } from '../lib/format'
import { getWeatherInfo } from '../lib/weatherCodes'
import { Card } from './Card'
import { WeatherIcon } from './WeatherIcon'

type Props = {
  days: DayForecast[]
  /** Temperatura atual, marcada como um ponto na barra de hoje. */
  currentTemp: number
  className?: string
}

export function DailyForecast({ days, currentTemp, className = '' }: Props) {
  // A barra de cada dia é desenhada na mesma escala da semana inteira, assim
  // dá para comparar de relance quais dias serão mais quentes ou mais frios.
  const weekMin = Math.min(...days.map((d) => d.tempMin))
  const weekMax = Math.max(...days.map((d) => d.tempMax))
  const span = Math.max(weekMax - weekMin, 1)
  const pct = (t: number) => ((t - weekMin) / span) * 100

  return (
    <Card title="Próximos 7 dias" className={className}>
      <ol className="divide-y divide-slate-900/10 dark:divide-white/10">
        {days.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode, true)
          return (
            <li
              key={day.date}
              className="grid grid-cols-[2.75rem_2.5rem_3.25rem_minmax(0,1fr)] items-center gap-x-2 py-2 sm:grid-cols-[3.5rem_2.75rem_4rem_minmax(0,1fr)]"
            >
              <span className={`text-sm ${i === 0 ? 'font-semibold' : ''}`}>
                {formatWeekday(day.date, i)}
              </span>
              <WeatherIcon name={info.iconName} alt={info.label} className="size-10" />
              <span className="text-xs leading-tight">
                {day.precipProbability > 0 && (
                  <span className="block font-medium text-sky-800 dark:text-sky-300">
                    {day.precipProbability}%
                  </span>
                )}
                {day.precipitation >= 0.1 && (
                  <span className="block text-slate-600 dark:text-slate-400">
                    {formatPrecip(day.precipitation)}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2 text-sm tabular-nums">
                <span className="w-8 text-right text-slate-600 dark:text-slate-400">
                  <span className="sr-only">Mínima </span>
                  {formatTemp(day.tempMin)}
                </span>
                <span className="relative h-1.5 min-w-6 flex-1 rounded-full bg-slate-900/10 dark:bg-white/10" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 rounded-full bg-linear-to-r from-sky-400 via-amber-300 to-orange-400"
                    style={{ left: `${pct(day.tempMin)}%`, right: `${100 - pct(day.tempMax)}%` }}
                  />
                  {i === 0 && (
                    <span
                      className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-slate-900/60"
                      style={{ left: `${Math.min(100, Math.max(0, pct(currentTemp)))}%` }}
                    />
                  )}
                </span>
                <span className="w-8 font-semibold">
                  <span className="sr-only">Máxima </span>
                  {formatTemp(day.tempMax)}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
