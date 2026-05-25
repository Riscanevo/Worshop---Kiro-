import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  requiredRole?: string
  redirectTo?: string
}

export default function ProtectedRoute({
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, checkAuth, user } = useAuthStore()

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
