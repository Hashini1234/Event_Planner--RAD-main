import { BadgeCheck, CalendarClock, CreditCard, Star } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { bookings } from '../../utils/mockData'
import { formatLKR } from '../../utils/currency'

export function VendorDashboard() {
  return (
    <section className="section-shell py-8">
      <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Vendor dashboard</p>
      <h1 className="font-display text-4xl font-bold">Manage services, calendars and earnings</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending requests" value="12" trend="4 need response today" icon={<CalendarClock size={20} />} />
        <StatCard label="Monthly earnings" value={formatLKR(1260000)} trend="+18% from last month" icon={<CreditCard size={20} />} />
        <StatCard label="Average rating" value="4.9" trend="Top 3% in Photography" icon={<Star size={20} />} />
        <StatCard label="Profile status" value="Verified" trend="Admin approved" icon={<BadgeCheck size={20} />} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Service packages</h2>
          {['Essential Wedding Story', 'Premium Cinematic Suite', 'Corporate Coverage'].map((name, index) => (
            <div key={name} className="mt-4 rounded-md border border-gold-100 bg-white/65 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-semibold">{name}</p>
              <p className="mt-1 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
                {formatLKR([185000, 420000, 150000][index])} starting price
              </p>
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Booking requests</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-charcoal-800/60 dark:text-ivory-100/60">
                <tr>
                  <th className="py-3">Event</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gold-100 dark:border-white/10">
                    <td className="py-3 font-medium">{booking.eventTitle}</td>
                    <td>{formatLKR(booking.amount)}</td>
                    <td>{booking.date}</td>
                    <td className="capitalize">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
