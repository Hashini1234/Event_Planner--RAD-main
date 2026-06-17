import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { bookings, vendors } from '../../utils/mockData'
import { formatLKR } from '../../utils/currency'

const quickActions = [
  {
    title: 'Create Event',
    text: 'Add your event details, date, venue idea, guests and budget.',
    icon: CalendarPlus,
    to: '/events/new',
    cta: 'Start planning',
    tone: 'from-[#7c3aed] to-[#ec4899]',
  },
  {
    title: 'Book Vendors',
    text: 'Find venues, caterers, photographers and decorators.',
    icon: Store,
    to: '/vendors',
    cta: 'Find vendors',
    tone: 'from-[#9f7aea] to-[#d4af37]',
  },
  {
    title: 'Admin Approval',
    text: 'Track which booking requests are pending or confirmed.',
    icon: ShieldCheck,
    to: '/bookings',
    cta: 'View bookings',
    tone: 'from-[#16a34a] to-[#7c3aed]',
  },
  {
    title: 'Payments',
    text: 'Pay only after your vendor booking is approved.',
    icon: CreditCard,
    to: '/payments',
    cta: 'Payment center',
    tone: 'from-[#d4af37] to-[#f97316]',
  },
]

const stats = [
  { label: 'Pending requests', value: '02', icon: Clock3, note: 'Waiting for admin', color: 'text-[#b45309] bg-[#fff7df]' },
  { label: 'Confirmed bookings', value: '01', icon: CheckCircle2, note: 'Ready to continue', color: 'text-[#16a34a] bg-[#dcfce7]' },
  { label: 'Payment due', value: formatLKR(185000), icon: CreditCard, note: 'After approval', color: 'text-[#7c3aed] bg-[#f1e7ff]' },
  { label: 'Guest capacity', value: '250', icon: Users, note: 'Plan estimate', color: 'text-[#2563eb] bg-[#e8f0ff]' },
]

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
}

export function CustomerDashboard() {
  return (
    <section className="px-4 py-5 text-[#171124] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <motion.article
            {...cardMotion}
            className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-[#ece6f5] bg-white p-8 shadow-[0_18px_55px_rgba(31,17,50,0.08)]"
          >
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=88"
              alt="Luxury wedding setup"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/20" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f4e8ff] px-4 py-2 text-xs font-bold text-[#7c3aed]">
                <Sparkles size={15} />
                Customer planning workspace
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
                Welcome back, Devindi
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f536d]">
                Create your event, book trusted vendors, and complete payments after admin confirmation.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/events/new">
                  <Button icon={<Plus size={17} />} className="rounded-xl bg-[#6d28d9] px-6 text-white hover:bg-[#5b21b6]">
                    Create Event
                  </Button>
                </Link>
                <Link to="/vendors">
                  <Button variant="secondary" icon={<Store size={17} />} className="rounded-xl border-[#e7dff0] bg-white px-6 text-[#171124]">
                    Find Vendors
                  </Button>
                </Link>
                <Link to="/payments">
                  <Button variant="ghost" icon={<CreditCard size={17} />} className="rounded-xl bg-white/82 px-6 text-[#4b1d7a]">
                    Payments
                  </Button>
                </Link>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...cardMotion}
            className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#a855f7] via-[#7c3aed] to-[#4c1d95] p-7 text-white shadow-[0_20px_55px_rgba(124,58,237,0.24)]"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/20" />
            <p className="text-sm font-bold text-white/80">Next step</p>
            <h2 className="mt-4 text-3xl font-bold">Book vendors for your event</h2>
            <p className="mt-3 text-sm leading-6 text-white/76">
              Choose packages, submit booking requests and wait for admin approval before paying.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {['Venue', 'Caterer', 'Photo'].map((item) => (
                <span key={item} className="rounded-2xl bg-white/12 px-3 py-4 text-center text-xs font-bold backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
            <Link to="/vendors" className="mt-7 inline-flex w-full">
              <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#6d28d9]">
                Open marketplace <ArrowRight size={17} />
              </button>
            </Link>
          </motion.article>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.label}
                {...cardMotion}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="rounded-[1.25rem] border border-[#ece6f5] bg-white p-5 shadow-[0_12px_35px_rgba(31,17,50,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl ${item.color}`}>
                    <Icon size={24} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#6b6078]">{item.label}</p>
                    <p className="mt-1 truncate text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold text-[#7c3aed]">{item.note}</p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {quickActions.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.title}
                {...cardMotion}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-[1.35rem] border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.06)]"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${step.tone} text-white shadow-lg`}>
                  <Icon size={24} />
                </span>
                <h2 className="mt-5 text-xl font-bold">{step.title}</h2>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[#6b6078]">{step.text}</p>
                <Link to={step.to} className="mt-5 inline-flex w-full">
                  <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e7dff0] text-sm font-bold text-[#6d28d9] transition hover:bg-[#faf7ff]">
                    {step.cta} <ArrowRight size={16} />
                  </button>
                </Link>
              </motion.article>
            )
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.article {...cardMotion} className="rounded-[1.35rem] border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            <h2 className="text-xl font-bold">Your planning flow</h2>
            <div className="mt-6 space-y-4">
              {['Create event details', 'Book vendors from marketplace', 'Admin approves booking', 'Complete payment'].map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${index < 2 ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f4e8ff] text-[#7c3aed]'}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 border-b border-[#f0ebf6] py-3">
                    <p className="font-bold">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article {...cardMotion} className="rounded-[1.35rem] border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Recent Vendor Requests</h2>
                <p className="mt-1 text-sm text-[#6b6078]">Only your booking requests appear here.</p>
              </div>
              <Link to="/bookings" className="text-sm font-bold text-[#7c3aed]">View Bookings</Link>
            </div>
            <div className="mt-5 grid gap-3">
              {bookings.slice(0, 3).map((booking, index) => {
                const vendor = vendors[index % vendors.length]
                const status = index === 0 ? 'accepted' : booking.status
                return (
                  <div key={booking.id} className="flex flex-col gap-3 rounded-2xl border border-[#f0ebf6] p-4 sm:flex-row sm:items-center">
                    <img src={vendor.image} alt={booking.vendorName} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{booking.vendorName}</p>
                      <p className="flex items-center gap-1 text-sm text-[#6b6078]">
                        <MapPin size={14} /> {vendor.category}
                      </p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${status === 'accepted' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fff7df] text-[#b45309]'}`}>
                      {status === 'accepted' ? 'Confirmed' : status}
                    </span>
                    {status === 'accepted' && (
                      <Link to="/payments">
                        <button className="min-h-10 rounded-xl bg-[#6d28d9] px-4 text-sm font-bold text-white">
                          Pay Now
                        </button>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
