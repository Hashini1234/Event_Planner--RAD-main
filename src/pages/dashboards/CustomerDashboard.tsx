import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  CreditCard,
  Gem,
  MapPin,
  Plus,
  Sparkles,
  Star,
  Store,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '../../components/ui/Button'
import { bookings, events, vendors } from '../../utils/mockData'
import { formatLKR } from '../../utils/currency'

const progressItems = [
  ['Event Created', true],
  ['Venue Booked', true],
  ['Photography Booked', true],
  ['Catering', false],
  ['Decoration', false],
  ['Invitations', false],
  ['Entertainment', false],
]

const upcomingTasks = [
  ['Confirm catering menu', 'Tomorrow', 'done'],
  ['Final RSVP reminder', '15 May 2026', 'warn'],
  ['Payment for decoration', '18 May 2026', 'warn'],
  ['Finalize seating arrangement', '20 May 2026', 'todo'],
  ['Send thank you cards', '28 May 2026', 'todo'],
]

const aiVendors = [
  {
    name: 'Galle Face Hotel',
    category: 'Venue',
    price: 450000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Royal Catering',
    category: 'Catering',
    price: 850000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'ABC Photography',
    category: 'Photography',
    price: 120000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Dream Decorators',
    category: 'Decoration',
    price: 250000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80',
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=84',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&w=500&q=84',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=84',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=84',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=500&q=84',
]

const budgetData = [
  { name: 'Venue', value: 45, color: '#7C3AED' },
  { name: 'Catering', value: 25, color: '#3B82F6' },
  { name: 'Photography', value: 15, color: '#FB923C' },
  { name: 'Decoration', value: 10, color: '#F43F5E' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
]

const rsvpData = [
  { name: 'Confirmed', value: 182, label: '182 (74%)', color: '#22C55E' },
  { name: 'Pending', value: 45, label: '45 (18%)', color: '#F59E0B' },
  { name: 'Declined', value: 18, label: '18 (8%)', color: '#F43F5E' },
]

const plannerDetails: Array<[string, string, LucideIcon]> = [
  ['Wedding', 'Event Type', Gem],
  ['Colombo', 'Location', MapPin],
  ['250 Guests', 'Guest Count', Users],
  ['LKR 2.5M', 'Budget', CreditCard],
]

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
}

export function CustomerDashboard() {
  const event = events[0]
  const totalBudget = 2500000
  const remaining = 120000

  const stats = [
    { label: 'My Events', value: '03', note: 'Active events', icon: CalendarDays, color: '#7C3AED', bg: '#F1E7FF' },
    { label: 'Budget Balance', value: formatLKR(remaining), note: 'Remaining budget', icon: Wallet, color: '#E11D6F', bg: '#FFE6F0' },
    { label: 'Booked Vendors', value: '08', note: 'Total booked', icon: BriefcaseBusiness, color: '#2563EB', bg: '#E9F0FF' },
    { label: 'Guest Count', value: String(event.guestCount), note: 'Total invited', icon: Users, color: '#22C55E', bg: '#E9FBEF' },
  ]

  return (
    <section className="px-4 py-4 text-[#171124] sm:px-6 lg:px-7">
      <div className="grid gap-4 2xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <motion.div
            {...cardMotion}
            className="relative min-h-[185px] overflow-hidden rounded-xl border border-[#ece6f5] bg-white p-8 shadow-[0_10px_30px_rgba(31,17,50,0.06)]"
          >
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=88"
              alt="Wedding reception"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />
            <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-[#ec4fa6]/20 to-transparent" />
            <div className="relative max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, <span className="text-[#a855f7]">Amali!</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-[#554a63]">Let's make your dream event unforgettable</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/events/new">
                  <Button icon={<Plus size={16} />} className="rounded-lg bg-[#6d28d9] px-7 text-white shadow-lg shadow-[#6d28d9]/20 hover:bg-[#5b21b6]">
                    Create New Event
                  </Button>
                </Link>
                <Link to="/ai-planner">
                  <Button icon={<Bot size={16} />} className="rounded-lg bg-gradient-to-r from-[#a21caf] to-[#fb5c7a] px-7 text-white shadow-lg shadow-[#db2777]/18">
                    AI Plan My Event
                  </Button>
                </Link>
                <Link to="/vendors">
                  <Button variant="secondary" icon={<Store size={16} />} className="rounded-lg border-[#e7dff0] bg-white px-7 text-[#171124] hover:bg-[#faf7ff]">
                    Find Vendors
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.article
                  key={stat.label}
                  {...cardMotion}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-xl border border-[#ece6f5] bg-white p-5 shadow-[0_10px_30px_rgba(31,17,50,0.06)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 place-items-center rounded-full" style={{ backgroundColor: stat.bg, color: stat.color }}>
                      <Icon size={27} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#554a63]">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs font-medium text-[#8a8195]">{stat.note}</p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.38fr_1fr]">
            <DashboardCard title="Event Progress">
              <p className="text-xs font-semibold text-[#554a63]">Overall Progress</p>
              <p className="mt-1 text-2xl font-bold">64%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ece6f5]">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 0.7 }}
                  className="block h-full rounded-full bg-gradient-to-r from-[#6d28d9] to-[#fb5c7a]"
                />
              </div>
              <div className="mt-5 space-y-3">
                {progressItems.map(([label, done]) => (
                  <div key={String(label)} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#382848]">{label}</span>
                    {done ? <CheckCircle2 size={17} className="text-[#22c55e]" /> : <Circle size={17} className="text-[#c7bfce]" />}
                  </div>
                ))}
              </div>
              <Link to="/events" className="mt-5 block">
                <button className="min-h-10 w-full rounded-lg border border-[#e7dff0] text-sm font-bold text-[#7c3aed]">
                  View All Tasks
                </button>
              </Link>
            </DashboardCard>

            <DashboardCard
              title="AI Event Planner"
              action={<span className="rounded-full bg-[#f1e7ff] px-3 py-1 text-xs font-bold text-[#7c3aed]">Smart Recommendations</span>}
            >
              <div className="grid gap-3 md:grid-cols-4">
                {plannerDetails.map(([value, label, Icon]) => (
                  <div key={String(label)} className="flex items-center gap-3 rounded-lg border border-[#e7dff0] bg-[#faf8ff] p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1e7ff] text-[#7c3aed]">
                      <Icon size={15} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{value}</span>
                      <span className="block text-xs text-[#8a8195]">{label}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <h3 className="text-sm font-bold">AI Recommendations for You</h3>
                <Link to="/ai-planner" className="text-xs font-bold text-[#a855f7]">View All</Link>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {aiVendors.map((vendor) => (
                  <article key={vendor.name} className="overflow-hidden rounded-lg border border-[#e7dff0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <img src={vendor.image} alt={vendor.name} className="h-24 w-full object-cover" />
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{vendor.name}</p>
                          <p className="text-xs text-[#8a8195]">{vendor.category}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f59e0b]">
                          <Star size={12} className="fill-[#f59e0b]" /> {vendor.rating}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-[#554a63]">{formatLKR(vendor.price)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <Link to="/ai-planner" className="mt-4 block">
                <button className="min-h-10 w-full rounded-lg bg-gradient-to-r from-[#6d28d9] to-[#fb5c7a] text-sm font-bold text-white">
                  Regenerate Recommendations <Sparkles size={14} className="ml-1 inline" />
                </button>
              </Link>
            </DashboardCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr_0.9fr]">
            <DashboardCard title="Budget Overview">
              <div className="grid gap-4 sm:grid-cols-[0.75fr_1fr_0.75fr]">
                <div className="space-y-3 text-sm">
                  <MetricLine label="Total Budget" value={formatLKR(totalBudget)} />
                  <MetricLine label="Spent" value={formatLKR(2380000)} />
                  <MetricLine label="Remaining" value={formatLKR(remaining)} success />
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetData} innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value">
                        {budgetData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Spent']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {budgetData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-2 font-medium text-[#554a63]">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/budget" className="mt-4 block">
                <button className="min-h-9 w-full rounded-lg border border-[#e7dff0] text-sm font-bold text-[#7c3aed]">
                  View Full Budget Report
                </button>
              </Link>
            </DashboardCard>

            <DashboardCard title="Upcoming Tasks" action={<Link to="/events" className="text-xs font-bold text-[#a855f7]">View All</Link>}>
              <div className="space-y-3">
                {upcomingTasks.map(([title, date, state]) => (
                  <div key={title} className="flex items-center justify-between gap-3 border-b border-[#f0ebf6] pb-2 text-sm last:border-b-0">
                    <span className="flex min-w-0 items-center gap-2">
                      {state === 'done' ? <CheckCircle2 size={16} className="text-[#22c55e]" /> : state === 'warn' ? <Clock3 size={16} className="text-[#f59e0b]" /> : <Circle size={16} className="text-[#c7bfce]" />}
                      <span className="truncate font-medium">{title}</span>
                    </span>
                    <span className={`shrink-0 text-xs font-bold ${state === 'done' ? 'text-[#22c55e]' : state === 'warn' ? 'text-[#f97316]' : 'text-[#8a8195]'}`}>
                      {date}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Inspiration Gallery" action={<Link to="/gallery" className="text-xs font-bold text-[#a855f7]">View All</Link>}>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((image, index) => (
                  <Link to="/gallery" key={image} className="group relative overflow-hidden rounded-lg">
                    <img src={image} alt={`Wedding inspiration ${index + 1}`} className="h-24 w-full object-cover transition duration-300 group-hover:scale-105" />
                    {index === gallery.length - 1 && (
                      <span className="absolute inset-0 grid place-items-center bg-black/55 text-sm font-bold text-white">
                        +12 More
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>

        <div className="space-y-4">
          <motion.article
            {...cardMotion}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#b02de2] to-[#4b22d6] p-6 text-white shadow-[0_16px_45px_rgba(109,40,217,0.22)]"
          >
            <div className="absolute -right-10 top-4 h-44 w-44 rounded-full border border-white/15" />
            <p className="text-sm font-semibold text-white/85">Upcoming Wedding</p>
            <h2 className="mt-2 text-2xl font-bold">Amani & Nuwan</h2>
            <p className="mt-1 text-sm text-white/80">Wedding Ceremony</p>
            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              {[
                ['24', 'Days'],
                ['08', 'Hours'],
                ['45', 'Mins'],
                ['30', 'Secs'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-white/12 px-2 py-3 backdrop-blur">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-[11px] font-semibold text-white/75">{label}</p>
                </div>
              ))}
            </div>
            <Link to="/events" className="mt-5 block">
              <button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-bold text-[#4b22d6]">
                View Event Details <ArrowRight size={16} />
              </button>
            </Link>
          </motion.article>

          <DashboardCard title="Guest Summary">
            <div className="grid items-center gap-4 sm:grid-cols-[150px_1fr]">
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={rsvpData} innerRadius={42} outerRadius={62} paddingAngle={2} dataKey="value">
                      {rsvpData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} guests`, 'RSVP']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {rsvpData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-[#554a63]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-[#8a8195]">Total Invited</p>
                <p className="font-bold">245 Guests</p>
              </div>
              <Link to="/guests">
                <button className="rounded-lg bg-[#6d28d9] px-4 py-2 text-xs font-bold text-white">Manage Guests</button>
              </Link>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Bookings" action={<Link to="/bookings" className="text-xs font-bold text-[#a855f7]">View All</Link>}>
            <div className="space-y-3">
              {[...bookings, ...bookings].slice(0, 4).map((booking, index) => {
                const vendor = vendors[index % vendors.length]
                const status = ['Confirmed', 'Pending', 'Paid', 'Confirmed'][index]
                return (
                  <div key={`${booking.id}-${index}`} className="flex items-center gap-3 border-b border-[#f0ebf6] pb-3 last:border-b-0">
                    <img src={vendor.image} alt={booking.vendorName} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{booking.vendorName}</p>
                      <p className="text-xs text-[#8a8195]">{vendor.category}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === 'Pending' ? 'bg-[#fff3df] text-[#f97316]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>
                      {status}
                    </span>
                  </div>
                )
              })}
            </div>
          </DashboardCard>
        </div>
      </div>
    </section>
  )
}

function DashboardCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <motion.article
      {...cardMotion}
      className="rounded-xl border border-[#ece6f5] bg-white p-5 shadow-[0_10px_30px_rgba(31,17,50,0.06)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </motion.article>
  )
}

function MetricLine({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div>
      <p className="text-[#8a8195]">{label}</p>
      <p className={`text-lg font-bold ${success ? 'text-[#22c55e]' : 'text-[#171124]'}`}>{value}</p>
    </div>
  )
}
