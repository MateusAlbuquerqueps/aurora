import { useCallback, useState } from 'react'
import type { Place } from '../api/openMeteo'
import { reverseGeocode } from '../api/reverseGeocode'

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      // Precisão de cidade basta; isso economiza bateria e responde mais rápido.
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 10 * 60 * 1000,
    }),
  )
}

function errorMessage(err: unknown): string {
  if (!window.isSecureContext) {
    return 'A localização só funciona em conexão segura (https). Busque sua cidade pelo nome.'
  }
  if (err instanceof GeolocationPositionError && err.code === err.PERMISSION_DENIED) {
    return 'Permissão de localização negada. Busque sua cidade pelo nome.'
  }
  return 'Não foi possível obter sua localização. Busque sua cidade pelo nome.'
}

/** Pede a posição do aparelho e descobre o nome da cidade. */
export function useGeolocation() {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback(async (): Promise<Place | null> => {
    if (!('geolocation' in navigator) || !window.isSecureContext) {
      setError(errorMessage(null))
      return null
    }
    setLocating(true)
    setError(null)
    try {
      const { coords } = await getPosition()
      return await reverseGeocode(coords.latitude, coords.longitude)
    } catch (err) {
      setError(errorMessage(err))
      return null
    } finally {
      setLocating(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { locate, locating, error, clearError }
}

/** True se o usuário já autorizou a localização antes (não abre o pedido). */
export async function hasGeolocationPermission(): Promise<boolean> {
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' })
    return status.state === 'granted'
  } catch {
    return false
  }
}
