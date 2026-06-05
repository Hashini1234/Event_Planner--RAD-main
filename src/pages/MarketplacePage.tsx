import { CalendarCheck, MapPin, Search, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { bookVendor, fetchVendors } from '../services/customerService'
import type { Vendor } from '../types/domain'
import { formatLKR } from '../utils/currency'
import { vendors as demoVendors } from '../utils/mockData'

const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music / DJ', 'Makeup', 'Bridal Dressing', 'Hotels', 'Event Hall']
const locations = ['All', 'Colombo', 'Kandy', 'Galle', 'Gampaha', 'Kalutara']

function vendorId(vendor: Vendor) {
  return vendor._id ?? vendor.id
}

function vendorName(vendor: Vendor) {
  return vendor.vendorName ?? vendor.businessName ?? vendor.name
}

function vendorPrice(vendor: Vendor) {
  return vendor.pricing ?? vendor.startingPrice ?? vendor.packages?.[0]?.price ?? 0
}

function vendorRating(vendor: Vendor) {
  return vendor.averageRating ?? vendor.rating ?? 0
}

export function MarketplacePage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [vendors, setVendors] = useState<Vendor[]>(demoVendors)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')
  const [maxPrice, setMaxPrice] = useState('750000')
  const [minRating, setMinRating] = useState('0')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchVendors({
          q: query || undefined,
          category: category === 'All' ? undefined : category,
          location: location === 'All' ? undefined : location,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minRating: minRating ? Number(minRating) : undefined,
        })
        setVendors(response.items.length ? response.items : demoVendors)
      } catch {
        setVendors(demoVendors)
      }
    }
    const timer = window.setTimeout(load, 250)
    return () => window.clearTimeout(timer)
  }, [category, location, maxPrice, minRating, query])

  const filtered = useMemo(
    () =>
      vendors.filter((vendor) => {
        const haystack = `${vendorName(vendor)} ${vendor.category} ${vendor.city} ${vendor.district ?? ''}`.toLowerCase()
        return haystack.includes(query.toLowerCase())
      }),
    [query, vendors],
  )

  const handleBook = async () => {
    if (!selectedVendor) return
    if (!selectedEvent) {
      toast.error('Select an event before booking')
      return
    }
    const id = vendorId(selectedVendor)
    if (!id || id.startsWith('v')) {
      toast.error('Demo vendor cannot be booked until vendors are saved in MongoDB')
      return
    }
    const selectedPkg = selectedVendor.packages?.find((item) => item.title === selectedPackage)
    try {
      await bookVendor({
        event: selectedEvent,
        vendor: id,
        packageTitle: selectedPkg?.title,
        amount: selectedPkg?.price ?? vendorPrice(selectedVendor),
      })
      toast.success('Booking request sent')
      setSelectedVendor(null)
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not book vendor'
      toast.error(message)
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Vendor marketplace</p>
          <h1 className="font-display text-4xl font-bold">Find verified Sri Lankan event partners</h1>
          <p className="mt-2 max-w-2xl text-sm text-ivory-50/62">
            Search by style, compare price and rating, view details, and book vendors for your selected event.
          </p>
        </div>
        <label className="flex min-h-12 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, style or vendor"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ivory-50/42 sm:w-72"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-white/6 p-4 md:grid-cols-4">
        <FilterRow label="Category">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="field-dark">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </FilterRow>
        <FilterRow label="Location">
          <select value={location} onChange={(event) => setLocation(event.target.value)} className="field-dark">
            {locations.map((item) => <option key={item}>{item}</option>)}
          </select>
        </FilterRow>
        <FilterRow label="Max Price">
          <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" className="field-dark" />
        </FilterRow>
        <FilterRow label="Min Rating">
          <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className="field-dark">
            <option value="0">Any rating</option>
            <option value="3.5">3.5+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </FilterRow>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <article key={vendorId(vendor)} className="overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft">
            <img src={vendor.images?.[0] ?? vendor.image} alt={vendorName(vendor)} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gold-300">{vendor.category}</p>
                  <h2 className="mt-1 text-xl font-bold">{vendorName(vendor)}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ivory-50/62">
                    <MapPin size={15} /> {vendor.city ?? vendor.district}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-gold-300/14 px-2 py-1 text-xs font-bold text-gold-300">
                  <Star size={14} fill="currentColor" /> {vendorRating(vendor).toFixed(1)}
                </span>
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-ivory-50/68">{vendor.description ?? 'Verified event partner with trusted service packages.'}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-sm">
                  From <span className="font-bold">{formatLKR(vendorPrice(vendor))}</span>
                </p>
                <Button onClick={() => { setSelectedVendor(vendor); setSelectedPackage(vendor.packages?.[0]?.title ?? '') }}>
                  View details
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gold-300">{selectedVendor.category}</p>
                <h2 className="font-display text-3xl font-bold">{vendorName(selectedVendor)}</h2>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10" onClick={() => setSelectedVendor(null)}>
                <X size={20} />
              </button>
            </div>
            <img src={selectedVendor.images?.[0] ?? selectedVendor.image} alt={vendorName(selectedVendor)} className="mt-5 h-72 w-full rounded-lg object-cover" />
            <p className="mt-5 text-sm leading-7 text-ivory-50/72">{selectedVendor.description ?? 'Professional vendor profile with packages, transparent pricing and customer-ready booking.'}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FilterRow label="Select Event">
                <select value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value)} className="field-dark">
                  <option value="">Choose your event</option>
                  {events.map((event) => (
                    <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>
                  ))}
                </select>
              </FilterRow>
              <FilterRow label="Package">
                <select value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)} className="field-dark">
                  {(selectedVendor.packages?.length ? selectedVendor.packages : [{ title: 'Standard package', price: vendorPrice(selectedVendor) }]).map((item) => (
                    <option key={item.title} value={item.title}>{item.title} - {formatLKR(item.price)}</option>
                  ))}
                </select>
              </FilterRow>
            </div>
            <Button className="mt-6 w-full" icon={<CalendarCheck size={18} />} onClick={() => void handleBook()}>
              Book vendor for selected event
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ivory-50/76">
      {label}
      {children}
    </label>
  )
}
