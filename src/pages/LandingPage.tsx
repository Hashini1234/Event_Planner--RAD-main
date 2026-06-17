import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Globe,
  Headphones,
  Heart,
  Home,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PartyPopper,
  PlayCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { fetchEventPackages } from '../services/adminService'
import type { EventPackage } from '../types/domain'
import { formatLKR } from '../utils/currency'

const heroImage =
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=88'

const categories = [
  ['Birthday', 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=500&q=82'],
  ['Wedding', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=82'],
  ['Festival', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=82'],
  ['Meetings', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=82'],
  ['House Warming', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=82'],
]

const bestSelling: EventPackage[] = [
  {
    title: 'Birthday',
    category: 'Birthday',
    venue: 'Cinnamon Lakeside',
    location: 'Colombo',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=82',
    description: 'A colorful birthday package with decor, cake table setup, lights and vendor coordination.',
    inclusions: ['Decor setup', 'Cake table', 'Lighting', 'Vendor coordination'],
  },
  {
    title: 'Marriage',
    category: 'Wedding',
    venue: 'Galle Face Hotel',
    location: 'Colombo',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=82',
    description: 'Elegant wedding package with venue styling, floral entrance and premium vendor support.',
    inclusions: ['Venue styling', 'Floral setup', 'Photography support', 'Planning checklist'],
  },
  {
    title: 'House Warming',
    category: 'House Warming',
    venue: 'Colombo Garden Hall',
    location: 'Colombo',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=82',
    description: 'Warm and intimate house warming package with catering and decor recommendations.',
    inclusions: ['Simple decor', 'Catering guide', 'Guest setup', 'Music suggestions'],
  },
  {
    title: 'Baby Shower',
    category: 'Baby Shower',
    venue: 'Bloom Studio',
    location: 'Colombo',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=82',
    description: 'Soft pastel baby shower setup with dessert table, photo corner and decor vendors.',
    inclusions: ['Pastel decor', 'Dessert table', 'Photo corner', 'Invitation theme'],
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1496843916299-590492c751f4?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=500&q=82',
  'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=500&q=82',
]

const process = [
  ['Search', 'Find event services'],
  ['Book', 'Send booking requests'],
  ['Approve', 'Admin confirms bookings'],
  ['Pay', 'Secure payment'],
]

export function LandingPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<EventPackage[]>(bestSelling)
  const [selectedPackage, setSelectedPackage] = useState<EventPackage | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEventPackages()
        if (data.length) setPackages(data)
      } catch {
        setPackages(bestSelling)
      }
    }
    void load()
  }, [])

  const bookPackage = (item: EventPackage) => {
    sessionStorage.setItem('celebratelk.selectedPackage', JSON.stringify(item))
    navigate('/events/new')
  }

  return (
    <main className="min-h-screen bg-[#fbf4ff] text-[#180922]">
      <section className="relative min-h-screen overflow-hidden text-white">
        <img src={heroImage} alt="Luxury Sri Lankan celebration table" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/46 to-black/12" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#fbf4ff] via-[#fbf4ff]/60 to-transparent" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-8">
          <Link to="/" className="shrink-0">
            <span className="block font-serif text-3xl font-bold leading-none tracking-tight">
              Celebrate<span className="text-[#f3ca68]">LK</span>
            </span>
            <span className="mt-2 block text-sm font-medium text-white/88">Plan. Celebrate. Cherish.</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-xl border border-white/16 bg-[#5b4d43]/72 p-2 text-sm font-bold shadow-2xl backdrop-blur-xl lg:flex">
            {['Home', 'Services', 'Vendors', 'Events', 'Pricing', 'About Us', 'Contact'].map((item, index) => (
              <a
                key={item}
                href={index === 0 ? '#home' : `#${item.toLowerCase().replaceAll(' ', '-')}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-white/90 transition hover:bg-white/12 hover:text-white"
              >
                {index === 0 && <Home size={15} />}
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden min-h-12 items-center gap-2 rounded-lg bg-[#f1c85f] px-6 text-sm font-bold text-[#1d1308] shadow-[0_18px_40px_rgba(241,200,95,0.25)] transition hover:bg-[#ffd978] sm:inline-flex"
            >
              <Users size={17} />
              Login
            </Link>
            <button className="grid h-12 w-12 place-items-center rounded-lg border border-white/20 bg-white/12 backdrop-blur lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div id="home" className="relative z-10 mx-auto flex min-h-[calc(100vh-118px)] max-w-7xl flex-col justify-center px-5 pb-28 pt-10">
          <div className="inline-flex w-fit flex-wrap items-center gap-4 rounded-lg border border-white/22 bg-[#4d463d]/45 px-5 py-3 text-sm font-bold text-white/92 backdrop-blur">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#f3ca68]" /> Trusted Vendors</span>
            <span className="text-[#f3ca68]">.</span>
            <span>AI Planning</span>
            <span className="text-[#f3ca68]">.</span>
            <span>Secure Payments</span>
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-6xl font-bold leading-[0.92] tracking-tight md:text-8xl">
            Celebrate Every Moment <span className="block text-[#f3ca68]">Beautifully</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-white/92">
            Plan weddings, engagements, birthdays, corporate events and more with verified vendors, smart planning tools and seamless bookings in one place.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/login">
              <Button icon={<ArrowRight size={18} />} className="rounded-lg bg-[#f1c85f] px-7 text-[#1d1308] hover:bg-[#ffd978]">
                View Platform
              </Button>
            </Link>
            <a href="#services">
              <Button variant="secondary" icon={<PlayCircle size={18} />} className="rounded-lg border-white/30 bg-white/10 px-7 text-white hover:bg-white/20">
                Explore Services
              </Button>
            </a>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-lg border border-white/24 bg-white/16 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-6">
            <HeroStat icon={<Users size={30} />} value="1000+" label="Happy Customers" />
            <HeroStat icon={<BadgeCheck size={30} />} value="500+" label="Verified Vendors" />
            <HeroStat icon={<Star size={30} />} value="4.9/5" label="Customer Rating" />
            <HeroStat icon={<Headphones size={30} />} value="24/7" label="Live Support" />
            <HeroStat icon={<CalendarCheck size={30} />} value="5000+" label="Events Managed" />
            <HeroStat icon={<LockKeyhole size={30} />} value="100%" label="Secure Payments" />
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl font-bold">Categories</h2>
          <Link to="/login" className="rounded-full border border-[#d8b4fe] px-5 py-2 text-sm font-bold text-[#8b2df4]">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(([title, image]) => (
            <button
              type="button"
              key={title}
              onClick={() => setSelectedPackage(packages.find((item) => item.category === title) ?? bestSelling[0])}
              className="group relative h-28 overflow-hidden rounded-xl text-left shadow-[0_16px_35px_rgba(56,20,85,0.14)]"
            >
              <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-base font-bold text-white">{title}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="events" className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold">Best Selling</h2>
          <Link to="/login" className="text-sm font-bold text-[#a855f7]">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.slice(0, 4).map((item) => (
            <article key={item._id ?? item.id ?? item.title} className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_48px_rgba(88,28,135,0.12)]">
              <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-xl font-bold">{item.title}</h3>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#d97706]">
                    <Star size={15} fill="currentColor" /> 4.9
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-[#7b647f]">
                  <MapPin size={15} /> {item.venue}
                </p>
                <p className="mt-4 text-base font-bold text-[#a855f7]">{formatLKR(item.price)}</p>
                <button
                  type="button"
                  onClick={() => setSelectedPackage(item)}
                  className="mt-5 block min-h-11 w-full rounded-full bg-[#b95cff] px-4 text-center text-sm font-bold text-white transition hover:bg-[#9d38ef]"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about-us" className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(88,28,135,0.12)] md:grid-cols-[0.9fr_1.1fr]">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=84"
            alt="Happy event planning team"
            className="h-72 w-full rounded-[1.4rem] object-cover"
          />
          <div>
            <p className="text-sm font-bold text-[#a855f7]">About us</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">A creative planning studio for modern celebrations</h2>
            <p className="mt-4 text-sm leading-7 text-[#6d5875]">
              CelebrateLK brings customers, vendors and admins into one calm workspace. Customers create events,
              book trusted vendors and complete payments after confirmation, while our platform keeps everything organized.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['500+', 'Vendors'],
                ['2K+', 'Events'],
                ['4.9', 'Rating'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-[#fbf3ff] p-4">
                  <p className="text-2xl font-bold text-[#a855f7]">{value}</p>
                  <p className="text-xs font-semibold text-[#7b647f]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <h2 className="font-serif text-3xl font-bold">Our Process</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#6d5875]">
            Create the event, choose vendors, wait for confirmation and pay securely when everything is approved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {process.map(([title, copy], index) => (
            <div key={title} className="rounded-2xl border border-[#dfc7ef] bg-white p-5 text-center shadow-sm">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#f3d9ff] text-[#a855f7]">
                {index === 0 ? <Search size={18} /> : index === 1 ? <CalendarCheck size={18} /> : index === 2 ? <PartyPopper size={18} /> : <Heart size={18} />}
              </span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-1 text-xs text-[#7b647f]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="font-serif text-3xl font-bold">Gallery</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Event gallery ${index + 1}`}
              className="h-40 w-full rounded-2xl object-cover shadow-md"
            />
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="font-serif text-3xl font-bold">Testimonials</h2>
        <div className="mt-6 flex items-center gap-4">
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#a855f7] shadow">
            <ChevronLeft size={18} />
          </button>
          <article className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(88,28,135,0.12)]">
            <p className="text-sm leading-7 text-[#6d5875]">
              CelebrateLK made our wedding planning feel effortless. We found the venue, photographer and decor team in one place,
              then paid only after everything was confirmed.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Customer" className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="font-bold">Nethu Perera</p>
                <p className="text-xs text-[#7b647f]">Colombo</p>
              </div>
            </div>
          </article>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#a855f7] shadow">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <footer className="bg-[#241130] px-5 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-serif text-3xl font-bold">Celebrate<span className="text-[#f3ca68]">LK</span></p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">
              A beautiful Sri Lankan event planning platform for customers, vendors and admins.
            </p>
            <div className="mt-5 flex gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Globe size={16} /></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><MessageCircle size={16} /></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Users size={16} /></span>
            </div>
          </div>
          <FooterColumn title="Company" links={['Home', 'Services', 'Gallery', 'About Us']} />
          <FooterColumn title="Quick Links" links={['Login', 'Register', 'Find Vendors', 'Bookings']} />
          <div>
            <h3 className="font-bold">Contact Us</h3>
            <p className="mt-4 flex items-center gap-2 text-sm text-white/70"><Mail size={16} /> hello@celebratelk.lk</p>
            <div className="mt-4 flex rounded-full bg-white p-1">
              <input className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#281239] outline-none" placeholder="Email" />
              <button className="rounded-full bg-[#a855f7] px-4 py-2 text-xs font-bold">Send</button>
            </div>
          </div>
        </div>
      </footer>

      {selectedPackage && <PackageDetailsModal item={selectedPackage} onClose={() => setSelectedPackage(null)} onBook={bookPackage} />}
    </main>
  )
}

function HeroStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 border-white/20 p-6 lg:border-r last:lg:border-r-0">
      <span className="text-[#d4af37]">{icon}</span>
      <span>
        <span className="block text-2xl font-bold text-white">{value}</span>
        <span className="text-xs font-medium text-white/72">{label}</span>
      </span>
    </div>
  )
}

function PackageDetailsModal({ item, onClose, onBook }: { item: EventPackage; onClose: () => void; onBook: (item: EventPackage) => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#281239]/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.5rem]">
          <img src={item.image} alt={item.title} className="h-72 w-full object-cover" />
          <button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#281239]" aria-label="Close package details">
            <X size={18} />
          </button>
        </div>
        <div className="p-3">
          <p className="text-sm font-bold text-[#a855f7]">{item.category}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold">{item.title}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#7b647f]"><MapPin size={16} /> {item.venue}, {item.location}</p>
          <p className="mt-4 text-sm leading-7 text-[#6d5875]">{item.description ?? 'Beautiful event package with verified services and simple booking support.'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(item.inclusions?.length ? item.inclusions : ['Vendor coordination', 'Event setup', 'Booking support', 'Payment after approval']).map((inclusion) => (
              <span key={inclusion} className="rounded-2xl bg-[#fbf3ff] px-4 py-3 text-sm font-semibold text-[#5d2b72]">{inclusion}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-2xl font-bold text-[#a855f7]">{formatLKR(item.price)}</p>
            <Button className="rounded-full bg-[#a855f7] px-8 text-white hover:bg-[#9333ea]" onClick={() => onBook(item)}>Book This Package</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-white/65">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-white">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
