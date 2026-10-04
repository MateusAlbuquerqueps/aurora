import { useCallback, useEffect, useState } from 'react'
import { fetchForecast, type Forecast, type Place } from '../api/openMeteo'

// Evita repetir a mesma consulta: a Open-Meteo atualiza os dados a cada
// ~15 minutos, então reaproveitamos uma resposta por até 10 minutos.
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { data: Forecast; fetchedAt: number }>()

export type WeatherState =
  | { status: 'idle' }
  /** "data" traz a cidade anterior, mantida na tela enquanto a nova carrega. */
  | { status: 'loading'; data?: Forecast }
  | { status: 'success'; data: Forecast }
  | { status: 'error'; message: string }

// Resultado da última busca concluída, identificado pela cidade e pela tentativa.
type Result = { key: string; attempt: number; data?: Forecast; error?: string }

function cacheKey(place: Place) {
  return `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`
}

function getForecast(place: Place, signal: AbortSignal): Promise<Forecast> {
  const key = cacheKey(place)
  const cached = cache.get(key)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return Promise.resolve(cached.data)
  return fetchForecast(place.latitude, place.longitude, signal).then((data) => {
    cache.set(key, { data, fetchedAt: Date.now() })
    return data
  })
}

export function useWeather(place: Place | null) {
  const [result, setResult] = useState<Result | null>(null)
  const [lastData, setLastData] = useState<Forecast | undefined>()
  // Mudar esse número força uma nova busca (botão "Tentar de novo").
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!place) return
    const key = cacheKey(place)
    // Se o usuário trocar de cidade antes da resposta chegar, cancelamos a
    // busca antiga para ela não sobrescrever a nova.
    const controller = new AbortController()

    getForecast(place, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setResult({ key, attempt, data })
        setLastData(data)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        console.error(err)
        setResult({
          key,
          attempt,
          error: navigator.onLine
            ? 'Não foi possível carregar a previsão. Tente novamente em instantes.'
            : 'Você está sem internet. Verifique sua conexão e tente de novo.',
        })
      })

    return () => controller.abort()
  }, [place, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  // O estado mostrado é calculado a partir do último resultado: se ele não
  // é da cidade/tentativa atual, a busca ainda está em andamento.
  let state: WeatherState
  if (!place) {
    state = { status: 'idle' }
  } else if (result?.key === cacheKey(place) && result.attempt === attempt) {
    state = result.data
      ? { status: 'success', data: result.data }
      : { status: 'error', message: result.error ?? '' }
  } else {
    state = { status: 'loading', data: lastData }
  }

  return { state, retry }
}
