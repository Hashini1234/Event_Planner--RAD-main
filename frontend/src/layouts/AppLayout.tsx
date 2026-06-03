import { CalendarDays, LayoutDashboard, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/events', label: 'Events' },
  { to: '/events/new', label: 'Add Event' },
  { to: '/guests', label: 'Guests' },
  { to: '/budget', label: 'Budget' },
  { to: '/payments', label: 'Payments' },
  { to: '/ai-planner', label: 'AI Planner' },
]

export function AppLayout() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 dark:bg-charcoal-900 dark:text-ivory-50">
      <header className="sticky top-0 z-40 border-b border-gold-100/80 bg-ivory-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-charcoal-900/90">
        <div className="section-shell flex min-h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-charcoal-900 text-lg font-bold text-gold-300 dark:bg-gold-300 dark:text-charcoal-900">
              C
            </span>
            <span>
              <span className="block font-display text-xl font-bold">CelebrateLK</span>
              <span className="hidden text-xs text-charcoal-800/60 dark:text-ivory-100/60 sm:block">
                Premium Sri Lankan events
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300'
                      : 'text-charcoal-800/70 hover:bg-white/70 dark:text-ivory-100/70 dark:hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-gold-100 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/10 md:flex">
              <Search size={16} />
              <input
                className="w-40 bg-transparent text-sm outline-none placeholder:text-charcoal-800/45 dark:placeholder:text-ivory-100/45"
                placeholder="Search bookings"
              />
            </div>
            <span className="rounded-md border border-gold-100 bg-white/75 px-3 py-2 text-sm font-semibold capitalize dark:border-white/10 dark:bg-charcoal-800">
              {user?.role}
            </span>
            <button
              aria-label="Toggle theme"
              className="grid size-10 place-items-center rounded-md hover:bg-white/70 dark:hover:bg-white/10"
              onClick={() => setDark((value) => !value)}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-md lg:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu size={20} />
            </button>
            <button
              aria-label="Logout"
              className="hidden size-10 place-items-center rounded-md hover:bg-white/70 dark:hover:bg-white/10 sm:grid"
              onClick={() => dispatch(logout())}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        {open && (
          <nav className="section-shell grid gap-2 pb-4 lg:hidden">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className="rounded-md px-3 py-2 text-sm">
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="section-shell flex flex-col gap-3 py-8 text-sm text-charcoal-800/60 dark:text-ivory-100/60 sm:flex-row sm:items-center sm:justify-between">
        <span>CelebrateLK event operations platform</span>
        <span className="flex items-center gap-2">
          <LayoutDashboard size={16} /> Real-time bookings
          <CalendarDays size={16} /> Vendor calendar
        </span>
      </footer>
    </div>
  )
}
