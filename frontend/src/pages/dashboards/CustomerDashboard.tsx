import { CalendarDays, CreditCard, Sparkles, Users } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { StatCard } from '../../components/ui/StatCard'
import { bookings, events, expenseBreakdown, vendors } from '../../utils/mockData'
import { formatLKR } from '../../utils/currency'

export function CustomerDashboard() {
  const event = events[0]
  const eventTitle = event.eventTitle ?? event.title ?? 'Upcoming event'
  const spent = event.spent ?? 0
  const guestCount = event.guestCount ?? event.guests ?? 0
  const colors = ['#c59b3b', '#d85b74', '#1f8a70', '#8d681f', '#96384c']

  return (
    <section className="section-shell py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Customer dashboard</p>
          <h1 className="font-display text-4xl font-bold">Plan every detail with confidence</h1>
        </div>
        <p className="max-w-xl text-sm text-charcoal-800/68 dark:text-ivory-100/68">
          Track budget, vendor bookings, guest movement, RSVP responses and AI generated planning actions in one place.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active event" value={eventTitle} trend="64% planning completed" icon={<CalendarDays size={20} />} />
        <StatCard label="Budget remaining" value={formatLKR(event.budget - spent)} trend="AI recommends keeping 12% contingency" icon={<CreditCard size={20} />} />
        <StatCard label="Guests invited" value={`${guestCount}`} trend="182 confirmed RSVPs" icon={<Users size={20} />} />
        <StatCard label="Smart actions" value="18" trend="6 high priority tasks this week" icon={<Sparkles size={20} />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Budget breakdown</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
                  {expenseBreakdown.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatLKR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Booking pipeline</h2>
          <div className="mt-4 grid gap-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-md border border-gold-100 bg-white/65 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{booking.vendorName}</p>
                    <p className="text-sm text-charcoal-800/60 dark:text-ivory-100/60">{booking.eventTitle}</p>
                  </div>
                  <span className="rounded-md bg-gold-100 px-2 py-1 text-xs font-bold capitalize text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
                    {booking.status}
                  </span>
                </div>
                <p className="mt-3 text-sm">{formatLKR(booking.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {vendors.map((vendor) => (
          <article key={vendor.id} className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-charcoal-800">
            <img src={vendor.image} alt={vendor.name} className="h-44 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gold-700 dark:text-gold-300">{vendor.category}</p>
              <h3 className="mt-1 font-bold">{vendor.name}</h3>
              <p className="mt-2 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
                {vendor.rating} rating from {vendor.reviews} reviews
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
