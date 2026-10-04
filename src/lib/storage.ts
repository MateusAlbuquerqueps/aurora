// Guarda pequenas preferências no próprio navegador (localStorage).
// O navegador pode bloquear esse armazenamento (ex.: janela anônima),
// então qualquer falha é ignorada e o app segue funcionando sem ele.

const PREFIX = 'aurora:'

export function loadItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Sem armazenamento disponível: tudo bem, apenas não lembramos.
  }
}
