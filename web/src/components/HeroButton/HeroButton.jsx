import { Link } from 'react-router-dom'
import styles from './HeroButton.module.css'

/**
 * Botón de vidrio (glassmorphism) reutilizable.
 *
 * @param {{ icon?: import('react').ReactNode, text: string, url: string }} props
 *   icon: elemento que va después del texto (ej. <ArrowIcon />).
 *   text: etiqueta visible del botón.
 *   url:  '/ruta' navega dentro del sitio sin recargar; http(s) abre en otra
 *         pestaña; cualquier otro esquema (tel:, mailto:) se abre tal cual.
 */
export default function HeroButton({ icon, text, url }) {
  const content = (
    <>
      <span>{text}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </>
  )

  if (url.startsWith('/')) {
    return (
      <Link to={url} className={styles.button}>
        {content}
      </Link>
    )
  }

  const opensNewTab = /^https?:\/\//.test(url)

  return (
    <a
      href={url}
      className={styles.button}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  )
}
