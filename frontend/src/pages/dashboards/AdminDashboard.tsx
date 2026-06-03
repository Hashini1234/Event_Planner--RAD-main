import { Activity, BadgeCheck, ShieldAlert, Users } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { vendors } from '../../utils/mockData'

export function AdminDashboard() {
  return (
    <section className="section-shell py-8">
      <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Admin dashboard</p>
      <h1 className="font-display text-4xl font-bold">Operate trust, revenue and platform health</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value="12,486" trend="+742 this month" icon={<Users size={20} />} />
        <StatCard label="Vendors awaiting approval" value="27" trend="8 high confidence profiles" icon={<BadgeCheck size={20} />} />
        <StatCard label="Open complaints" value="9" trend="2 payment related" icon={<ShieldAlert size={20} />} />
        <StatCard label="System uptime" value="99.98%" trend="Socket cluster healthy" icon={<Activity size={20} />} />
      </div>
      <div className="mt-6 glass-panel rounded-lg p-6">
        <h2 className="text-xl font-bold">Vendor approval queue</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="rounded-md border border-gold-100 bg-white/65 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-semibold">{vendor.name}</p>
              <p className="text-sm text-charcoal-800/65 dark:text-ivory-100/65">{vendor.category} · {vendor.city}</p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Approve</button>
                <button className="rounded-md border border-gold-100 px-3 py-2 text-sm font-semibold">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
