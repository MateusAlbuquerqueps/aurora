import type { ThemeMode } from '../hooks/useTheme'
import { cardClass } from './Card'
import { LocateIcon, MoonIcon, SpinnerIcon, SunIcon } from './UiIcons'

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

type ThemeToggleProps = { mode: ThemeMode; isDark: boolean; onClick: () => void }

// O ícone mostra para qual tema o clique vai levar (lua = escurecer, sol = clarear).
export function ThemeToggle({ mode, isDark, onClick }: ThemeToggleProps) {
  const current = isDark ? 'escuro' : 'claro'
  const auto = mode === 'system' ? ' (automático, seguindo o aparelho)' : ''
  const label = `Tema ${current}${auto}. Mudar para tema ${isDark ? 'claro' : 'escuro'}.`
  return (
    <button type="button" onClick={onClick} className={roundButton} aria-label={label} title={label}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
