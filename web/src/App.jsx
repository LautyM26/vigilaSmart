import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Home from './pages/Home/Home.jsx'
import CamarasView from './pages/Camaras/CamarasView.jsx'
import Instalacion from './pages/Instalacion/Instalacion.jsx'

/**
 * Mapa de rutas del sitio. Todas cuelgan de <Layout />, que mantiene montados
 * Navbar, video de fondo y Footer mientras cambia la página del medio.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="camaras" element={<CamarasView />} />
        <Route path="instalacion" element={<Instalacion />} />
        {/* Cualquier ruta desconocida vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
