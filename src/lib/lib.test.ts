import { describe, expect, it } from 'vitest'
import {
  formatClock,
  formatHour,
  formatPrecip,
  formatTemp,
  formatVisibility,
  formatWeekday,
  uvLevel,
  windDirection,
} from './format'
import { getScene } from './scene'
import { getWeatherInfo } from './weatherCodes'

describe('weatherCodes', () => {
  it('troca o ícone entre dia e noite', () => {
    expect(getWeatherInfo(0, true).iconName).toBe('clear-day')
    expect(getWeatherInfo(0, false).iconName).toBe('clear-night')
    expect(getWeatherInfo(61, false).iconName).toBe('partly-cloudy-night-rain')
  })

  it('traduz códigos para português e categoria', () => {
    expect(getWeatherInfo(95, true)).toMatchObject({ label: 'Trovoada', category: 'storm' })
    expect(getWeatherInfo(3, true)).toMatchObject({ label: 'Nublado', iconName: 'overcast' })
  })

  it('tem um ícone de reserva para códigos desconhecidos', () => {
    expect(getWeatherInfo(1234, true).iconName).toBe('not-available')
  })
})

describe('format', () => {
  it('arredonda temperaturas', () => {
    expect(formatTemp(20.4)).toBe('20°')
    expect(formatTemp(-0.6)).toBe('-1°')
  })

  it('lê horários locais sem converter fuso', () => {
    expect(formatClock('2026-10-04T17:30')).toBe('17:30')
    expect(formatHour('2026-10-04T07:00')).toBe('07h')
  })

  it('nomeia os dias da semana', () => {
    expect(formatWeekday('2026-10-04', 0)).toBe('Hoje')
    expect(formatWeekday('2026-10-05', 1)).toBe('seg')
    expect(formatWeekday('2026-10-10', 6)).toBe('sáb')
  })

  it('formata chuva com vírgula decimal', () => {
    expect(formatPrecip(0.4)).toBe('0,4 mm')
    expect(formatPrecip(12.6)).toBe('13 mm')
  })

  it('converte graus em pontos cardeais', () => {
    expect(windDirection(0)).toBe('N')
    expect(windDirection(350)).toBe('N')
    expect(windDirection(90)).toBe('L')
    expect(windDirection(225)).toBe('SO')
    expect(windDirection(-45)).toBe('NO')
  })

  it('formata visibilidade e índice UV', () => {
    expect(formatVisibility(14780)).toBe('15 km')
    expect(formatVisibility(800)).toBe('800 m')
    expect(uvLevel(0.45)).toBe('Baixo')
    expect(uvLevel(6)).toBe('Alto')
    expect(uvLevel(11.2)).toBe('Extremo')
  })
})

describe('scene', () => {
  const sun = { sunrise: '2026-10-04T05:50', sunset: '2026-10-04T18:10' }

  it('céu limpo acompanha o sol', () => {
    expect(getScene({ category: 'clear', isDay: true, now: '2026-10-04T12:00', ...sun })).toBe('day')
    expect(getScene({ category: 'clear', isDay: false, now: '2026-10-04T23:00', ...sun })).toBe('night')
    expect(getScene({ category: 'partly', isDay: true, now: '2026-10-04T06:10', ...sun })).toBe('dawn')
    expect(getScene({ category: 'clear', isDay: false, now: '2026-10-04T18:40', ...sun })).toBe('dusk')
  })

  it('o tempo ruim tem prioridade sobre a hora', () => {
    expect(getScene({ category: 'storm', isDay: true, now: '2026-10-04T18:10', ...sun })).toBe('storm')
    expect(getScene({ category: 'drizzle', isDay: false, now: '2026-10-04T22:00', ...sun })).toBe('rain-night')
    expect(getScene({ category: 'cloudy', isDay: true, now: '2026-10-04T12:00', ...sun })).toBe('cloudy-day')
  })
})
