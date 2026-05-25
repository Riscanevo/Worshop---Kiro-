import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

interface PublicRouteProps {
  redirectTo?: string
}

export default function PublicRoute({ redirectTo = '/pos' }: PublicRouteProps) {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
