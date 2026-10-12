import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom no implementa estas APIs del navegador; se reemplazan por dobles mínimos.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
})

window.HTMLMediaElement.prototype.play = () => Promise.resolve()
window.HTMLMediaElement.prototype.pause = () => {}

window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
  window.scrollTo.mockClear()
})
