import type { HourForecast } from '../api/openMeteo'
import { formatHour, formatPrecip, formatTemp, formatWeekday } from '../lib/format'
import { getWeatherInfo } from '../lib/weatherCodes'
import { Card } from './Card'
import { WeatherIcon } from './WeatherIcon'

type Props = {
  hours: HourForecast[]
  className?: string
}

function hourLabel(hour: HourForecast, index: number): string {
  if (index === 0) return 'Agora'
  // Na virada do dia mostramos o dia da semana, para não confundir hoje e amanhã.
  if (hour.time.slice(11, 13) === '00') return formatWeekday(hour.time.slice(0, 10), 1)
  return formatHour(hour.time)
}

export function HourlyForecast({ hours, className = '' }: Props) {
  return (
    <Card title="Próximas 48 horas" className={className}>
      {/* Rola para o lado dentro do cartão, sem empurrar a página.
          tabIndex permite rolar pelo teclado (setas) depois de focar. */}
      <ol
        className="thin-scrollbar -mx-4 flex snap-x gap-1 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5"
        tabIndex={0}
        aria-label="Previsão hora a hora"
      >
        {hours.map((hour, i) => {
          const info = getWeatherInfo(hour.weatherCode, hour.isDay)
          const isMidnight = i > 0 && hour.time.slice(11, 13) === '00'
          return (
            <li
              key={hour.time}
              className={`flex w-16 shrink-0 snap-start flex-col items-center rounded-2xl py-2 text-center ${
                i === 0 ? 'bg-white/50 dark:bg-white/10' : ''
              } ${isMidnight ? 'border-l border-slate-900/10 dark:border-white/15' : ''}`}
            >
              <span className={`text-xs ${i === 0 || isMidnight ? 'font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                {hourLabel(hour, i)}
              </span>
              <WeatherIcon name={info.iconName} alt={info.label} className="size-11" />
              <span className="text-base font-semibold">{formatTemp(hour.temperature)}</span>
              {/* Chance (%) e quantidade (mm) de chuva: são informações diferentes. */}
              <span className="mt-1 h-4 text-xs font-medium text-sky-800 dark:text-sky-300">
                {hour.precipProbability > 0 ? `${hour.precipProbability}%` : ''}
              </span>
              <span className="h-4 text-[0.7rem] text-slate-600 dark:text-slate-400">
                {hour.precipitation >= 0.1 ? formatPrecip(hour.precipitation) : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
