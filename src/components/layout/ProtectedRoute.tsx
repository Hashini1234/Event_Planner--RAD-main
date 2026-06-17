import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import type { Role } from '../../types/domain'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const location = useLocation()
  const { initialized, user } = useAppSelector((state) => state.auth)

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-charcoal-900 text-ivory-50">
        <p className="text-sm font-semibold text-gold-300">Loading CelebrateLK...</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
