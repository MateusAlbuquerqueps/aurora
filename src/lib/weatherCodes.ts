// A Open-Meteo descreve a condição do tempo com os códigos padrão da
// Organização Meteorológica Mundial (WMO). Aqui traduzimos cada código para
// um texto em português, um ícone e uma categoria usada pelo fundo dinâmico.

export type WeatherCategory =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'storm'

type CodeInfo = {
  label: string
  category: WeatherCategory
  // "{d}" vira "day" ou "night", para ícones que têm sol ou lua.
  icon: string
}

const CODES: Record<number, CodeInfo> = {
  0: { label: 'Céu limpo', category: 'clear', icon: 'clear-{d}' },
  1: { label: 'Predominantemente limpo', category: 'clear', icon: 'partly-cloudy-{d}' },
  2: { label: 'Parcialmente nublado', category: 'partly', icon: 'partly-cloudy-{d}' },
  3: { label: 'Nublado', category: 'cloudy', icon: 'overcast' },
  45: { label: 'Neblina', category: 'fog', icon: 'fog-{d}' },
  48: { label: 'Neblina com geada', category: 'fog', icon: 'fog-{d}' },
  51: { label: 'Garoa fraca', category: 'drizzle', icon: 'partly-cloudy-{d}-drizzle' },
  53: { label: 'Garoa', category: 'drizzle', icon: 'drizzle' },
  55: { label: 'Garoa forte', category: 'drizzle', icon: 'drizzle' },
  56: { label: 'Garoa congelante', category: 'drizzle', icon: 'sleet' },
  57: { label: 'Garoa congelante forte', category: 'drizzle', icon: 'sleet' },
  61: { label: 'Chuva fraca', category: 'rain', icon: 'partly-cloudy-{d}-rain' },
  63: { label: 'Chuva', category: 'rain', icon: 'rain' },
  65: { label: 'Chuva forte', category: 'rain', icon: 'rain' },
  66: { label: 'Chuva congelante', category: 'rain', icon: 'sleet' },
  67: { label: 'Chuva congelante forte', category: 'rain', icon: 'sleet' },
  71: { label: 'Neve fraca', category: 'snow', icon: 'partly-cloudy-{d}-snow' },
  73: { label: 'Neve', category: 'snow', icon: 'snow' },
  75: { label: 'Neve forte', category: 'snow', icon: 'snow' },
  77: { label: 'Grãos de neve', category: 'snow', icon: 'snow' },
  80: { label: 'Pancadas de chuva fracas', category: 'rain', icon: 'partly-cloudy-{d}-rain' },
  81: { label: 'Pancadas de chuva', category: 'rain', icon: 'rain' },
  82: { label: 'Pancadas de chuva fortes', category: 'rain', icon: 'rain' },
  85: { label: 'Pancadas de neve', category: 'snow', icon: 'partly-cloudy-{d}-snow' },
  86: { label: 'Pancadas de neve fortes', category: 'snow', icon: 'snow' },
  95: { label: 'Trovoada', category: 'storm', icon: 'thunderstorms-{d}-rain' },
  96: { label: 'Trovoada com granizo', category: 'storm', icon: 'hail' },
  99: { label: 'Trovoada com granizo forte', category: 'storm', icon: 'hail' },
}

export type WeatherInfo = {
  label: string
  category: WeatherCategory
  iconName: string
}

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  const info = CODES[code]
  if (!info) {
    return { label: 'Indisponível', category: 'cloudy', iconName: 'not-available' }
  }
  return {
    label: info.label,
    category: info.category,
    iconName: info.icon.replace('{d}', isDay ? 'day' : 'night'),
  }
}
