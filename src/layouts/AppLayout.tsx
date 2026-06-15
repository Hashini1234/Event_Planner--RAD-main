import {
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Star,
  Store,
  Sun,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/ai-planner', label: 'AI Planner', icon: Bot },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/bookings', label: 'My Bookings', icon: CreditCard },
  { to: '/budget', label: 'Budget', icon: WalletCards },
  { to: '/guests', label: 'Guests', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/gallery', label: 'Inspiration Gallery', icon: Images },
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
  { label: 'Reviews', icon: Star },
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const links = user?.role === 'vendor' ? vendorLinks : user?.role === 'admin' ? adminLinks : customerLinks
  const userName = user?.name ?? 'devindi'
  const userEmail = user?.email ?? 'Customer'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-[#f7f4fb] text-[#171124]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden bg-gradient-to-b from-[#4b0f86] via-[#2b1469] to-[#141044] text-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-4 py-5">
            <Link to="/" className="flex items-center gap-3 px-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-white/10 text-xl font-bold">
                C
              </span>
              <span>
                <span className="block text-2xl font-bold leading-tight">CelebrateLK</span>
                <span className="text-xs text-white/70">Premium Sri Lankan Events</span>
              </span>
            </Link>

            <div className="mt-8 flex items-center gap-3 border-b border-white/12 px-2 pb-5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80"
                alt={userName}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{userName}</p>
                <p className="truncate text-xs text-white/70">{user?.role ?? userEmail}</p>
              </div>
              <ChevronDown size={16} className="text-white/70" />
            </div>

            <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
              {links.map((link) => (
                <SidebarLink key={link.to} {...link} />
              ))}
              {accountLinks.map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.label}
                    className="flex min-h-12 w-full items-center gap-4 rounded-xl px-4 text-sm font-semibold text-white/82 transition hover:bg-white/10"
                  >
                    <Icon size={19} />
                    {link.label}
                  </button>
                )
              })}
              <button
                className="flex min-h-12 w-full items-center gap-4 rounded-xl px-4 text-sm font-semibold text-white/82 transition hover:bg-white/10"
                onClick={() => dispatch(logout())}
              >
                <LogOut size={19} />
                Log Out
              </button>
            </nav>

            <div className="rounded-xl bg-white/12 p-4 shadow-xl shadow-black/10">
              <CircleHelp size={22} className="text-white" />
              <p className="mt-3 text-sm font-bold">Need Help?</p>
              <p className="mt-1 text-xs leading-5 text-white/70">Contact our support team</p>
              <button className="mt-4 min-h-9 w-full rounded-lg bg-white px-3 text-xs font-bold text-[#6d28d9]">
                Get Help
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-[#ece6f5] bg-white/92 backdrop-blur-xl">
            <div className="flex min-h-[76px] items-center gap-4 px-4 sm:px-6 lg:px-7">
              <button
                aria-label="Open menu"
                className="grid h-11 w-11 place-items-center rounded-xl border border-[#eadff7] text-[#4b1d7a] lg:hidden"
                onClick={() => setOpen((value) => !value)}
              >
                <Menu size={20} />
              </button>

              <div className="hidden min-h-11 w-full max-w-md items-center gap-3 rounded-lg border border-[#ded6ea] bg-white px-4 md:flex">
                <Search size={18} className="text-[#6d6474]" />
                <input
                  className="w-full bg-transparent text-sm text-[#21142f] outline-none placeholder:text-[#8d8498]"
                  placeholder="Search vendors, events, bookings..."
                />
              </div>

              <div className="ml-auto flex items-center gap-3">
                <IconButton label="Notifications" badge="3">
                  <Bell size={18} />
                </IconButton>
                <IconButton label="Messages" badge="2">
                  <CreditCard size={18} />
                </IconButton>
                <div className="hidden items-center rounded-xl border border-[#eadff7] bg-white p-1 sm:flex">
                  <button
                    aria-label="Light mode"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-[#f7f0ff] text-[#5b21b6]"
                    onClick={() => setDark(false)}
                  >
                    <Sun size={16} />
                  </button>
                  <button
                    aria-label="Dark mode"
                    className="grid h-9 w-9 place-items-center rounded-lg text-[#4b3a5d]"
                    onClick={() => setDark(true)}
                  >
                    <Moon size={16} />
                  </button>
                </div>
                <Link to="/events/new">
                  <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#6d28d9] px-4 text-sm font-bold text-white shadow-lg shadow-[#6d28d9]/20 transition hover:bg-[#5b21b6]">
                    <Plus size={17} />
                    Create Event
                  </button>
                </Link>
              </div>
            </div>
            {open && (
              <nav className="grid gap-2 border-t border-[#ece6f5] bg-white px-4 py-4 lg:hidden">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#3d2b4f]"
                    >
                      <Icon size={18} />
                      {link.label}
                    </NavLink>
                  )
                })}
              </nav>
            )}
          </header>

          <main className="min-h-[calc(100vh-76px)] bg-[#f7f4fb]">
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
        `flex min-h-12 items-center gap-4 rounded-xl px-4 text-sm font-semibold transition ${
          isActive
            ? 'bg-[#6d28d9] text-white shadow-lg shadow-black/10'
            : 'text-white/82 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon size={19} />
      {label}
    </NavLink>
  )
}

function IconButton({
  label,
  badge,
  children,
}: {
  label: string
  badge?: string
  children: ReactNode
}) {
  return (
    <button
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-xl text-[#21142f] transition hover:bg-[#f7f0ff]"
    >
      {children}
      {badge && (
        <span className="absolute -right-0.5 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}
