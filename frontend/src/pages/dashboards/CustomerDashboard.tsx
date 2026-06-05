import {
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { events } from '../../utils/mockData'
import { formatLKR } from '../../utils/currency'

const tasks = [
  ['Confirm catering menu with vendor', '12 May 2026'],
  ['Send final RSVP reminder', '15 May 2026'],
  ['Review and approve decoration plan', '18 May 2026'],
  ['Make payment for photography', '20 May 2026'],
  ['Final walkthrough of the venue', '25 May 2026'],
]

const metrics = [
  {
    label: 'Active Event',
    value: 'Amani & Nuwan Wedding',
    note: '64% planning completed',
    icon: CalendarDays,
    progress: true,
  },
  {
    label: 'Budget Remaining',
    value: 'LKR 2,020,000',
    note: 'AI recommends keeping 12% contingency',
    icon: CreditCard,
  },
  {
    label: 'Guests Invited',
    value: '245',
    note: '182 confirmed RSVPs',
    icon: Users,
  },
  {
    label: 'Smart Actions',
    value: '18',
    note: '6 high priority tasks this week',
    icon: Sparkles,
  },
]

export function CustomerDashboard() {
  const event = events[0]
  const budgetRemaining = formatLKR((event.budget ?? 0) - (event.spent ?? 0))

  return (
    <section className="px-4 py-6 text-ivory-50 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="flex min-h-[260px] flex-col justify-center">
          <p className="text-sm font-medium text-gold-100">Welcome back, Amali!</p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl font-bold leading-tight">
            Plan every detail with <span className="text-gold-300">confidence</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ivory-50/78">
            Track budget, vendor bookings, guest movement, RSVP responses and AI generated planning
            actions in one place.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=84"
            alt="Elegant candlelit wedding table"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/76 to-charcoal-900/18" />
          <div className="relative flex min-h-[260px] max-w-md flex-col justify-center p-8">
            <p className="text-4xl font-bold text-gold-300">“</p>
            <p className="mt-2 text-xl font-bold leading-9">
              The best moments are planned with heart, and celebrated with love.
            </p>
            <p className="mt-6 font-display text-xl italic text-gold-300">Celebrate Beautifully</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article key={metric.label} className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft backdrop-blur">
              <div className="flex items-center gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold-300/14 text-gold-300">
                  <Icon size={24} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ivory-50/62">{metric.label}</p>
                  <p className="mt-2 truncate text-2xl font-bold">{metric.label === 'Budget Remaining' ? budgetRemaining : metric.value}</p>
                </div>
              </div>
              {metric.progress && (
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full w-[64%] rounded-full bg-gold-300" />
                </div>
              )}
              <p className="mt-4 text-sm font-medium text-emerald-300">{metric.note}</p>
            </article>
          )
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Upcoming Tasks</h2>
            <Button variant="secondary" className="min-h-9 border-white/10 bg-gold-300/14 px-3 text-xs text-ivory-50 hover:bg-gold-300/20">
              View All
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {tasks.map(([title, date]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-md bg-white/5 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-5 w-5 rounded-full border border-white/25" />
                  <span className="truncate text-sm text-ivory-50/82">{title}</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-charcoal-900/60 px-2 py-1 text-xs text-ivory-50/62">
                  <Clock3 size={13} />
                  {date}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <Button variant="secondary" className="min-h-9 border-white/10 bg-gold-300/14 px-3 text-xs text-ivory-50 hover:bg-gold-300/20">
              View All
            </Button>
          </div>
          <div className="mt-5 rounded-lg border border-white/8 bg-charcoal-900/28 p-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=82"
                alt={event.eventTitle}
                className="h-36 w-full rounded-md object-cover sm:w-36"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold">{event.eventTitle}</h3>
                  <span className="rounded-md bg-gold-300/14 px-2 py-1 text-xs font-semibold text-gold-300">In Progress</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-ivory-50/72">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} /> 28th June 2026
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> Galle Face Hotel, Colombo
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={16} /> 250 Guests
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 border-t border-white/8 pt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-emerald-300">64% Completed</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full w-[64%] rounded-full bg-gold-300" />
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-col gap-5 rounded-lg bg-ivory-50 p-6 text-charcoal-900 shadow-luxury md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold-500 text-white">
            <Sparkles size={30} />
          </span>
          <div>
            <h2 className="text-xl font-bold">Let AI handle the details</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal-800/72">
              Get smart recommendations, vendor suggestions and personalized planning help to make your event perfect.
            </p>
          </div>
        </div>
        <Link to="/ai-planner">
          <Button icon={<Sparkles size={18} />} className="bg-gold-500 px-6 text-white hover:bg-gold-700">
            Ask AI Planner
          </Button>
        </Link>
      </div>
    </section>
  )
}
