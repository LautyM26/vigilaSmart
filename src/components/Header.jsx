import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PHONE_TEL, WHATSAPP_URL } from '../config/contact.js'
import { BrandMark, BurgerIcon, CaretIcon, NavArrowIcon } from './icons.jsx'

/**
 * Barra superior. En escritorio cada texto tiene su coordenada fija (styles.css,
 * arquitectura A); en tablet y celular el panel se abre con un checkbox y el CSS
 * hace el resto (arquitectura B). Los ids de los spans los usa ese CSS.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const close = () => setIsOpen(false)

  // Al cambiar de página el panel no puede quedar abierto
  useEffect(close, [pathname])

  // Escape cierra el panel abierto
  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header className="bar">
      <Link className="brand" to="/" aria-label="VigilaSmart, inicio" onClick={close}>
        <BrandMark />
        <span id="word">VIGILASMART</span>
      </Link>
      <input
        className="navtoggle"
        type="checkbox"
        id="nav-open"
        aria-label="Menú"
        checked={isOpen}
        onChange={(event) => setIsOpen(event.target.checked)}
      />
      <label className="scrim" htmlFor="nav-open" aria-hidden="true" />
      <label className="burger" htmlFor="nav-open" aria-label="Menú">
        <BurgerIcon />
      </label>
      <div className="navpanel">
        <nav className="menu">
          <NavLink to="/" end onClick={close}>
            <span id="about">Inicio</span>
          </NavLink>
          <NavLink to="/camaras" onClick={close}>
            <span id="product">Cámaras</span>
          </NavLink>
          <NavLink to="/instalacion" onClick={close}>
            <span id="solutions">Instalación</span>
            <CaretIcon />
          </NavLink>
        </nav>
        <a className="login" href={WHATSAPP_URL} target="_blank" rel="noopener" onClick={close}>
          <span id="login">Contactar por WhatsApp</span>
          <NavArrowIcon />
        </a>
        <a className="pill" href={PHONE_TEL} onClick={close}>
          <span id="contact">Llamar ahora</span>
        </a>
      </div>
    </header>
  )
}
