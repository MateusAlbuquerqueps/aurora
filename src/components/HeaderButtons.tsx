import type { ThemeMode } from '../hooks/useTheme'
import { cardClass } from './Card'
import { AutoThemeIcon, LocateIcon, MoonIcon, SpinnerIcon, SunIcon } from './UiIcons'

// Botões redondos de 44px: o tamanho mínimo recomendado para toque.
const roundButton = `${cardClass} grid size-11 shrink-0 place-items-center rounded-full transition hover:bg-white/80 dark:hover:bg-slate-800/80 disabled:opacity-60`

export function LocationButton({ onClick, locating }: { onClick: () => void; locating: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locating}
      className={roundButton}
      aria-label="Usar minha localização"
      title="Usar minha localização"
    >
      {locating ? <SpinnerIcon /> : <LocateIcon />}
    </button>
  )
}

const THEME_LABEL: Record<ThemeMode, string> = {
  system: 'automático',
  light: 'claro',
  dark: 'escuro',
}

export function ThemeToggle({ mode, onClick }: { mode: ThemeMode; onClick: () => void }) {
  const label = `Tema ${THEME_LABEL[mode]}. Clique para trocar.`
  return (
    <button type="button" onClick={onClick} className={roundButton} aria-label={label} title={label}>
      {mode === 'system' && <AutoThemeIcon />}
      {mode === 'light' && <SunIcon />}
      {mode === 'dark' && <MoonIcon />}
    </button>
  )
}
