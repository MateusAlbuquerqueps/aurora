import { cardClass } from './Card'

// As licenças da Open-Meteo, do OpenStreetMap e dos ícones pedem crédito visível.
export function Footer() {
  const link = 'underline underline-offset-2 hover:no-underline'
  return (
    <footer className={`${cardClass} mt-6 rounded-2xl px-4 py-3 text-center text-xs text-slate-600 dark:text-slate-400`}>
      Dados:{' '}
      <a className={link} href="https://open-meteo.com/" target="_blank" rel="noreferrer">
        Open-Meteo.com
      </a>{' '}
      · Localização: ©{' '}
      <a className={link} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
        OpenStreetMap
      </a>{' '}
      · Ícones:{' '}
      <a className={link} href="https://github.com/basmilius/weather-icons" target="_blank" rel="noreferrer">
        Meteocons
      </a>
    </footer>
  )
}
