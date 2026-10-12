import { useEffect, useRef } from 'react'
import styles from './VideoBackground.module.css'

// Clip de Pexels (licencia libre): primer plano de un lente. El poster es un cuadro del mismo clip.
const VIDEO_SRC = 'https://videos.pexels.com/video-files/5245970/5245970-hd_1920_1080_25fps.mp4'
const POSTER_SRC =
  'https://images.pexels.com/videos/5245970/pexels-photo-5245970.jpeg?auto=compress&cs=tinysrgb&w=1920'

/**
 * Video de fondo fijo con un velo encima para dar contraste al texto.
 * Vive en el Layout, así no se desmonta al cambiar de ruta.
 *
 * @param {{ dimmed?: boolean }} props
 *   dimmed: oscurece el velo (páginas con texto largo). Solo cambia una clase,
 *   el <video> sigue siendo el mismo elemento.
 */
export default function VideoBackground({ dimmed = false }) {
  const videoRef = useRef(null)

  // La reproducción la decide este efecto y no el atributo autoplay: con
  // movimiento reducido el video queda en pausa en el poster.
  useEffect(() => {
    const video = videoRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPlayback = () => {
      if (reducedMotion.matches) {
        video.pause()
        return
      }
      // muted como propiedad: React no siempre emite el atributo y iOS lo exige para reproducir solo
      video.muted = true
      video.play().catch(() => {})
    }

    syncPlayback()
    reducedMotion.addEventListener('change', syncPlayback)
    return () => reducedMotion.removeEventListener('change', syncPlayback)
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className={`${styles.veil} ${dimmed ? styles.dimmed : ''}`} aria-hidden="true" />
    </>
  )
}
