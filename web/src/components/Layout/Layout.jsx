import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx'
import VideoBackground from '../VideoBackground/VideoBackground.jsx'
import Footer from '../Footer/Footer.jsx'
import styles from './Layout.module.css'

/**
 * Estructura común a todas las rutas. Navbar, VideoBackground y Footer quedan
 * montados mientras <Outlet /> cambia de página: el video no se recarga y la
 * reproducción sigue sin cortes al navegar.
 */
export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Cada página arranca desde arriba. 'instant' evita que el scroll-behavior:smooth
  // global anime el salto al cambiar de ruta.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={styles.shell}>
      {/* Fuera del inicio el velo se oscurece para que el texto largo se lea bien */}
      <VideoBackground dimmed={!isHome} />
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
