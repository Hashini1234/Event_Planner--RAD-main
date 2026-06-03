import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { api } from '../services/api'

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(9, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'vendor', 'admin']),
})

type RegisterValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await api.post('/auth/register', values)
      toast.success('Account created. Please verify your email.')
      navigate('/login')
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Registration failed'
      toast.error(message)
    }
  }

  return (
    <main className="min-h-screen bg-ivory-100 px-4 py-10 dark:bg-charcoal-900">
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel mx-auto w-full max-w-xl rounded-lg p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md bg-gold-100 text-gold-700">
            <Sparkles />
          </span>
          <div>
            <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">CelebrateLK</p>
            <h1 className="font-display text-3xl font-bold">Create your account</h1>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {[
            ['name', 'Full Name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone Number', 'tel'],
            ['password', 'Password', 'password'],
          ].map(([name, label, type]) => (
            <label key={name} className="grid gap-2 text-sm font-medium">
              {label}
              <input
                {...register(name as keyof RegisterValues)}
                type={type}
                className="rounded-md border border-gold-100 bg-white px-3 py-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
              />
              {errors[name as keyof RegisterValues]?.message && (
                <span className="text-xs font-semibold text-blush-700">
                  {String(errors[name as keyof RegisterValues]?.message)}
                </span>
              )}
            </label>
          ))}
          <label className="grid gap-2 text-sm font-medium">
            Account Type
            <select
              {...register('role')}
              className="rounded-md border border-gold-100 bg-white px-3 py-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <Button disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Register'}</Button>
        </div>
        <p className="mt-5 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
          Already registered? <Link to="/login" className="font-semibold text-gold-700">Sign in</Link>
        </p>
      </form>
    </main>
  )
}
