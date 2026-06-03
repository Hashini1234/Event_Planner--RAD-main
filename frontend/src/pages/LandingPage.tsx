import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { vendors } from '../utils/mockData'

export function LandingPage() {
  return (
    <main className="min-h-screen bg-ivory-100 text-charcoal-900 dark:bg-charcoal-900 dark:text-ivory-50">
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=82"
          alt="Elegant Sri Lankan wedding celebration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/82 via-charcoal-900/48 to-transparent" />
        <div className="section-shell relative flex min-h-[92vh] flex-col justify-between py-6">
          <nav className="flex items-center justify-between text-ivory-50">
            <Link to="/" className="font-display text-2xl font-bold">
              CelebrateLK
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="bg-white/15 text-white backdrop-blur">
                Sign in
              </Button>
            </Link>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl pb-12 pt-20 text-ivory-50"
          >
            <p className="mb-4 inline-flex rounded-md border border-gold-300/50 bg-white/10 px-3 py-1 text-sm backdrop-blur">
              Verified vendors, AI planning, bookings and payments for Sri Lanka
            </p>
            <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              CelebrateLK
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ivory-100/88">
              A premium event management platform for weddings, engagements,
              birthdays, corporate events and intimate celebrations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button icon={<ArrowRight size={18} />}>Open dashboard</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section-shell -mt-12 grid gap-4 pb-16 md:grid-cols-3">
        {[
          ['AI event concierge', Sparkles, 'Budget allocation, vendor picks and smart checklists.'],
          ['Secure marketplace', ShieldCheck, 'Verified vendors with reviews, calendars and packages.'],
          ['Live operations', CalendarCheck, 'Bookings, RSVP, QR check-in and payment notifications.'],
        ].map(([title, Icon, copy]) => (
          <div key={title as string} className="glass-panel rounded-lg p-6">
            <Icon className="text-gold-700" />
            <h2 className="mt-4 text-xl font-bold">{title as string}</h2>
            <p className="mt-2 text-sm text-charcoal-800/70 dark:text-ivory-100/70">{copy as string}</p>
          </div>
        ))}
      </section>
      <section className="section-shell pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {vendors.map((vendor) => (
            <article key={vendor.id} className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-charcoal-800">
              <img src={vendor.image} alt={vendor.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <p className="text-sm text-gold-700 dark:text-gold-300">{vendor.category}</p>
                <h3 className="mt-1 text-lg font-bold">{vendor.name}</h3>
                <p className="text-sm text-charcoal-800/65 dark:text-ivory-100/65">{vendor.city}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
