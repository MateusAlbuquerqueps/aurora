import type { Place } from './openMeteo'

// Converte coordenadas (do GPS) em nome de cidade usando o Nominatim, do
// OpenStreetMap. É gratuito, mas a política de uso pede no máximo
// 1 requisição por segundo, por isso só chamamos quando o usuário usa o GPS.
// https://operations.osmfoundation.org/policies/nominatim/

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<Place> {
  const fallback: Place = { name: 'Minha localização', region: '', latitude, longitude }

  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: latitude.toString(),
      lon: longitude.toString(),
      zoom: '10', // nível de cidade
      'accept-language': 'pt-BR',
    })
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`)
    if (!res.ok) return fallback
    const data: { address?: NominatimAddress } = await res.json()
    const a = data.address ?? {}
    const name = a.city ?? a.town ?? a.village ?? a.municipality ?? a.county
    if (!name) return fallback
    return {
      name,
      region: [a.state, a.country].filter(Boolean).join(', '),
      latitude,
      longitude,
    }
  } catch {
    // Sem nome não é grave: o clima continua aparecendo pelas coordenadas.
    return fallback
  }
}
