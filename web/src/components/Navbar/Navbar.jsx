import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark, NavArrowIcon } from '../icons/icons.jsx'
import { PHONE_TEL, WHATSAPP_URL } from '../../config/contact.js'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/camaras', label: 'Cámaras' },
  { to: '/instalacion', label: 'Instalación' },
]

/**
 * Barra superior. En pantallas chicas el menú vive detrás de un botón
 * hamburguesa cuyo estado (abierto/cerrado) maneja useState; desde 1200px
 * los links se muestran en línea y el botón se oculta por CSS.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const burgerRef = useRef(null)
  const panelId = useId()

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen)

  // Con el menú abierto, Escape lo cierra y devuelve el foco al botón
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setIsMenuOpen(false)
      burgerRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const linkClassName = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand} onClick={closeMenu}>
        <BrandMark className={styles.brandMark} />
        <span className={styles.word}>VIGILASMART</span>
      </Link>

      <button
        ref={burgerRef}
        type="button"
        className={styles.burger}
        aria-expanded={isMenuOpen}
        aria-controls={panelId}
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 22 14" aria-hidden="true">
          <path className={styles.line1} d="M1 1 H21" />
          <path className={styles.line2} d="M1 7 H21" />
          <path className={styles.line3} d="M1 13 H21" />
        </svg>
      </button>

      {/* Capa invisible: tocar fuera del panel lo cierra */}
      {isMenuOpen && <div className={styles.scrim} onClick={closeMenu} aria-hidden="true" />}

      <div id={panelId} className={`${styles.panel} ${isMenuOpen ? styles.panelOpen : ''}`}>
        <nav className={styles.menu} aria-label="Principal">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClassName} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
        </nav>

        <a
          className={styles.whatsapp}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          Contactar por WhatsApp
          <NavArrowIcon className={styles.navArrow} />
        </a>

        <a className={styles.pill} href={PHONE_TEL} onClick={closeMenu}>
          Llamar ahora
        </a>
      </div>
    </header>
  )
}
