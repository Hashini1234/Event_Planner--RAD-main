import {
  Bell,
  Bot,
  CalendarDays,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Search,
  Sparkles,
  Store,
  Sun,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/events/new', label: 'Add Event', icon: PlusCircle },
  { to: '/guests', label: 'Guests', icon: Users },
  { to: '/budget', label: 'Budget', icon: WalletCards },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/ai-planner', label: 'AI Planner', icon: Bot },
]

const vendorLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Marketplace', icon: Store },
]

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/events', label: 'Events', icon: CalendarDays },
]

const accountLinks = [
  { label: 'Profile Settings', icon: UserRound },
  { label: 'Notification', icon: Bell },
  { label: 'Help & Support', icon: CircleHelp },
]

export function AppLayout() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [dark, setDark] = useState(true)
  const [open, setOpen] = useState(false)
  const links = user?.role === 'vendor' ? vendorLinks : user?.role === 'admin' ? adminLinks : customerLinks
  const userName = user?.name ?? 'Amali Perera'
  const userEmail = user?.email ?? 'amali.perera@email.com'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-[#11100e] text-ivory-50">
      <div className="grid min-h-screen lg:grid-cols-[292px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#15120f] lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <Link to="/" className="flex min-h-[82px] items-center gap-3 border-b border-white/10 px-7">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-gold-300 text-xl font-bold text-charcoal-900">
                C
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">CelebrateLK</span>
                <span className="text-xs text-ivory-50/58">Premium Sri Lankan events</span>
              </span>
            </Link>

            <div className="px-7 py-7 text-center">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=82"
                alt={userName}
                className="mx-auto h-28 w-28 rounded-full object-cover ring-2 ring-white/10"
              />
              <p className="mt-4 font-bold">{userName}</p>
              <p className="mt-1 truncate text-sm text-ivory-50/58">{userEmail}</p>
            </div>

            <nav className="flex-1 px-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-ivory-50/38">Main</p>
              <div className="space-y-2">
                {links.slice(0, 6).map((link) => (
                  <SidebarLink key={link.to} {...link} />
                ))}
              </div>
              <p className="mb-2 mt-8 px-3 text-xs font-semibold uppercase tracking-wide text-ivory-50/38">Account</p>
              <div className="space-y-2">
                {accountLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <button
                      key={link.label}
                      className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-ivory-50/78 transition hover:bg-white/8"
                    >
                      <Icon size={17} />
                      {link.label}
                    </button>
                  )
                })}
                <button
                  className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-ivory-50/78 transition hover:bg-white/8"
                  onClick={() => dispatch(logout())}
                >
                  <LogOut size={17} />
                  Log Out
                </button>
              </div>
            </nav>

            <div className="p-6">
              <div className="rounded-lg border border-white/10 bg-white/6 p-5 text-center">
                <Sparkles className="mx-auto text-gold-300" size={32} />
                <p className="mt-4 font-bold">Upgrade to Premium</p>
                <p className="mt-2 text-xs leading-6 text-ivory-50/62">Unlock exclusive features and VIP vendor deals.</p>
                <button className="mt-5 min-h-10 w-full rounded-md bg-gold-300 px-4 text-sm font-bold text-charcoal-900">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#15120f]/92 backdrop-blur-xl">
            <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link to="/" className="flex items-center gap-3 lg:hidden">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-gold-300 font-bold text-charcoal-900">C</span>
                <span className="font-display text-xl font-bold">CelebrateLK</span>
              </Link>

              <nav className="hidden items-center gap-5 xl:flex">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition ${
                          isActive
                            ? 'border-gold-300 text-gold-300'
                            : 'border-transparent text-ivory-50/76 hover:text-gold-300'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {link.label}
                    </NavLink>
                  )
                })}
              </nav>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden min-h-12 items-center gap-3 rounded-md border border-white/10 bg-white/8 px-4 md:flex">
                  <Search size={18} className="text-ivory-50/62" />
                  <input
                    className="w-48 bg-transparent text-sm outline-none placeholder:text-ivory-50/42"
                    placeholder="Search bookings"
                  />
                </div>
                <span className="hidden rounded-md border border-white/10 bg-white/8 px-5 py-3 text-sm font-bold capitalize sm:inline-flex">
                  {user?.role ?? 'customer'}
                </span>
                <button
                  aria-label="Toggle theme"
                  className="grid h-11 w-11 place-items-center rounded-md text-ivory-50/78 transition hover:bg-white/8"
                  onClick={() => setDark((value) => !value)}
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  aria-label="Open menu"
                  className="grid h-11 w-11 place-items-center rounded-md text-ivory-50 lg:hidden"
                  onClick={() => setOpen((value) => !value)}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
            {open && (
              <nav className="grid gap-2 border-t border-white/10 px-4 py-4 lg:hidden">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <NavLink key={link.to} to={link.to} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
                      <Icon size={17} />
                      {link.label}
                    </NavLink>
                  )
                })}
              </nav>
            )}
          </header>

          <main className="min-h-[calc(100vh-82px)] bg-[radial-gradient(circle_at_top_left,rgba(197,155,59,0.09),transparent_34%),#11100e]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ to, label, icon: Icon }: { to: string; label: string; icon: typeof LayoutDashboard }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
          isActive ? 'bg-gold-300/12 text-gold-300' : 'text-ivory-50/78 hover:bg-white/8'
        }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  )
}
