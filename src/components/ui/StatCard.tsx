import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  trend: string
  icon: ReactNode
}

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-charcoal-800/65 dark:text-ivory-100/65">{label}</p>
          <p className="mt-2 text-2xl font-bold text-charcoal-900 dark:text-ivory-50">{value}</p>
        </div>
        <div className="rounded-md bg-gold-100 p-3 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-emerald-700 dark:text-emerald-500">{trend}</p>
    </div>
  )
}
