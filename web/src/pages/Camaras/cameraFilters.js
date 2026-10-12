// Lógica pura del filtro del catálogo: sin React, para testearla aislada.

/** Opciones del filtro: valor interno, valor en la URL (?ambiente=) y etiqueta visible. */
export const ENVIRONMENT_FILTERS = [
  { value: 'all', param: 'todas', label: 'Todas' },
  { value: 'indoor', param: 'interior', label: 'Interior' },
  { value: 'outdoor', param: 'exterior', label: 'Exterior' },
]

export const ENVIRONMENT_PARAM = 'ambiente'

/**
 * Traduce el valor de ?ambiente= al filtro interno.
 * Ausente o inválido equivale a "todas" (CAM-06).
 * @param {string | null} param
 * @returns {'all' | 'indoor' | 'outdoor'}
 */
export function parseEnvironmentFilter(param) {
  const match = ENVIRONMENT_FILTERS.find((filter) => filter.param === param)
  return match ? match.value : 'all'
}

/**
 * Devuelve las cámaras del ambiente pedido, en el orden original.
 * @template {{ environment: 'indoor' | 'outdoor' }} T
 * @param {T[]} cameras
 * @param {'all' | 'indoor' | 'outdoor'} filter
 * @returns {T[]}
 */
export function filterCameras(cameras, filter) {
  if (filter === 'all') return cameras
  return cameras.filter((camera) => camera.environment === filter)
}

/** "1 modelo" / "N modelos" para el anuncio de resultados (CAM-07). */
export function formatModelCount(count) {
  return `${count} ${count === 1 ? 'modelo' : 'modelos'}`
}
