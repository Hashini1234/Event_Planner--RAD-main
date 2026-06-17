import { ArrowRight, BadgeCheck, CalendarCheck, Eye, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { login } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { api } from '../services/api'
import type { Role } from '../types/domain'

const demoAccounts: Record<Role, { name: string; email: string; password: string; phone: string; label: string }> = {
  customer: {
    name: 'Demo Customer',
    email: 'customer@celebratelk.demo',
    password: 'password123',
    phone: '0700000001',
    label: 'Customer Dashboard',
  },
  vendor: {
    name: 'Demo Vendor',
    email: 'vendor@celebratelk.demo',
    password: 'password123',
    phone: '0700000002',
    label: 'Vendor Dashboard',
  },
  admin: {
    name: 'Demo Admin',
    email: 'admin@celebratelk.demo',
    password: 'password123',
    phone: '0700000003',
    label: 'Admin Dashboard',
  },
}

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [role, setRole] = useState<Role>('customer')
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await dispatch(
        login({
          email: String(form.get('email')),
          password: String(form.get('password')),
          role,
        }),
      ).unwrap()
      navigate(returnTo)
    } catch (error) {
      const message = (error as { message?: string }).message ?? 'Login failed'
      toast.error(message)
    }
  }

  const signInAsRole = async (selectedRole: Role) => {
    const account = demoAccounts[selectedRole]
    setRole(selectedRole)

    try {
      await api.post('/auth/register', {
        name: account.name,
        email: account.email,
        phone: account.phone,
        password: account.password,
        role: selectedRole,
      })
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status
      if (status !== 409) {
        const message =
          (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ??
          (error as { message?: string }).message ??
          'Unable to prepare demo account'
        toast.error(message)
        return
      }
    }

    try {
      await dispatch(login({ email: account.email, password: account.password, role: selectedRole })).unwrap()
      navigate(returnTo)
    } catch (error) {
      toast.error((error as { message?: string }).message ?? 'Login failed')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf0ff] text-[#1d0d2a]">
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#e9b8ff]/60 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#f7d77d]/40 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-7">
        <Link to="/" className="font-serif text-2xl font-bold">
          Celebrate<span className="text-[#a855f7]">LK</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-[#6d28d9]">
          Back to home
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-8 px-5 pb-12 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_28px_80px_rgba(88,28,135,0.18)]">
            <img
              src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=86"
              alt="Luxury event celebration"
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-b-[1.5rem] bg-gradient-to-t from-[#1c1028]/88 to-transparent p-7 pt-24 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-bold backdrop-blur">
                <Sparkles size={15} className="text-[#f3ca68]" />
                Premium Sri Lankan Events
              </span>
              <h1 className="mt-5 max-w-lg font-serif text-5xl font-bold leading-tight">
                Life is an event. Make it memorable.
              </h1>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <FeaturePill icon={<BadgeCheck size={17} />} label="Verified vendors" />
                <FeaturePill icon={<CalendarCheck size={17} />} label="Easy booking" />
                <FeaturePill icon={<LockKeyhole size={17} />} label="Secure pay" />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-[2rem] border border-white/70 bg-white/86 p-6 shadow-[0_24px_70px_rgba(88,28,135,0.14)] backdrop-blur-xl sm:p-8">
          <p className="text-sm font-bold text-[#a855f7]">Welcome back</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Login to CelebrateLK</h2>
          <p className="mt-3 text-sm leading-6 text-[#725d7c]">
            Sign in to create events, book vendors, manage payments or review admin approvals.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {(Object.keys(demoAccounts) as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void signInAsRole(item)}
                disabled={loading}
                className={`rounded-2xl border p-4 text-left transition ${
                  role === item
                    ? 'border-[#a855f7] bg-[#f4e8ff] text-[#4c137c] shadow-[0_12px_30px_rgba(168,85,247,0.14)]'
                    : 'border-[#ead9f6] bg-white/80 text-[#5f4d68] hover:border-[#c084fc]'
                }`}
              >
                <span className="block text-sm font-bold capitalize">{item}</span>
                <span className="mt-1 block text-[11px] font-semibold text-current/65">{demoAccounts[item].label}</span>
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              Email
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#ead9f6] bg-white px-4 focus-within:border-[#a855f7]">
                <Mail size={18} className="text-[#a855f7]" />
                <input
                  name="email"
                  type="email"
                  defaultValue={demoAccounts.customer.email}
                  placeholder="you@example.com"
                  required
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9f91a8]"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Password
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#ead9f6] bg-white px-4 focus-within:border-[#a855f7]">
                <LockKeyhole size={18} className="text-[#a855f7]" />
                <input
                  name="password"
                  type="password"
                  defaultValue={demoAccounts.customer.password}
                  placeholder="Your password"
                  required
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9f91a8]"
                />
                <Eye size={17} className="text-[#9f91a8]" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="min-h-12 rounded-2xl border border-[#ead9f6] bg-white px-4 text-sm font-semibold outline-none focus:border-[#a855f7]"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button disabled={loading} icon={<ArrowRight size={18} />} className="mt-2 rounded-2xl bg-[#a855f7] text-white hover:bg-[#9333ea]">
              {loading ? 'Signing in...' : 'Sign in securely'}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#725d7c]">
            New to CelebrateLK? <Link to="/register" className="font-bold text-[#a855f7]">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white/14 px-3 text-center text-xs font-bold backdrop-blur">
      {icon}
      {label}
    </span>
  )
}
