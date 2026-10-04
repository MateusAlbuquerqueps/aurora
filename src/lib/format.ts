// Funções que transformam números da API em textos amigáveis.
// As datas da Open-Meteo chegam no horário local da cidade, sem fuso
// (ex.: "2026-10-04T17:30"). Por isso lemos os pedaços do texto direto,
// em vez de usar Date, que converteria para o fuso de quem está usando o app.

export function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°`
}

/** "2026-10-04T17:30" → "17:30" */
export function formatClock(isoLocal: string): string {
  return isoLocal.slice(11, 16)
}

/** "2026-10-04T17:00" → "17h" */
export function formatHour(isoLocal: string): string {
  return `${isoLocal.slice(11, 13)}h`
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

/** "2026-10-05" → "seg"; o primeiro dia da lista vira "Hoje". */
export function formatWeekday(date: string, index: number): string {
  if (index === 0) return 'Hoje'
  const [y, m, d] = date.split('-').map(Number)
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}

/** Quantidade de chuva: "0,4 mm", "12 mm". */
export function formatPrecip(mm: number): string {
  const value = mm < 10 ? mm.toFixed(1) : Math.round(mm).toString()
  return `${value.replace('.', ',')} mm`
}

const DIRECTIONS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']

/**
 * Converte graus em ponto cardeal. O vento é nomeado pela direção de onde
 * ele VEM: 0° = vento norte (soprando do norte para o sul).
 */
export function windDirection(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8
  return DIRECTIONS[index]
}

/** Metros → "15 km" ou "800 m". */
export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${Math.round(meters / 1000)} km`
  return `${Math.round(meters)} m`
}

// ---- Dicas em linguagem simples (baseadas no glossário do PROJETO.md) ----

export function uvLevel(uv: number): string {
  const v = Math.round(uv)
  if (v <= 2) return 'Baixo'
  if (v <= 5) return 'Moderado'
  if (v <= 7) return 'Alto'
  if (v <= 10) return 'Muito alto'
  return 'Extremo'
}

export function humidityHint(percent: number): string {
  if (percent < 30) return 'Ar seco'
  if (percent <= 70) return 'Confortável'
  return 'Ar úmido'
}

/** O ponto de orvalho indica melhor que a umidade se o dia está abafado. */
export function dewPointHint(celsius: number): string {
  if (celsius < 10) return 'Ar seco'
  if (celsius < 16) return 'Agradável'
  if (celsius < 21) return 'Um pouco abafado'
  return 'Abafado'
}

export function feelsLikeHint(actual: number, feelsLike: number): string {
  const diff = feelsLike - actual
  if (diff >= 2) return 'Parece mais quente'
  if (diff <= -2) return 'Parece mais frio'
  return 'Parecida com a real'
}

/** Escala simplificada de Beaufort, em km/h. */
export function windHint(kmh: number): string {
  if (kmh < 2) return 'Calmo'
  if (kmh < 12) return 'Brisa leve'
  if (kmh < 29) return 'Moderado'
  if (kmh < 50) return 'Forte'
  return 'Muito forte'
}

export function visibilityHint(meters: number): string {
  if (meters >= 10000) return 'Boa'
  if (meters >= 4000) return 'Moderada'
  if (meters >= 1000) return 'Reduzida'
  return 'Muito baixa'
}

/** Pressão média ao nível do mar é ≈ 1013 hPa. */
export function pressureHint(hpa: number): string {
  if (hpa < 1005) return 'Baixa'
  if (hpa > 1022) return 'Alta'
  return 'Normal'
}
