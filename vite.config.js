import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// Rutas de React Router fuera de "/" (mantener igual que en src/App.jsx)
const CONTENT_ROUTES = ['camaras', 'instalacion']

/**
 * Copia dist/index.html a dist/<ruta>/index.html al compilar. Así cualquier hosting
 * estático (Vercel incluido, sin vercel.json) responde /camaras o /instalacion al
 * recargar o al entrar directo por un link, en lugar de dar 404.
 */
function routeEntryPages() {
  return {
    name: 'route-entry-pages',
    apply: 'build',
    writeBundle({ dir }) {
      for (const route of CONTENT_ROUTES) {
        mkdirSync(join(dir, route), { recursive: true })
        copyFileSync(join(dir, 'index.html'), join(dir, route, 'index.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeEntryPages()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // web/ es otro proyecto con sus propios tests
    exclude: [...configDefaults.exclude, 'web/**'],
  },
})
