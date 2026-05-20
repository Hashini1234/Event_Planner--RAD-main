import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
}

export function Button({
  className,
  variant = 'primary',
  icon,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 dark:bg-gold-300 dark:text-charcoal-900',
    secondary:
      'border border-gold-300 bg-white/70 text-charcoal-900 hover:bg-gold-100 dark:bg-white/10 dark:text-ivory-50',
    ghost: 'text-charcoal-800 hover:bg-charcoal-900/5 dark:text-ivory-100 dark:hover:bg-white/10',
  }

  return (
    <button
      className={twMerge(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
