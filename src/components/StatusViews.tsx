import { Card, cardClass } from './Card'
import { LocateIcon, SpinnerIcon } from './UiIcons'

/** Primeira visita: ainda não sabemos qual cidade mostrar. */
export function Welcome({ onLocate, locating }: { onLocate: () => void; locating: boolean }) {
  return (
    <section className={`${cardClass} mx-auto mt-8 max-w-md p-6 text-center sm:p-8`}>
      <img src="/favicon.svg" alt="" className="mx-auto size-16 rounded-2xl" />
      <h1 className="mt-4 text-3xl font-semibold">Aurora</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        A previsão do tempo de qualquer cidade do mundo.
      </p>
      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {locating ? <SpinnerIcon /> : <LocateIcon />}
        Usar minha localização
      </button>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        ou busque uma cidade no campo acima
      </p>
    </section>
  )
}

/** Blocos cinzas pulsando no formato do conteúdo, enquanto os dados chegam. */
export function LoadingSkeleton() {
  const block = 'animate-pulse rounded-xl bg-slate-900/10 dark:bg-white/10'
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-busy="true">
      <span className="sr-only" role="status">
        Carregando previsão…
      </span>
      <Card>
        <div className={`${block} h-7 w-40`} />
        <div className={`${block} mt-6 h-24 w-56`} />
        <div className={`${block} mt-4 h-4 w-48`} />
      </Card>
      <Card>
        <div className={`${block} h-4 w-32`} />
        <div className={`${block} mt-4 h-36`} />
      </Card>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className={`${cardClass} mx-auto mt-8 max-w-md p-6 text-center`} role="alert">
      <p className="font-medium">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-11 rounded-full bg-slate-900 px-6 font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Tentar de novo
      </button>
    </section>
  )
}
