import type { WeatherCategory } from './weatherCodes'

// O "cenário" define as cores do fundo do app, combinando a condição do
// tempo com a hora local da cidade (dia, noite, amanhecer, entardecer).
export type Scene =
  | 'day'
  | 'night'
  | 'dawn'
  | 'dusk'
  | 'cloudy-day'
  | 'cloudy-night'
  | 'rain-day'
  | 'rain-night'
  | 'storm'
  | 'snow'
  | 'fog'

// Janela, em minutos, antes e depois do nascer/pôr do sol com cores de transição.
const TWILIGHT_MINUTES = 40

/** "2026-10-04T17:30" → minutos desde a meia-noite (1050). */
function minutesOfDay(isoLocal: string): number {
  return Number(isoLocal.slice(11, 13)) * 60 + Number(isoLocal.slice(14, 16))
}

export function getScene(params: {
  category: WeatherCategory
  isDay: boolean
  now: string
  sunrise: string
  sunset: string
}): Scene {
  const { category, isDay, now, sunrise, sunset } = params

  if (category === 'storm') return 'storm'
  if (category === 'snow') return 'snow'
  if (category === 'fog') return 'fog'
  if (category === 'rain' || category === 'drizzle') return isDay ? 'rain-day' : 'rain-night'
  if (category === 'cloudy') return isDay ? 'cloudy-day' : 'cloudy-night'

  // Céu limpo ou parcialmente nublado: as cores acompanham o sol.
  const t = minutesOfDay(now)
  if (Math.abs(t - minutesOfDay(sunrise)) <= TWILIGHT_MINUTES) return 'dawn'
  if (Math.abs(t - minutesOfDay(sunset)) <= TWILIGHT_MINUTES) return 'dusk'
  return isDay ? 'day' : 'night'
}
