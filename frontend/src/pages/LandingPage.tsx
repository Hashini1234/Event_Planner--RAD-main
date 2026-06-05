import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Gem,
  Headphones,
  Home,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  PlayCircle,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WandSparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { vendors } from '../utils/mockData'

type Feature = {
  title: string
  copy: string
  icon: LucideIcon
}

const stats = [
  ['1000+', 'Happy Customers', Users],
  ['500+', 'Verified Vendors', ShieldCheck],
  ['4.9/5', 'Customer Rating', Star],
  ['24/7', 'Live Support', Headphones],
  ['5000+', 'Events Managed', CalendarCheck],
  ['100%', 'Secure Payments', LockKeyhole],
]

const features: Feature[] = [
  {
    title: 'AI Event Concierge',
    copy: 'Smart recommendations, budget planning and personalized checklists for every celebration.',
    icon: WandSparkles,
  },
  {
    title: 'Verified Marketplace',
    copy: 'Book trusted vendors with ratings, portfolios, transparent packages and availability.',
    icon: BadgeCheck,
  },
  {
    title: 'Smart Checklists',
    copy: 'Organize tasks, guest lists, schedules and budgets without losing the small details.',
    icon: ClipboardCheck,
  },
  {
    title: 'Bookings & RSVPs',
    copy: 'Confirm bookings, invite guests and track responses from one planning workspace.',
    icon: CalendarCheck,
  },
  {
    title: 'Secure Payments',
    copy: 'Send deposits, track balances and keep receipts safely attached to each event.',
    icon: CreditCard,
  },
  {
    title: 'Live Operations',
    copy: 'Get real-time updates, alerts and on-day support when the celebration is moving.',
    icon: Headphones,
  },
]

const steps = [
  ['01', 'Tell Us Your Plan', 'Share event details, style, budget and guest count.', Search],
  ['02', 'Get AI Matches', 'We suggest vendors and packages that fit your vision.', Sparkles],
  ['03', 'Shortlist & Customize', 'Compare, refine and finalize your preferred team.', ClipboardCheck],
  ['04', 'Book & Manage', 'Handle RSVPs, payments and schedules in one place.', CalendarCheck],
  ['05', 'Enjoy Your Event', 'Arrive calm while CelebrateLK keeps everyone aligned.', Gem],
]

const testimonials = [
  {
    quote: 'CelebrateLK made our wedding planning so easy and stress-free. The vendors were amazing and everything was perfectly organized.',
    name: 'Dilini Perera',
    city: 'Colombo',
  },
  {
    quote: 'A wonderful platform with everything we needed in one place. The AI recommendations saved us so much time and money.',
    name: 'Nadeesha Silva',
    city: 'Kandy',
  },
  {
    quote: 'From bookings to payments, everything was seamless. Highly recommended for any Sri Lankan event.',
    name: 'Kasun Fernando',
    city: 'Galle',
  },
]

