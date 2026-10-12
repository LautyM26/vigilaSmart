import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BackgroundVideo from './components/BackgroundVideo.jsx'
import Header from './components/Header.jsx'
import Camaras from './pages/Camaras.jsx'
import Home from './pages/Home.jsx'
import Instalacion from './pages/Instalacion.jsx'

/**
 * Clases del <html> según la página, antes del primer pintado (layout effect):
 * - doc: las páginas de lectura cambian el lienzo fijo por uno que scrollea (pages.css).
 * - is-entered: fuera de Inicio la barra no hace la animación de entrada.
 * Además, cada página nueva arranca desde arriba, como una carga normal.
 */
function usePageFrame(pathname) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const isHome = pathname === '/'
    root.classList.toggle('doc', !isHome)
    if (!isHome) root.classList.add('is-entered')
    // instant: el scroll-behavior:smooth del CSS haría deslizar la página nueva
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
}

export default function App() {
  const { pathname } = useLocation()
  usePageFrame(pathname)

  return (
    <>
      <BackgroundVideo />
      <div className="veil" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/instalacion" element={<Instalacion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
