import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import type { Role } from '../../types/domain'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
