import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { AddEventPage } from './pages/AddEventPage'
import { AiPlannerPage } from './pages/AiPlannerPage'
import { BudgetPage } from './pages/BudgetPage'
import { CustomerDashboard } from './pages/dashboards/CustomerDashboard'
import { AdminDashboard } from './pages/dashboards/AdminDashboard'
import { VendorDashboard } from './pages/dashboards/VendorDashboard'
import { EventsPage } from './pages/EventsPage'
import { GuestsPage } from './pages/GuestsPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { RegisterPage } from './pages/RegisterPage'
import { useAppSelector } from './hooks/redux'

function RoleDashboard() {
  const role = useAppSelector((state) => state.auth.user?.role)
  if (role === 'admin') return <AdminDashboard />
  if (role === 'vendor') return <VendorDashboard />
  return <CustomerDashboard />
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<RoleDashboard />} />
            <Route path="/vendors" element={<MarketplacePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/new" element={<AddEventPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/ai-planner" element={<AiPlannerPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
