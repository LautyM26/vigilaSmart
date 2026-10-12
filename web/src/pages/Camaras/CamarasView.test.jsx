import { useEffect } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import CamarasView from './CamarasView.jsx'
import App from '../../App.jsx'
import { buildWhatsAppUrl } from '../../config/contact.js'

// Datos de prueba: el catálogo real lo aporta el negocio. El getter permite
// cambiar la lista en cada test sin volver a mockear el módulo.
const fixture = vi.hoisted(() => ({ cameras: [] }))

vi.mock('../../data/cameras.js', () => ({
  get CAMERAS() {
    return fixture.cameras
  },
  CAMERA_CAPABILITIES: {
    continuousStorage: { title: 'Almacenamiento continuo', text: 'Texto de almacenamiento' },
    nightVision: { title: 'Visión nocturna', text: 'Texto de visión nocturna' },
  },
}))

const DOMO = {
  id: 'domo-prueba',
  name: 'Domo Prueba',
  environment: 'indoor',
  resolution: '1080p (2 MP)',
  nightVisionRangeM: null,
  storage: ['microsd', 'cloud'],
  maxMicroSdGb: 256,
  highlights: ['Audio bidireccional', 'Detección de movimiento', 'Giro 360°', 'Cuarto extra'],
  image: { src: '/domo.webp', alt: 'Cámara domo de prueba', width: 800, height: 600 },
}

const BULLET = {
  id: 'bullet-prueba',
  name: 'Bullet Prueba',
  environment: 'outdoor',
  resolution: '4 MP',
  nightVisionRangeM: 30,
  storage: ['nvr'],
  maxMicroSdGb: null,
  image: { src: '/bullet.webp', alt: 'Cámara bullet de prueba', width: 800, height: 600 },
}

const MINI = {
  id: 'mini-prueba',
  name: 'Mini Prueba',
  environment: 'indoor',
  resolution: '1080p',
  nightVisionRangeM: 10,
  storage: ['microsd'],
  maxMicroSdGb: null,
  image: { src: '/mini.webp', alt: 'Cámara mini de prueba', width: 800, height: 600 },
}

let currentLocation
let currentNavigationType

// Expone la ubicación actual del router a los tests (se actualiza tras cada render)
function LocationProbe() {
  const location = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    currentLocation = location
    currentNavigationType = navigationType
  })
  return null
}

