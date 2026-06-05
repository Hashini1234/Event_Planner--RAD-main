import {
  Banknote,
  Bell,
  CalendarCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Settings,
  Store,
  X,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../../components/ui/Button'
import { logout } from '../../features/auth/authSlice'
import { useAppDispatch } from '../../hooks/redux'
import { formatLKR } from '../../utils/currency'

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: Store },
  { label: 'Packages', icon: PackagePlus },
  { label: 'Bookings', icon: CalendarCheck },
  { label: 'Schedule', icon: CalendarClock },
  { label: 'Payments', icon: CreditCard },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
]

const bookingRequests = [
  {
    id: 'b1',
    customer: 'Amani Perera',
    eventType: 'Wedding',
    eventDate: '2026-08-16',
    packageName: 'Signature Wedding Story',
    status: 'Pending',
    amount: 420000,
  },
  {
    id: 'b2',
    customer: 'Nethmi Fernando',
    eventType: 'Engagement',
    eventDate: '2026-07-22',
    packageName: 'Engagement Editorial',
    status: 'Accepted',
    amount: 185000,
  },
  {
    id: 'b3',
    customer: 'Wijaya Holdings',
    eventType: 'Corporate Gala',
    eventDate: '2026-07-04',
    packageName: 'Corporate Gala Coverage',
    status: 'Completed',
    amount: 260000,
  },
]

const servicePackages = [
  { id: 'p1', name: 'Signature Wedding Story', category: 'Photography', price: 420000, status: 'Active' },
  { id: 'p2', name: 'Engagement Editorial', category: 'Pre-shoot', price: 185000, status: 'Active' },
  { id: 'p3', name: 'Corporate Gala Coverage', category: 'Corporate Events', price: 260000, status: 'Draft' },
]

const schedule = [
  { day: '04', month: 'Jul', title: 'Annual Gala', status: 'Booked', time: '5:30 PM' },
  { day: '12', month: 'Jul', title: 'Open vendor slot', status: 'Available', time: 'All day' },
  { day: '16', month: 'Aug', title: 'Amani & Nuwan Wedding', status: 'Booked', time: '8:00 AM' },
  { day: '21', month: 'Aug', title: 'Studio maintenance', status: 'Unavailable', time: 'All day' },
]

const payments = [
  { id: 'pay1', customer: 'Amani Perera', amount: 210000, status: 'Received', date: '2026-05-18' },
  { id: 'pay2', customer: 'Nethmi Fernando', amount: 92500, status: 'Pending', date: '2026-06-10' },
  { id: 'pay3', customer: 'Wijaya Holdings', amount: 260000, status: 'Received', date: '2026-06-01' },
]

const notifications = [
  { title: 'New booking request', message: 'Amani requested Signature Wedding Story.', time: '12 min ago' },
  { title: 'Payment received', message: 'Wijaya Holdings paid LKR 260,000.', time: '2 hours ago' },
  { title: 'Event reminder', message: 'Annual Gala coverage starts tomorrow.', time: 'Today' },
]

