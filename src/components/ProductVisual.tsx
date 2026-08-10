import type { Product } from '../types'

interface ProductVisualProps {
  product: Product
  hero?: boolean
}

export function ProductVisual({ product, hero = false }: ProductVisualProps) {
  const gradientId = `screen-${product.id}-${hero ? 'hero' : 'card'}`

  return (
    <svg
      className={hero ? 'laptop-visual laptop-visual--hero' : 'laptop-visual'}
      viewBox="0 0 520 340"
      role="img"
      aria-label={`${product.name} illustrative laptop rendering`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={product.palette[0]} />
          <stop offset="1" stopColor={product.palette[1]} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="#071b33" floodOpacity=".22" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M108 44h304a18 18 0 0 1 18 18v196H90V62a18 18 0 0 1 18-18Z" fill="#1b2530" />
        <path d="M106 61h308v180H106z" rx="7" fill={`url(#${gradientId})`} />
        <circle cx="260" cy="52" r="3" fill="#756f68" />
        <path d="M53 258h414l35 29c8 7 4 16-8 16H25c-12 0-16-9-8-16l36-29Z" fill="#7f827f" />
        <path d="M53 258h414l-17 17H70l-17-17Z" fill="#b4b3ad" />
        <path d="M222 266h76l12 19h-100l12-19Z" fill="#8f918d" />
        <path d="M18 289h484c-2 9-10 14-24 14H42c-14 0-22-5-24-14Z" fill="#343a3e" />
      </g>
      <path d="M130 218c54-48 101-70 151-63 44 6 70 31 108 31v55H106v-2c6-8 14-15 24-21Z" fill="#0b4dbf" opacity=".45" />
      <circle cx="341" cy="108" r="38" fill="#ffe500" opacity=".92" />
    </svg>
  )
}
