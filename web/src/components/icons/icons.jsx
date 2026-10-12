// Íconos SVG propios. No traen color ni grosor: los define el CSS de quien los usa.

export function BrandMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 23 17" aria-hidden="true">
      <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z" />
      <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z" />
      <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z" />
      <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z" />
    </svg>
  )
}

export function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 11" aria-hidden="true">
      <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8" />
    </svg>
  )
}

export function NavArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 10 9" aria-hidden="true">
      <path d="M0 4.5 H9.1 M5.4 0.9 L9.2 4.5 L5.4 8.1" />
    </svg>
  )
}

export function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 11 20" aria-hidden="true">
      <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
    </svg>
  )
}
