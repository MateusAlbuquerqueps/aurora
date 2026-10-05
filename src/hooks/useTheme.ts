import { useEffect, useState } from 'react'
import { loadItem, saveItem } from '../lib/storage'

// "system" segue a configuração do aparelho; "light"/"dark" são escolhas fixas.
export type ThemeMode = 'system' | 'light' | 'dark'

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

  // Cada clique sempre inverte o tema visível. Se a escolha coincidir com o
  // tema do aparelho, voltamos ao modo automático para acompanhá-lo de novo.
  const toggle = () => {
    const wantDark = !isDark
    const next: ThemeMode = wantDark === systemDark ? 'system' : wantDark ? 'dark' : 'light'
    setMode(next)
    saveItem('theme', next)
  }

  return { mode, isDark, toggle }
}
