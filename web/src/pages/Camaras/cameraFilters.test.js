import { describe, expect, it } from 'vitest'
import { filterCameras, formatModelCount, parseEnvironmentFilter } from './cameraFilters.js'

const cameras = [
  { id: 'a', environment: 'indoor' },
  { id: 'b', environment: 'outdoor' },
  { id: 'c', environment: 'indoor' },
]

describe('parseEnvironmentFilter (CAM-05, CAM-06)', () => {
  it('traduce los valores válidos del parámetro ?ambiente=', () => {
    expect(parseEnvironmentFilter('interior')).toBe('indoor')
    expect(parseEnvironmentFilter('exterior')).toBe('outdoor')
    expect(parseEnvironmentFilter('todas')).toBe('all')
  })

  it('trata un parámetro ausente como "todas"', () => {
    expect(parseEnvironmentFilter(null)).toBe('all')
  })

  it('trata un valor inválido como "todas"', () => {
    expect(parseEnvironmentFilter('xyz')).toBe('all')
    expect(parseEnvironmentFilter('')).toBe('all')
  })
})

describe('filterCameras (CAM-02)', () => {
  it('con "all" devuelve todas, en el orden original', () => {
    expect(filterCameras(cameras, 'all').map((c) => c.id)).toEqual(['a', 'b', 'c'])
  })

  it('filtra por ambiente conservando el orden', () => {
    expect(filterCameras(cameras, 'indoor').map((c) => c.id)).toEqual(['a', 'c'])
    expect(filterCameras(cameras, 'outdoor').map((c) => c.id)).toEqual(['b'])
  })

  it('devuelve una lista vacía si ninguna coincide', () => {
    expect(filterCameras([cameras[0]], 'outdoor')).toEqual([])
  })
})

describe('formatModelCount (CAM-07)', () => {
  it('usa singular para un modelo', () => {
    expect(formatModelCount(1)).toBe('1 modelo')
  })

  it('usa plural para cero y para varios', () => {
    expect(formatModelCount(0)).toBe('0 modelos')
    expect(formatModelCount(3)).toBe('3 modelos')
  })
})