const revenueData = [
  { month: 'Jan', revenue: 620000 },
  { month: 'Feb', revenue: 740000 },
  { month: 'Mar', revenue: 680000 },
  { month: 'Apr', revenue: 920000 },
  { month: 'May', revenue: 1260000 },
  { month: 'Jun', revenue: 1380000 },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300',
    Accepted: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-500',
    Completed: 'bg-charcoal-900 text-ivory-50 dark:bg-ivory-100 dark:text-charcoal-900',
    Rejected: 'bg-blush-100 text-blush-700 dark:bg-blush-700/20 dark:text-blush-300',
    Active: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-500',
    Draft: 'bg-white text-charcoal-800 dark:bg-white/10 dark:text-ivory-100',
    Booked: 'bg-charcoal-900 text-ivory-50 dark:bg-gold-300 dark:text-charcoal-900',
    Available: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-500',
    Unavailable: 'bg-blush-100 text-blush-700 dark:bg-blush-700/20 dark:text-blush-300',
    Received: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-500',
  }

  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${styles[status] ?? styles.Pending}`}>{status}</span>
}

function OverviewCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string
  value: string
  helper: string
  icon: typeof LayoutDashboard
}) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-charcoal-800/65 dark:text-ivory-100/65">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-md bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-xs font-medium text-emerald-700 dark:text-emerald-500">{helper}</p>
    </div>
  )
}

export function VendorDashboard() {
  const dispatch = useAppDispatch()
  const acceptedBookings = bookingRequests.filter((booking) => booking.status === 'Accepted').length
  const pendingRequests = bookingRequests.filter((booking) => booking.status === 'Pending').length
  const receivedPayments = payments.filter((payment) => payment.status === 'Received').reduce((sum, payment) => sum + payment.amount, 0)
  const pendingPayments = payments.filter((payment) => payment.status === 'Pending').reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <section className="section-shell py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Vendor dashboard</p>
          <h1 className="font-display text-4xl font-bold">Manage bookings, packages and revenue</h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-charcoal-800/68 dark:text-ivory-100/68">
          A luxury wedding vendor workspace for service packages, booking requests, availability, payments and client notifications.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-lg p-4 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
              alt="Ceylon Aura Photography"
              className="h-32 w-full object-cover"
            />
          </div>
          <div className="mb-4 px-2">
            <p className="font-bold">Ceylon Aura Photography</p>
            <p className="mt-1 text-sm text-charcoal-800/60 dark:text-ivory-100/60">Verified wedding vendor</p>
          </div>
          <nav className="grid gap-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon
              const active = index === 0
              return (
                <a
                  key={item.label}
                  href={`#vendor-${item.label.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-charcoal-900 text-ivory-50 dark:bg-gold-300 dark:text-charcoal-900'
                      : 'text-charcoal-800/75 hover:bg-white/70 dark:text-ivory-100/75 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  {active && <ChevronRight size={16} />}
                </a>
              )
            })}
            <button
              onClick={() => dispatch(logout())}
              className="mt-2 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-blush-700 hover:bg-blush-100 dark:text-blush-300 dark:hover:bg-blush-700/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        <main className="grid min-w-0 gap-6">
          <section id="vendor-dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <OverviewCard label="Total Bookings" value={`${bookingRequests.length}`} helper="All current requests" icon={CalendarCheck} />
            <OverviewCard label="Pending Requests" value={`${pendingRequests}`} helper="Awaiting response" icon={Clock} />
            <OverviewCard label="Accepted Bookings" value={`${acceptedBookings}`} helper="Confirmed events" icon={Check} />
            <OverviewCard label="Monthly Revenue" value={formatLKR(receivedPayments)} helper="+18% from last month" icon={Banknote} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div id="vendor-bookings" className="glass-panel rounded-lg p-6">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold">Recent Booking Requests</h2>
                  <p className="mt-1 text-sm text-charcoal-800/60 dark:text-ivory-100/60">Accept, reject and track booking status.</p>
                </div>
                <Button variant="secondary">View Bookings</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="text-charcoal-800/60 dark:text-ivory-100/60">
                    <tr>
                      <th className="py-3">Customer</th>
                      <th>Event Type</th>
                      <th>Event Date</th>
                      <th>Package</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRequests.map((booking) => (
                      <tr key={booking.id} className="border-t border-gold-100 dark:border-white/10">
                        <td className="py-3 font-medium">{booking.customer}</td>
                        <td>{booking.eventType}</td>
                        <td>{booking.eventDate}</td>
                        <td>{booking.packageName}</td>
                        <td><StatusBadge status={booking.status} /></td>
                        <td>
                          <div className="flex gap-2">
                            <Button className="min-h-9 px-3 py-1" icon={<Check size={15} />}>Accept</Button>
                            <Button variant="ghost" className="min-h-9 px-3 py-1 text-blush-700" icon={<X size={15} />}>Reject</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-xl font-bold">Revenue Trend</h2>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ead9b5" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatLKR(Number(value))} />
                    <Bar dataKey="revenue" fill="#c59b3b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section id="vendor-packages" className="glass-panel rounded-lg p-6">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Service Packages Summary</h2>
                <p className="mt-1 text-sm text-charcoal-800/60 dark:text-ivory-100/60">
                  Total packages: {servicePackages.length} | Active packages: {servicePackages.filter((item) => item.status === 'Active').length}
                </p>
              </div>
              <Button icon={<PackagePlus size={18} />}>Add Package</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {servicePackages.map((item) => (
                <article key={item.id} className="rounded-lg border border-gold-100 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-gold-700 dark:text-gold-300">{item.category}</p>
                      <h3 className="mt-1 font-bold">{item.name}</h3>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-4 text-xl font-bold">{formatLKR(item.price)}</p>
                  <Button variant="secondary" className="mt-4 min-h-9 w-full px-3 py-1" icon={<Edit3 size={15} />}>Edit Package</Button>
                </article>
              ))}
            </div>
          </section>

          <section id="vendor-schedule" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-xl font-bold">Calendar</h2>
              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className="font-semibold text-charcoal-800/60 dark:text-ivory-100/60">{day}</span>
                ))}
                {Array.from({ length: 35 }, (_, index) => {
                  const day = index + 1
                  const booked = [4, 16].includes(day)
                  const unavailable = [21, 22].includes(day)
                  return (
                    <span
                      key={day}
                      className={`grid aspect-square place-items-center rounded-md font-semibold ${
                        booked
                          ? 'bg-charcoal-900 text-white dark:bg-gold-300 dark:text-charcoal-900'
                          : unavailable
                            ? 'bg-blush-100 text-blush-700 dark:bg-blush-700/20 dark:text-blush-300'
                            : 'bg-white/70 dark:bg-white/5'
                      }`}
                    >
                      {day}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="glass-panel rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Schedule</h2>
                <Button variant="secondary">Update Schedule</Button>
              </div>
              <div className="grid gap-3">
                {schedule.map((item) => (
                  <div key={`${item.month}-${item.day}`} className="flex items-center gap-4 rounded-lg bg-white/65 p-4 dark:bg-white/5">
                    <div className="grid size-14 place-items-center rounded-md bg-gold-100 text-center text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
                      <span>
                        <span className="block text-lg font-bold leading-none">{item.day}</span>
                        <span className="text-xs">{item.month}</span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-charcoal-800/60 dark:text-ivory-100/60">{item.time}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="vendor-payments" className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <OverviewCard label="Received Payments" value={formatLKR(receivedPayments)} helper="Cleared payments" icon={Banknote} />
              <OverviewCard label="Pending Payments" value={formatLKR(pendingPayments)} helper="Awaiting clients" icon={Clock} />
            </div>
            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-xl font-bold">Payment History</h2>
              <div className="mt-4 grid gap-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between gap-4 rounded-lg bg-white/65 p-4 dark:bg-white/5">
                    <div>
                      <p className="font-semibold">{payment.customer}</p>
                      <p className="text-sm text-charcoal-800/60 dark:text-ivory-100/60">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatLKR(payment.amount)}</p>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <div id="vendor-notifications" className="glass-panel rounded-lg p-6">
              <h2 className="text-xl font-bold">Notifications</h2>
              <div className="mt-4 grid gap-3">
                {notifications.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-lg bg-white/65 p-4 dark:bg-white/5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
                      <Bell size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold">{item.title}</p>
                      <p className="mt-1 text-sm text-charcoal-800/65 dark:text-ivory-100/65">{item.message}</p>
                      <p className="mt-2 text-xs font-medium text-charcoal-800/50 dark:text-ivory-100/50">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                {[
                  ['Add Package', PackagePlus],
                  ['View Bookings', CalendarCheck],
                  ['Update Schedule', CalendarClock],
                  ['Edit Profile', Store],
                ].map(([label, Icon]) => (
                  <button
                    key={String(label)}
                    className="flex items-center justify-between rounded-lg bg-white/65 p-4 text-left font-semibold transition hover:bg-gold-100 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {String(label)}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}
