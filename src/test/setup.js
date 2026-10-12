// Entorno de tests: jsdom no trae matchMedia ni reproduce video, así que se simulan.
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

/** matchMedia falso; cada test puede cambiar `reducedMotion` antes de renderizar. */
export const mediaState = { reducedMotion: false }

beforeEach(() => {
  mediaState.reducedMotion = false
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('prefers-reduced-motion') && mediaState.reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
  window.HTMLMediaElement.prototype.pause = vi.fn()
  window.scrollTo = vi.fn()
})

afterEach(() => {
  cleanup()
  // el <html> es global: cada test arranca sin clases, como una visita nueva
  document.documentElement.className = ''
  vi.useRealTimers()
})
