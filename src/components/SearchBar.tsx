import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { searchPlaces, type Place } from '../api/openMeteo'
import { cardClass } from './Card'
import { SearchIcon, SpinnerIcon } from './UiIcons'

// Espera o usuário parar de digitar antes de buscar, para não fazer uma
// consulta a cada tecla.
const DEBOUNCE_MS = 300
const MIN_CHARS = 2

type Props = {
  onSelect: (place: Place) => void
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  // Guarda junto o texto pesquisado, para saber se o resultado ainda vale.
  const [found, setFound] = useState<{ query: string; places: Place[] }>({ query: '', places: [] })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const trimmed = query.trim()
  const searching = trimmed.length >= MIN_CHARS
  const loading = searching && found.query !== trimmed
  const results = searching && !loading ? found.places : []

  useEffect(() => {
    if (trimmed.length < MIN_CHARS) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      searchPlaces(trimmed, controller.signal)
        .then((places) => {
          setFound({ query: trimmed, places })
          setActive(-1)
        })
        .catch(() => {
          if (!controller.signal.aborted) setFound({ query: trimmed, places: [] })
        })
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed])

  const choose = (place: Place) => {
    onSelect(place)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      const place = results[active] ?? results[0]
      if (place) choose(place)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && trimmed.length >= MIN_CHARS && !loading

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar cidade
      </label>
      <div className={`${cardClass} flex h-11 items-center gap-2 rounded-full px-4`}>
        {loading ? (
          <SpinnerIcon className="size-5 shrink-0 opacity-60" />
        ) : (
          <SearchIcon className="size-5 shrink-0 opacity-60" />
        )}
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder="Buscar cidade"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          // Pequena espera para o clique numa sugestão ser registrado antes de fechar.
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white/95 py-1 text-slate-900 shadow-xl ring-1 ring-slate-900/10 backdrop-blur-xl dark:bg-slate-900/95 dark:text-slate-100 dark:ring-white/10"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
              Nenhuma cidade encontrada.
            </li>
          ) : (
            results.map((place, i) => (
              <li
                key={`${place.latitude},${place.longitude}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(place)}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-4 py-2.5 ${
                  i === active ? 'bg-sky-500/15' : ''
                }`}
              >
                <span className="font-medium">{place.name}</span>
                {place.region && (
                  <span className="block text-sm text-slate-600 dark:text-slate-400">
                    {place.region}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
