import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Link, Navigate, useNavigate } from 'react-router-dom'
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
  const { user, loading } = useAppSelector((state) => state.auth)
  const [role, setRole] = useState<Role>('customer')

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
      navigate('/dashboard')
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
      navigate('/dashboard')
    } catch (error) {
      toast.error((error as { message?: string }).message ?? 'Login failed')
    }
  }

  return (
    <main className="grid min-h-screen bg-ivory-100 lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1300&q=80"
          alt="Luxury reception decor"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/45" />
      </section>
      <section className="flex items-center justify-center px-4 py-12 dark:bg-charcoal-900">
        <form onSubmit={onSubmit} className="glass-panel w-full max-w-md rounded-lg p-8">
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">CelebrateLK</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-charcoal-800/70 dark:text-ivory-100/70">
            Sign in with the role used when the account was created.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {(Object.keys(demoAccounts) as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void signInAsRole(item)}
                disabled={loading}
                className={`rounded-md border px-3 py-3 text-left text-sm font-semibold transition ${
                  role === item
                    ? 'border-gold-500 bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300'
                    : 'border-gold-100 bg-white/70 hover:bg-gold-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
              >
                <span className="block capitalize">{item}</span>
                <span className="mt-1 block text-xs font-medium text-charcoal-800/55 dark:text-ivory-100/55">
                  {demoAccounts[item].label}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                defaultValue={demoAccounts.customer.email}
                placeholder="you@example.com"
                required
                className="rounded-md border border-gold-100 bg-white px-3 py-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                defaultValue={demoAccounts.customer.password}
                placeholder="Your password"
                required
                className="rounded-md border border-gold-100 bg-white px-3 py-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="rounded-md border border-gold-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-charcoal-800"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button disabled={loading}>{loading ? 'Signing in...' : 'Sign in securely'}</Button>
          </div>
          <p className="mt-5 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
            New to CelebrateLK? <Link to="/register" className="font-semibold text-gold-700">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