function renderView(url = '/camaras') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/camaras"
          element={
            <>
              <CamarasView />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

const catalogNames = () =>
  within(screen.getByRole('list', { name: 'Modelos' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

const itemOf = (name) => screen.getByRole('heading', { level: 3, name }).closest('li')

const isBefore = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

beforeEach(() => {
  fixture.cameras = [DOMO, BULLET, MINI]
})

describe('CamarasView', () => {
  it('CAM-01: renderiza h1, capacidades, filtro, catálogo y CTA final en ese orden', () => {
    renderView()
    const title = screen.getByRole('heading', { level: 1, name: 'Cámaras' })
    const storage = screen.getByRole('heading', { level: 2, name: 'Almacenamiento continuo' })
    const nightVision = screen.getByRole('heading', { level: 2, name: 'Visión nocturna' })
    const filter = screen.getByRole('group', { name: 'Filtrar por ambiente' })
    const catalog = screen.getByRole('list', { name: 'Modelos' })
    const cta = screen.getByRole('link', { name: /solicitar presupuesto/i })

    const ordered = [title, storage, nightVision, filter, catalog, cta]
    ordered.slice(1).forEach((element, index) => expect(isBefore(ordered[index], element)).toBe(true))
    expect(screen.getByText('Texto de almacenamiento')).toBeTruthy()
  })

  it('NAVX-05: el h1 puede recibir foco programático', () => {
    renderView()
    expect(screen.getByRole('heading', { level: 1 }).getAttribute('tabindex')).toBe('-1')
  })

  it('CAM-02: muestra un ítem por cámara en el orden de los datos', () => {
    renderView()
    expect(catalogNames()).toEqual(['Domo Prueba', 'Bullet Prueba', 'Mini Prueba'])
  })

  it('CAM-03: muestra ambiente, resolución y almacenamiento con capacidad de microSD', () => {
    renderView()
    const domo = within(itemOf('Domo Prueba'))
    expect(domo.getByText('Interior')).toBeTruthy()
    expect(domo.getByText('1080p (2 MP)')).toBeTruthy()
    expect(domo.getByText('microSD (hasta 256 GB) · Nube')).toBeTruthy()
  })

  it('CAM-03: omite la visión nocturna cuando es null y la muestra cuando existe', () => {
    renderView()
    expect(within(itemOf('Domo Prueba')).queryByText('Visión nocturna')).toBeNull()
    expect(within(itemOf('Bullet Prueba')).getByText('Hasta 30 m')).toBeTruthy()
    expect(within(itemOf('Bullet Prueba')).getByText('Grabador (NVR)')).toBeTruthy()
  })

  it('CAM-03: muestra como máximo 3 highlights', () => {
    renderView()
    const domo = within(itemOf('Domo Prueba'))
    expect(domo.getByText('Giro 360°')).toBeTruthy()
    expect(domo.queryByText('Cuarto extra')).toBeNull()
  })

  it('CAM-03: la imagen carga perezosa, con medidas y alt', () => {
    renderView()
    const image = screen.getByRole('img', { name: 'Cámara bullet de prueba' })
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('decoding')).toBe('async')
    expect(image.getAttribute('width')).toBe('800')
    expect(image.getAttribute('height')).toBe('600')
  })

  it('CAM-03: si la imagen falla se oculta la foto y el resto del ítem queda', () => {
    renderView()
    fireEvent.error(screen.getByRole('img', { name: 'Cámara bullet de prueba' }))
    expect(screen.queryByRole('img', { name: 'Cámara bullet de prueba' })).toBeNull()
    expect(within(itemOf('Bullet Prueba')).getByText('4 MP')).toBeTruthy()
  })

  it('CAM-04: cada modelo tiene su link de consulta a WhatsApp con el nombre y aviso de pestaña nueva', () => {
    renderView()
    const link = within(itemOf('Bullet Prueba')).getByRole('link', {
      name: 'Consultar este modelo: Bullet Prueba (se abre en una pestaña nueva)',
    })
    expect(link.getAttribute('href')).toBe(
      buildWhatsAppUrl('Hola, vengo de la web VigilaSmart y quiero consultar por el modelo Bullet Prueba'),
    )
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('CAM-05: el filtro marca el botón activo y actualiza ?ambiente= con replace', () => {
    renderView()
    const outdoor = screen.getByRole('button', { name: 'Exterior' })
    expect(screen.getByRole('button', { name: 'Todas' }).getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(outdoor)

    expect(outdoor.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Todas' }).getAttribute('aria-pressed')).toBe('false')
    expect(currentLocation.search).toBe('?ambiente=exterior')
    expect(currentNavigationType).toBe('REPLACE')
    expect(catalogNames()).toEqual(['Bullet Prueba'])
  })

  it('CAM-05: el filtro leído de la URL se aplica al cargar', () => {
    renderView('/camaras?ambiente=interior')
    expect(screen.getByRole('button', { name: 'Interior' }).getAttribute('aria-pressed')).toBe('true')
    expect(catalogNames()).toEqual(['Domo Prueba', 'Mini Prueba'])
  })

  it('CAM-06: un valor inválido en ?ambiente= equivale a "Todas"', () => {
    renderView('/camaras?ambiente=xyz')
    expect(screen.getByRole('button', { name: 'Todas' }).getAttribute('aria-pressed')).toBe('true')
    expect(catalogNames()).toHaveLength(3)
  })

  it('CAM-07: anuncia la cantidad de resultados y la actualiza al filtrar', () => {
    renderView()
    const status = screen.getByRole('status')
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.textContent).toBe('3 modelos')
    fireEvent.click(screen.getByRole('button', { name: 'Exterior' }))
    expect(status.textContent).toBe('1 modelo')
  })

  it('CAM-08: sin resultados muestra estado vacío con "Ver todas" y WhatsApp', () => {
    fixture.cameras = [DOMO, MINI]
    renderView('/camaras?ambiente=exterior')

    expect(screen.queryByRole('list', { name: 'Modelos' })).toBeNull()
    expect(screen.getByText('No hay modelos para este ambiente.')).toBeTruthy()
    expect(screen.getByRole('link', { name: /consultanos por whatsapp/i }).getAttribute('target')).toBe('_blank')

    fireEvent.click(screen.getByRole('button', { name: 'Ver todas' }))
    expect(currentLocation.search).toBe('?ambiente=todas')
    expect(catalogNames()).toEqual(['Domo Prueba', 'Mini Prueba'])
  })

  it('CAM-09: con el catálogo vacío oculta filtro y lista y ofrece WhatsApp', () => {
    fixture.cameras = []
    renderView()
    expect(screen.queryByRole('group', { name: 'Filtrar por ambiente' })).toBeNull()
    expect(screen.queryByRole('list', { name: 'Modelos' })).toBeNull()
    expect(screen.getByText('Consultanos por WhatsApp los modelos disponibles.')).toBeTruthy()
    expect(screen.getByRole('link', { name: /abrir whatsapp/i }).getAttribute('href')).toContain('https://wa.me/')
  })

  it('CAM-10: define el título de la pestaña y una meta description propia', () => {
    renderView()
    expect(document.title).toBe('Cámaras — VigilaSmart')
    const descriptions = document.head.querySelectorAll('meta[name="description"]')
    expect(descriptions).toHaveLength(1)
    expect(descriptions[0].getAttribute('content')).toMatch(/cámaras/i)
  })

  it('CAM-11: cambiar el filtro no mueve el scroll (integración con Layout)', () => {
    render(
      <MemoryRouter initialEntries={['/camaras']}>
        <App />
      </MemoryRouter>,
    )
    expect(window.scrollTo).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Exterior' }))
    expect(window.scrollTo).toHaveBeenCalledTimes(1)
  })
})
