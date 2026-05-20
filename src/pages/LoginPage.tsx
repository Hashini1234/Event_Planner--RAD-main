import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { login } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import type { Role } from '../types/domain'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [role, setRole] = useState<Role>('customer')

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await dispatch(
      login({
        email: String(form.get('email')),
        password: String(form.get('password')),
        role,
      }),
    ).unwrap()
    navigate('/dashboard')
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
            Use any email ending in @demo for instant demo access.
          </p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                defaultValue="customer@demo"
                className="rounded-md border border-gold-100 bg-white px-3 py-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                defaultValue="password"
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
        </form>
      </section>
    </main>
  )
}
