import { useEffect, useState } from 'react'
import { loadItem, saveItem } from '../lib/storage'

// "system" segue a configuração do aparelho; "light"/"dark" são escolhas fixas.
export type ThemeMode = 'system' | 'light' | 'dark'

const NEXT: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' }

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => loadItem<ThemeMode>('theme') ?? 'system')
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches)

  // Acompanha mudanças no tema do aparelho (ex.: modo escuro automático à noite).
  useEffect(() => {
    const query = darkQuery()
    const onChange = () => setSystemDark(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const isDark = mode === 'dark' || (mode === 'system' && systemDark)

  // A classe "dark" no <html> ativa as cores escuras definidas no CSS.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const cycle = () => {
    const next = NEXT[mode]
    setMode(next)
    saveItem('theme', next)
  }

  return { mode, isDark, cycle }
}
