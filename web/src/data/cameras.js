// Catálogo de cámaras. Contrato de cada elemento (spec views.md §1, "Camera"):
// {
//   id: string                          slug único, ej. 'domo-exterior-2mp'
//   name: string                        nombre comercial
//   environment: 'indoor' | 'outdoor'
//   resolution: string                  texto a mostrar, ej. '1080p (2 MP)'
//   nightVisionRangeM: number | null    metros; null = no tiene o no se informa
//   storage: Array<'microsd' | 'cloud' | 'nvr'>   al menos una opción
//   maxMicroSdGb?: number | null
//   highlights?: string[]               hasta 3 textos cortos
//   image: { src, alt, width, height }  importar src desde src/assets/cameras/
// }
//
// Vacío hasta que el negocio cargue los modelos reales: la vista muestra el
// estado "Consultanos por WhatsApp" (CAM-09) y no inventa datos.
export const CAMERAS = []

export const CAMERA_CAPABILITIES = {
  continuousStorage: {
    title: 'Almacenamiento continuo',
    text: 'Grabación permanente para que puedas revisar lo que pasó en cualquier momento, desde donde estés.',
  },
  nightVision: {
    title: 'Visión nocturna',
    text: 'Imagen nítida también de noche, para que la vigilancia no se corte cuando baja la luz.',
  },
}
