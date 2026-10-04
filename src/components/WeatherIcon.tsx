type Props = {
  /** Nome do arquivo em public/icons, sem ".svg" (ex.: "clear-day"). */
  name: string
  /** Texto para leitores de tela. Use "" quando já há um texto ao lado. */
  alt: string
  className?: string
}

// Ícones Meteocons (Bas Milius, licença MIT). Mostra a versão animada, ou a
// versão parada quando o sistema pede "reduzir movimento".
export function WeatherIcon({ name, alt, className }: Props) {
  return (
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcSet={`/icons/static/${name}.svg`} />
      <img
        src={`/icons/animated/${name}.svg`}
        alt={alt}
        className={className}
        width={64}
        height={64}
        draggable={false}
      />
    </picture>
  )
}
