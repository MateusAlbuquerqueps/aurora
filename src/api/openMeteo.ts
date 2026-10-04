// Comunicação com a Open-Meteo (https://open-meteo.com), gratuita e sem chave.
// Documentação da previsão: https://open-meteo.com/en/docs

export type Place = {
  name: string
  /** Estado/região e país, ex.: "São Paulo, Brasil" */
  region: string
  latitude: number
  longitude: number
}

export type CurrentWeather = {
  time: string
  temperature: number
  feelsLike: number
  humidity: number
  dewPoint: number
  isDay: boolean
  weatherCode: number
  windSpeed: number
  windDirection: number
  windGusts: number
  pressure: number
  visibility: number
  uvIndex: number
}

export type HourForecast = {
  time: string
  temperature: number
  weatherCode: number
  isDay: boolean
  precipProbability: number
  precipitation: number
}

export type DayForecast = {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipProbability: number
  precipitation: number
  sunrise: string
  sunset: string
  uvIndexMax: number
}

export type Forecast = {
  current: CurrentWeather
  hourly: HourForecast[]
  daily: DayForecast[]
}

const CURRENT_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'dew_point_2m',
  'is_day',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'pressure_msl',
  'visibility',
  'uv_index',
]
const HOURLY_VARS = [
  'temperature_2m',
  'weather_code',
  'is_day',
  'precipitation_probability',
  'precipitation',
]
const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'precipitation_sum',
  'sunrise',
  'sunset',
  'uv_index_max',
]

export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    // "auto" faz os horários virem no fuso da cidade consultada.
    timezone: 'auto',
    current: CURRENT_VARS.join(','),
    hourly: HOURLY_VARS.join(','),
    // A previsão horária começa na hora atual e cobre as próximas 48 horas.
    forecast_hours: '48',
    daily: DAILY_VARS.join(','),
    forecast_days: '7',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal })
  if (!res.ok) throw new Error(`Open-Meteo respondeu ${res.status}`)
  const data = await res.json()

  const c = data.current
  const h = data.hourly
  const d = data.daily

  // A API devolve listas paralelas (uma por variável). Juntamos em objetos,
  // um por hora/dia, que são mais fáceis de usar na interface.
  return {
    current: {
      time: c.time,
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      dewPoint: c.dew_point_2m,
      isDay: c.is_day === 1,
      weatherCode: c.weather_code,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      windGusts: c.wind_gusts_10m,
      pressure: c.pressure_msl,
      visibility: c.visibility,
      uvIndex: c.uv_index ?? 0,
    },
    hourly: h.time.map((time: string, i: number) => ({
      time,
      temperature: h.temperature_2m[i],
      weatherCode: h.weather_code[i],
      isDay: h.is_day[i] === 1,
      precipProbability: h.precipitation_probability[i] ?? 0,
      precipitation: h.precipitation[i] ?? 0,
    })),
    daily: d.time.map((date: string, i: number) => ({
      date,
      weatherCode: d.weather_code[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipProbability: d.precipitation_probability_max[i] ?? 0,
      precipitation: d.precipitation_sum[i] ?? 0,
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      uvIndexMax: d.uv_index_max[i] ?? 0,
    })),
  }
}

type GeocodingResult = {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

/** Busca cidades pelo nome (aceita nomes em português). */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: 'pt',
    format: 'json',
  })
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Busca respondeu ${res.status}`)
  const data: { results?: GeocodingResult[] } = await res.json()

  return (data.results ?? []).map((r) => ({
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(', '),
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}
