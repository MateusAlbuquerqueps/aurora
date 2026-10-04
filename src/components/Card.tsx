import type { ReactNode } from 'react'

// Cartão translúcido usado em todo o app. O fundo semitransparente com
// desfoque garante texto legível sobre qualquer cenário do fundo dinâmico.
export const cardClass =
  'rounded-3xl bg-white/60 text-slate-900 shadow-lg shadow-slate-900/5 ring-1 ring-white/50 backdrop-blur-xl ' +
  'dark:bg-slate-900/60 dark:text-slate-100 dark:ring-white/10'

type Props = {
  title?: string
  className?: string
  children: ReactNode
}

export function Card({ title, className = '', children }: Props) {
  return (
    <section className={`${cardClass} p-4 sm:p-5 ${className}`} aria-label={title}>
      {title && (
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
