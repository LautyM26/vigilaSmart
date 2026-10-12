import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { mediaState } from './test/setup.js'

const html = document.documentElement

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

const navLink = (name) => screen.getAllByRole('link', { name }).find((a) => a.closest('.menu'))
const menuToggle = () => document.getElementById('nav-open')

describe('rutas', () => {
  it('Inicio muestra el hero y marca Inicio como página actual', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Seguridad Inteligente')
    expect(navLink('Inicio').getAttribute('aria-current')).toBe('page')
    expect(navLink('Cámaras').getAttribute('aria-current')).toBeNull()
    expect(html.classList.contains('doc')).toBe(false)
    expect(document.title).toBe('VigilaSmart — Instalación de Cámaras de Seguridad')
  })

  it('Cámaras usa el lienzo de lectura y no repite la entrada de la barra', () => {
    renderAt('/camaras')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Cámaras')
    expect(screen.getByRole('heading', { name: 'Modelos' })).toBeTruthy()
    expect(navLink('Cámaras').getAttribute('aria-current')).toBe('page')
    expect(html.classList.contains('doc')).toBe(true)
    expect(html.classList.contains('is-entered')).toBe(true)
    expect(document.title).toBe('Cámaras — VigilaSmart')
    expect(document.querySelector('meta[name="description"]').getAttribute('content')).toMatch(/^Cámaras de seguridad VigilaSmart/)
  })

  it('Instalación muestra sus tres secciones', () => {
    renderAt('/instalacion')
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titles).toEqual(['Cómo es el servicio', 'Zonas de cobertura', 'Garantía'])
    expect(document.title).toBe('Instalación — VigilaSmart')
  })

  it('una ruta desconocida vuelve a Inicio', () => {
    renderAt('/no-existe')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Seguridad Inteligente')
  })

  it('al volver a Inicio se saca el lienzo de lectura', () => {
    renderAt('/camaras')
    fireEvent.click(navLink('Inicio'))
    expect(html.classList.contains('doc')).toBe(false)
    expect(window.scrollTo).toHaveBeenCalled()
  })
})

describe('menú', () => {
  it('tocar un link navega y cierra el panel', () => {
    renderAt('/')
    fireEvent.click(menuToggle())
    expect(menuToggle().checked).toBe(true)
    fireEvent.click(navLink('Cámaras'))
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Cámaras')
    expect(menuToggle().checked).toBe(false)
  })

  it('Escape cierra el panel abierto', () => {
    renderAt('/')
    fireEvent.click(menuToggle())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(menuToggle().checked).toBe(false)
  })

  it('los botones de contacto apuntan a WhatsApp y al teléfono', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: /Contactar por WhatsApp/ }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5492613648258\?text=/)
    expect(screen.getByRole('link', { name: 'Llamar ahora' }).getAttribute('href')).toBe('tel:+5492613648258')
    expect(screen.getByRole('link', { name: /Solicitar Presupuesto/ }).getAttribute('target')).toBe('_blank')
  })
})

describe('pie y entrada', () => {
  it('el año del pie es el actual', () => {
    renderAt('/')
    expect(document.getElementById('year').textContent).toBe(String(new Date().getFullYear()))
  })

  it('la entrada se retira al terminar la última animación', () => {
    renderAt('/')
    expect(html.classList.contains('is-entered')).toBe(false)
    fireEvent.animationEnd(document.getElementById('foot2'))
    expect(html.classList.contains('is-entered')).toBe(true)
  })

  it('si la animación no termina, la entrada se retira a los 4 segundos', () => {
    vi.useFakeTimers()
    renderAt('/')
    act(() => vi.advanceTimersByTime(3999))
    expect(html.classList.contains('is-entered')).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(html.classList.contains('is-entered')).toBe(true)
  })
})

describe('video de fondo', () => {
  it('se reproduce con movimiento normal', () => {
    renderAt('/')
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
    expect(window.HTMLMediaElement.prototype.pause).not.toHaveBeenCalled()
  })

  it('se pausa con movimiento reducido', () => {
    mediaState.reducedMotion = true
    renderAt('/')
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })
})