export function LandingPage() {
  return (
    <main className="min-h-screen bg-ivory-100 text-charcoal-900">
      <section className="relative min-h-[720px] overflow-hidden lg:min-h-[760px]">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2200&q=88"
          alt="Elegant outdoor wedding reception with warm lights"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/88 via-charcoal-900/60 to-charcoal-900/20" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ivory-100 to-transparent" />

        <div className="section-shell relative z-10 flex min-h-[720px] flex-col py-6 lg:min-h-[760px]">
          <nav className="flex items-center justify-between gap-4 text-ivory-50">
            <Link to="/" className="leading-none">
              <span className="block font-display text-3xl font-bold">
                Celebrate<span className="text-gold-300">LK</span>
              </span>
              <span className="mt-1 block text-xs text-ivory-100/88">Plan. Celebrate. Cherish.</span>
            </Link>

            <div className="hidden items-center rounded-lg border border-white/10 bg-white/10 p-1 text-sm backdrop-blur-xl lg:flex">
              {['Home', 'Services', 'Vendors', 'Events', 'Pricing', 'About Us', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={index === 0 ? '#' : `#${item.toLowerCase().replaceAll(' ', '-')}`}
                  className={`flex min-h-10 items-center gap-2 rounded-md px-4 font-medium transition hover:bg-white/12 ${
                    index === 0 ? 'bg-white/12 text-gold-100' : 'text-ivory-50/86'
                  }`}
                >
                  {index === 0 && <Home size={16} />}
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="secondary"
                  icon={<Users size={17} />}
                  className="border-gold-300/50 bg-gold-300 text-charcoal-900 hover:bg-gold-100"
                >
                  Login
                </Button>
              </Link>
              <button
                aria-label="Open menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/18 bg-white/10 text-white backdrop-blur lg:hidden"
              >
                <Menu size={20} />
              </button>
            </div>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-1 items-center pb-28 pt-20"
          >
            <div className="max-w-3xl text-ivory-50">
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-white/20 bg-white/12 px-4 py-3 text-sm font-semibold backdrop-blur-xl">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold-300" />
                  Trusted Vendors
                </span>
                <span className="text-gold-300">.</span>
                <span>AI Planning</span>
                <span className="text-gold-300">.</span>
                <span>Secure Payments</span>
              </p>

              <h1 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Celebrate Every Moment <span className="text-gold-300">Beautifully</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-ivory-50/88 sm:text-lg">
                Plan weddings, engagements, birthdays, corporate events and more with verified vendors,
                smart planning tools and seamless bookings in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button icon={<ArrowRight size={18} />} className="bg-gold-300 px-6 text-charcoal-900 hover:bg-gold-100">
                    View Platform
                  </Button>
                </Link>
                <a href="#services">
                  <Button
                    variant="secondary"
                    icon={<PlayCircle size={18} />}
                    className="border-white/45 bg-charcoal-900/20 px-6 text-white backdrop-blur hover:bg-white/10"
                  >
                    Explore Services
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell relative z-20 -mt-24">
        <div className="grid overflow-hidden rounded-lg border border-white/70 bg-white/92 shadow-luxury backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-6">
          {stats.map(([value, label, Icon]) => (
            <div key={label as string} className="flex items-center gap-4 border-charcoal-900/10 p-5 lg:border-r last:lg:border-r-0">
              <Icon className="h-8 w-8 shrink-0 text-gold-500" />
              <div>
                <p className="text-2xl font-bold">{value as string}</p>
                <p className="text-xs font-medium text-charcoal-800/70">{label as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="section-shell py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold">Everything You Need to Plan Perfect Events</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-lg border border-charcoal-900/8 bg-white/78 p-5 text-center shadow-soft backdrop-blur"
            >
              <feature.icon className="mx-auto h-10 w-10 text-gold-500" />
              <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-3 text-xs leading-6 text-charcoal-800/68">{feature.copy}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold-700">
                Learn More <ArrowRight size={13} />
              </span>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="events" className="section-shell pb-16">
        <h2 className="text-center font-display text-3xl font-bold">How It Works</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          {steps.map(([number, title, copy, Icon]) => (
            <div key={number as string} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-ivory-200 bg-gold-500 text-white shadow-soft">
                <Icon size={26} />
              </div>
              <p className="mt-3 text-sm font-bold">{number as string}</p>
              <h3 className="mt-1 text-sm font-bold">{title as string}</h3>
              <p className="mx-auto mt-2 max-w-44 text-xs leading-5 text-charcoal-800/68">{copy as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="overflow-hidden rounded-lg bg-charcoal-900 text-ivory-50 shadow-luxury">
          <div className="grid items-center gap-8 p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold text-gold-300">Your All-in-One Event Management Platform</p>
              <h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-tight">
                Plan, Manage & Celebrate with <span className="text-gold-300">Ease</span>
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-ivory-50/82">
                {[
                  'Centralized dashboard for all your events',
                  'Real-time updates and AI recommendations',
                  'QR check-in, guest management and payment alerts',
                  'Reports, analytics and vendor performance insights',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/login" className="mt-7 inline-flex">
                <Button icon={<ArrowRight size={18} />} className="bg-gold-300 px-7 text-charcoal-900 hover:bg-gold-100">
                  View Dashboard
                </Button>
              </Link>
            </div>

            <div className="relative min-h-[330px]">
              <div className="absolute inset-x-0 bottom-0 h-44 rounded-full bg-gold-300/12 blur-3xl" />
              <div className="relative mx-auto max-w-2xl rounded-lg border border-white/18 bg-black p-3 shadow-2xl">
                <div className="rounded-md bg-[#11171b] p-4">
                  <div className="flex items-center justify-between border-b border-white/8 pb-3">
                    <span className="font-display text-lg font-bold">
                      Celebrate<span className="text-gold-300">LK</span>
                    </span>
                    <LayoutDashboard className="text-gold-300" size={20} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {[
                      ['Total Events', '24'],
                      ['Bookings', '128'],
                      ['Revenue', 'LKR 782,300'],
                      ['Pending', '12'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md bg-white/7 p-3">
                        <p className="text-[10px] text-ivory-50/55">{label}</p>
                        <p className="mt-1 text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-md bg-white/7 p-4">
                      <p className="text-xs font-semibold">Revenue Overview</p>
                      <div className="mt-6 flex h-28 items-end gap-3">
                        {[38, 58, 44, 72, 50, 83, 64].map((height, index) => (
                          <span
                            key={index}
                            className="flex-1 rounded-t bg-gradient-to-t from-gold-700 to-gold-300"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-white/7 p-4">
                      <p className="text-xs font-semibold">Bookings by Status</p>
                      <div className="mx-auto mt-5 h-24 w-24 rounded-full border-[18px] border-gold-300 border-r-emerald-500 border-t-blush-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vendors" className="section-shell pb-16">
        <h2 className="text-center font-display text-3xl font-bold">Trusted Vendors for Every Detail</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {vendors.map((vendor) => (
            <article key={vendor.id} className="overflow-hidden rounded-lg bg-white shadow-soft">
              <img src={vendor.image} alt={vendor.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gold-700">{vendor.category}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Star size={15} className="fill-gold-300 text-gold-500" />
                    {vendor.rating}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold">{vendor.name}</h3>
                <p className="mt-1 text-sm text-charcoal-800/65">{vendor.city}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16">
        <h2 className="text-center font-display text-3xl font-bold">Loved by Couples & Event Planners</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-lg border border-charcoal-900/8 bg-white p-6 shadow-soft">
              <Quote className="h-8 w-8 fill-gold-300 text-gold-300" />
              <p className="mt-4 text-sm leading-7 text-charcoal-800/76">{item.quote}</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-charcoal-800/60">{item.city}</p>
                </div>
                <div className="flex text-gold-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} className="fill-current" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="contact" className="bg-charcoal-900 text-ivory-50">
        <div className="section-shell grid gap-8 py-10 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <p className="font-display text-3xl font-bold">
              Celebrate<span className="text-gold-300">LK</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ivory-50/68">
              Sri Lanka's premium event management platform for every celebration.
            </p>
          </div>
          <FooterColumn title="Quick Links" links={['Home', 'Services', 'Vendors', 'Events', 'Pricing']} />
          <FooterColumn title="Company" links={['About Us', 'Careers', 'Blog', 'Privacy Policy']} />
          <FooterColumn title="Support" links={['Help Center', 'FAQs', 'Contact Us', 'Live Chat']} />
          <div>
            <h3 className="font-bold">Contact Us</h3>
            <div className="mt-4 space-y-3 text-sm text-ivory-50/72">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-gold-300" />
                hello@celebratelk.lk
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-gold-300" />
                Colombo, Sri Lanka
              </p>
              <div className="mt-4 flex rounded-md border border-white/10 bg-white/8 p-1">
                <input
                  aria-label="Email address"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-ivory-50/45"
                />
                <Button className="min-h-10 rounded-md bg-gold-300 px-3 text-charcoal-900 hover:bg-gold-100">
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-ivory-50/55">
          2026 CelebrateLK. All rights reserved.
        </div>
      </footer>
    </main>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-ivory-50/68">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-gold-300">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
