import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { initializeHttpInterceptor } from './services/httpInterceptor'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import LoginPage from './components/pages/LoginPage'
import POSPage from './components/pages/POSPage'
import UnauthorizedPage from './components/pages/UnauthorizedPage'
import DevToolsPanel from './components/devtools/DevToolsPanel'

// Inicializar interceptor HTTP solo en desarrollo
if (import.meta.env.DEV) {
  initializeHttpInterceptor()
}

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pos" element={<POSPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/pos" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Developer Tools — solo visible en desarrollo */}
      <DevToolsPanel />
    </BrowserRouter>
  )
}

export default App
