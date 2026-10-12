import { useEffect, useRef } from 'react'

const VIDEO_SRC = 'https://videos.pexels.com/video-files/5245970/5245970-hd_1920_1080_25fps.mp4'
const POSTER_SRC =
  'https://images.pexels.com/videos/5245970/pexels-photo-5245970.jpeg?auto=compress&cs=tinysrgb&w=1920'

/**
 * Video de fondo: primer plano de un lente (Pexels, licencia libre). El poster es
 * un cuadro del mismo clip. Queda montado al cambiar de página, sin recargarse.
 */
export default function BackgroundVideo() {
  const videoRef = useRef(null)

  // Con movimiento reducido también hay que pausar el video: el reset de CSS
  // solo alcanza animaciones y transiciones. En pausa, queda el primer cuadro.
  useEffect(() => {
    const video = videoRef.current
    const query = window.matchMedia?.('(prefers-reduced-motion:reduce)')
    if (!query || !video) return undefined

    const sync = () => {
      if (query.matches) {
        video.pause()
      } else {
        video.play()?.catch(() => {})
      }
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <video
      ref={videoRef}
      className="art"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      poster={POSTER_SRC}
      src={VIDEO_SRC}
    />
  )
}
