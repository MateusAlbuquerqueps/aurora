import { useEffect, useRef, useState } from 'react'
import type { Place } from './api/openMeteo'
import { CurrentWeather } from './components/CurrentWeather'
import { DailyForecast } from './components/DailyForecast'
import { DetailsGrid } from './components/DetailsGrid'
import { Footer } from './components/Footer'
import { LocationButton, ThemeToggle } from './components/HeaderButtons'
import { HourlyForecast } from './components/HourlyForecast'
import { SearchBar } from './components/SearchBar'
import { ErrorMessage, LoadingSkeleton, Welcome } from './components/StatusViews'
import { cardClass } from './components/Card'
import { hasGeolocationPermission, useGeolocation } from './hooks/useGeolocation'
import { useTheme } from './hooks/useTheme'
import { useWeather } from './hooks/useWeather'
import { formatTemp } from './lib/format'
import { getScene, type Scene } from './lib/scene'
import { loadItem, saveItem } from './lib/storage'
import { getWeatherInfo } from './lib/weatherCodes'

export default function App() {
  // Abre direto na última cidade consultada, se houver.
  const [place, setPlace] = useState<Place | null>(() => loadItem<Place>('lastPlace'))
  const { state, retry } = useWeather(place)
  const geo = useGeolocation()
  const theme = useTheme()

  const choosePlace = (p: Place) => {
    setPlace(p)
    saveItem('lastPlace', p)
    geo.clearError()
  }

  const locate = async () => {
    const p = await geo.locate()
    if (p) choosePlace(p)
  }

  // Primeira visita: se o usuário já tinha autorizado a localização antes,
  // usamos o GPS sem perguntar de novo. Caso contrário, mostramos as boas-vindas.
  const autoLocated = useRef(false)
  useEffect(() => {
    // O ref evita pedir duas vezes (o React roda efeitos 2x em desenvolvimento).
    if (place || autoLocated.current) return
    autoLocated.current = true
    hasGeolocationPermission().then((granted) => {
      if (granted) void locate()
    })
    // Só deve rodar uma vez, ao abrir o app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data = state.status === 'success' || state.status === 'loading' ? state.data : undefined

  let scene: Scene = 'night'
  if (data) {
    const today = data.daily[0]
    scene = getScene({
      category: getWeatherInfo(data.current.weatherCode, data.current.isDay).category,
      isDay: data.current.isDay,
      now: data.current.time,
      sunrise: today.sunrise,
      sunset: today.sunset,
    })
  }

  // Título da aba do navegador, ex.: "21° São Paulo · Aurora".
  useEffect(() => {
    document.title = data && place ? `${formatTemp(data.current.temperature)} ${place.name} · Aurora` : 'Aurora'
  }, [data, place])

  return (
    <div className="relative min-h-dvh">
      <div className={`scene scene-${scene}`} aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-6">
        <header className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            className={`${cardClass} flex h-11 shrink-0 items-center gap-2 rounded-full px-1.5 sm:pr-4`}
            aria-label="Aurora, página inicial"
          >
            <img src="/favicon.svg" alt="" className="size-8 rounded-full" />
            <span className="hidden font-semibold sm:inline">Aurora</span>
          </a>
          <SearchBar onSelect={choosePlace} />
          <LocationButton onClick={locate} locating={geo.locating} />
          <ThemeToggle mode={theme.mode} onClick={theme.cycle} />
        </header>

        {geo.error && (
          <p className={`${cardClass} mt-3 rounded-2xl px-4 py-2 text-sm`} role="alert">
            {geo.error}
          </p>
        )}

        <main className="mt-4">
          {!place && <Welcome onLocate={locate} locating={geo.locating} />}

          {place && state.status === 'error' && <ErrorMessage message={state.message} onRetry={retry} />}

          {place && !data && state.status !== 'error' && <LoadingSkeleton />}

          {place && data && (
            // Celular e tablet: uma coluna, na ordem atual → horas → dias → detalhes.
            // Desktop: duas colunas. "contents" faz os blocos internos
            // participarem direto da coluna única enquanto a tela é estreita.
            <div
              className={`flex flex-col gap-4 transition-opacity lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start ${
                state.status === 'loading' ? 'opacity-60' : ''
              }`}
              aria-busy={state.status === 'loading'}
            >
              <div className="contents lg:flex lg:flex-col lg:gap-4">
                <CurrentWeather className="order-1" place={place} current={data.current} today={data.daily[0]} />
                <DailyForecast className="order-3" days={data.daily} currentTemp={data.current.temperature} />
              </div>
              <div className="contents lg:flex lg:flex-col lg:gap-4">
                <HourlyForecast className="order-2" hours={data.hourly} />
                <DetailsGrid className="order-4" current={data.current} today={data.daily[0]} />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
