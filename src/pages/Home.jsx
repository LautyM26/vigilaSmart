import { useEffect, useRef } from 'react'
import { ArrowIcon, ChevronIcon } from '../components/icons.jsx'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../config/contact.js'
import { useDocumentMeta } from '../hooks/useDocumentMeta.js'

const FEATURES = [
  { id: 'f1', label: 'Monitoreo 24/7' },
  { id: 'f2', label: 'Almacenamiento Continuo' },
  { id: 'f3', label: 'Visión Nocturna' },
  { id: 'f4', label: 'Acceso desde el Celular' },
]

// Respaldo por si la última animación nunca dispara animationend
const ENTRY_FALLBACK_MS = 4000

/**
 * La entrada es CSS puro (html:not(.is-entered) ...); esto solo la retira cuando
 * termina la última animación, así un cambio de breakpoint (que muestra el burger)
 * no la repite. Una vez retirada no vuelve a correr en toda la visita.
 */
function useEntryRetirement(lastAnimatedRef) {
  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('is-entered')) return undefined

    const last = lastAnimatedRef.current
    let timer
    const done = () => {
      clearTimeout(timer)
      last?.removeEventListener('animationend', done)
      root.classList.add('is-entered')
    }
    last?.addEventListener('animationend', done)
    timer = setTimeout(done, ENTRY_FALLBACK_MS)

    return () => {
      clearTimeout(timer)
      last?.removeEventListener('animationend', done)
    }
  }, [lastAnimatedRef])
}

/** Portada: composición fija (escritorio) o en flujo (tablet y celular), según styles.css. */
export default function Home() {
  const lastAnimatedRef = useRef(null)

  useDocumentMeta(
    'VigilaSmart — Instalación de Cámaras de Seguridad',
    'Instalación de cámaras de seguridad para hogares y negocios. Monitoreo 24/7, visión nocturna y acceso desde tu celular. Pedí tu presupuesto por WhatsApp.',
  )
  useEntryRetirement(lastAnimatedRef)

  return (
    <>
      <main className="hero">
        <h1 className="title">
          <span id="h1a">Seguridad Inteligente</span> <span id="h1b">en Alta Definición.</span>
        </h1>
        <p className="sub">
          <span id="sub1">Protegé tu hogar o negocio</span>{' '}
          <span id="sub2">con monitoreo 24/7 directo en tu celular.</span>
        </p>
        <a className="cta" href={WHATSAPP_URL} target="_blank" rel="noopener">
          <span id="cta">Solicitar Presupuesto</span>
          <ArrowIcon className="arrow" />
        </a>
        <ul className="feats">
          {FEATURES.map(({ id, label }) => (
            <li key={id}>
              <ChevronIcon />
              <span id={id}>{label}</span>
            </li>
          ))}
        </ul>
        <span className="rule" aria-hidden="true" />
      </main>

      <footer className="foot" id="contacto">
        <span id="foot1">VigilaSmart - Tu seguridad en buenas manos.</span>
        <span id="foot2" ref={lastAnimatedRef}>
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> · © <time id="year">{new Date().getFullYear()}</time>
        </span>
      </footer>
    </>
  )
}
