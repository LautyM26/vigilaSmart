import { useEffect } from 'react'

/**
 * Título de la pestaña y meta description de cada página.
 * Se actualizan las etiquetas que ya trae index.html (así los buscadores que no
 * corren JS igual ven las de Inicio) en lugar de agregar duplicadas.
 */
export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
}
