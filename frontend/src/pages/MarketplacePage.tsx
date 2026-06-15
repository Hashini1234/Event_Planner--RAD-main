import { CalendarCheck, Eye, MapPin, PackageCheck, Search, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { bookVendor, fetchVendor, fetchVendorReviews, fetchVendors } from '../services/customerService'
import type { EventPlan, Review, Vendor } from '../types/domain'
import { formatLKR } from '../utils/currency'
import { vendors as demoVendors } from '../utils/mockData'

const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music / DJ', 'Makeup', 'Bridal Dressing', 'Hotels', 'Event Hall', 'Cake Designers', 'Florists']
const locations = ['All', 'Colombo', 'Kandy', 'Galle', 'Gampaha', 'Kalutara']

export function MarketplacePage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')
  const [maxPrice, setMaxPrice] = useState('750000')
  const [minRating, setMinRating] = useState('0')
  const [detailsVendor, setDetailsVendor] = useState<Vendor | null>(null)
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetchVendors({
          q: query || undefined,
          category: category === 'All' ? undefined : category,
          location: location === 'All' ? undefined : location,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minRating: minRating ? Number(minRating) : undefined,
        })
        setVendors(response.items)
      } catch {
        setVendors(demoVendors)
      } finally {
        setLoading(false)
      }
    }
    const timer = window.setTimeout(() => void load(), 250)
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

  const openDetails = async (vendor: Vendor) => {
    const id = vendorId(vendor)
    setReviews([])
    if (!id || id.startsWith('v')) {
      setDetailsVendor(vendor)
      return
    }
    try {
      const [freshVendor, vendorReviews] = await Promise.all([fetchVendor(id), fetchVendorReviews(id)])
      setDetailsVendor(freshVendor)
      setReviews(vendorReviews)
    } catch {
      setDetailsVendor(vendor)
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Vendor marketplace</p>
          <h1 className="font-display text-4xl font-bold">Find verified Sri Lankan event partners</h1>
          <p className="mt-2 max-w-2xl text-sm text-ivory-50/62">
            Browse vendors, compare packages, check event-date availability, and send booking requests.
          </p>
        </div>
        <label className="flex min-h-12 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vendor, category or location" className="w-full bg-transparent text-sm outline-none placeholder:text-ivory-50/42 sm:w-80" />
        </label>
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-white/6 p-4 md:grid-cols-4">
        <FilterRow label="Category">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="field-dark">{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </FilterRow>
        <FilterRow label="Location">
          <select value={location} onChange={(event) => setLocation(event.target.value)} className="field-dark">{locations.map((item) => <option key={item}>{item}</option>)}</select>
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

      {loading ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/6 p-8 text-center text-sm text-ivory-50/62">Loading vendors...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/6 p-10 text-center">
          <PackageCheck className="mx-auto text-gold-300" size={38} />
          <h2 className="mt-4 text-2xl font-bold">No vendors found</h2>
          <p className="mt-2 text-sm text-ivory-50/58">Try changing the category, location, price, or rating filters.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vendor) => (
            <VendorCard key={vendorId(vendor)} vendor={vendor} onDetails={() => void openDetails(vendor)} onBook={() => setBookingVendor(vendor)} />
          ))}
        </div>
      )}

      {detailsVendor && <VendorDetailsModal vendor={detailsVendor} reviews={reviews} onBook={() => { setBookingVendor(detailsVendor); setDetailsVendor(null) }} onClose={() => setDetailsVendor(null)} />}
      {bookingVendor && <BookingModal vendor={bookingVendor} events={events} onClose={() => setBookingVendor(null)} onBooked={() => setBookingVendor(null)} />}
    </section>
  )
}

function VendorCard({ vendor, onDetails, onBook }: { vendor: Vendor; onDetails: () => void; onBook: () => void }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft transition hover:-translate-y-1 hover:border-gold-300/40">
      <img src={vendorImage(vendor)} alt={vendorName(vendor)} className="h-56 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gold-300">{vendor.category}</p>
            <h2 className="mt-1 text-xl font-bold">{vendorName(vendor)}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-ivory-50/62"><MapPin size={15} /> {vendor.city ?? vendor.district}</p>
          </div>
          <RatingBadge vendor={vendor} />
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-ivory-50/68">{vendor.description ?? 'Verified event partner with trusted service packages.'}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm">From <span className="font-bold">{formatLKR(vendorPrice(vendor))}</span></p>
          <div className="flex gap-2">
            <Button variant="secondary" className="min-h-10 border-white/10 bg-white/8 px-3 text-ivory-50" icon={<Eye size={16} />} onClick={onDetails}>Details</Button>
            <Button icon={<CalendarCheck size={16} />} onClick={onBook}>Book Vendor</Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function VendorDetailsModal({ vendor, reviews, onBook, onClose }: { vendor: Vendor; reviews: Review[]; onBook: () => void; onClose: () => void }) {
  const packages = vendorPackages(vendor)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
        <ModalHeader eyebrow={`${vendor.category} / ${vendor.city ?? vendor.district}`} title={vendorName(vendor)} onClose={onClose} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <img src={vendorImage(vendor)} alt={vendorName(vendor)} className="h-80 w-full rounded-lg object-cover" />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(vendor.images ?? []).slice(1, 4).map((image) => <img key={image} src={image} alt={vendorName(vendor)} className="h-24 w-full rounded-md object-cover" />)}
            </div>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Starting price" value={formatLKR(vendorPrice(vendor))} />
              <InfoTile label="Rating" value={`${vendorRating(vendor).toFixed(1)} / 5`} />
              <InfoTile label="Location" value={`${vendor.city ?? vendor.district}`} />
              <InfoTile label="Availability" value={vendor.availability?.length ? 'Limited listed dates' : 'Open for requests'} />
            </div>
            <p className="mt-4 rounded-lg bg-white/6 p-4 text-sm leading-7 text-ivory-50/72">{vendor.description ?? 'Professional vendor profile with packages, transparent pricing and customer-ready booking.'}</p>
            <Button className="mt-4 w-full" icon={<CalendarCheck size={18} />} onClick={onBook}>Book Vendor</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-bold">Service packages</h3>
            <div className="mt-4 grid gap-3">
              {packages.map((item) => (
                <div key={packageKey(item)} className="rounded-md border border-white/10 bg-charcoal-900/70 p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">{item.title}</p>
                    <p className="font-bold text-gold-300">{formatLKR(item.price)}</p>
                  </div>
                  {item.description && <p className="mt-2 text-sm text-ivory-50/62">{item.description}</p>}
                  {item.inclusions?.length ? <p className="mt-2 text-xs text-ivory-50/50">{item.inclusions.join(' / ')}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-bold">Customer reviews</h3>
            <div className="mt-4 grid gap-3">
              {reviews.length === 0 && <p className="text-sm text-ivory-50/58">No reviews yet.</p>}
              {reviews.map((review) => (
                <div key={review._id ?? review.id} className="rounded-md bg-charcoal-900/70 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{typeof review.customer === 'object' ? review.customer.name ?? 'Customer' : 'Customer'}</p>
                    <span className="text-sm text-gold-300">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-ivory-50/70">{review.comment || 'No comment provided.'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingModal({ vendor, events, onClose, onBooked }: { vendor: Vendor; events: EventPlan[]; onClose: () => void; onBooked: () => void }) {
  const [eventId, setEventId] = useState(events[0]?._id ?? events[0]?.id ?? '')
  const [packageId, setPackageId] = useState(packageKey(vendorPackages(vendor)[0]))
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const event = events.find((item) => (item._id ?? item.id) === eventId)
  const packages = vendorPackages(vendor)
  const selectedPackage = packages.find((item) => packageKey(item) === packageId) ?? packages[0]
  const available = isVendorAvailable(vendor, event)

  const submit = async () => {
    const id = vendorId(vendor)
    if (!id || id.startsWith('v')) {
      toast.error('Demo vendor cannot be booked until vendors are saved in MongoDB')
      return
    }
    if (!event) {
      toast.error('Select one of your events')
      return
    }
    if (!available) {
      toast.error('Vendor is unavailable for this date.')
      return
    }
    setSaving(true)
    try {
      await bookVendor({
        event: eventId,
        eventId,
        vendor: id,
        vendorId: id,
        packageId,
        packageTitle: selectedPackage.title,
        packageName: selectedPackage.title,
        amount: selectedPackage.price,
        packagePrice: selectedPackage.price,
        date: event.eventDate,
        notes,
        customerNote: notes,
      })
      toast.success('Booking request sent')
      onBooked()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not book vendor'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
        <ModalHeader eyebrow="Booking request" title={vendorName(vendor)} onClose={onClose} />
        <div className="mt-5 grid gap-4">
          <FilterRow label="Select your event">
            <select value={eventId} onChange={(item) => setEventId(item.target.value)} className="field-dark">
              <option value="">Choose your event</option>
              {events.map((item) => <option key={item._id ?? item.id} value={item._id ?? item.id}>{item.eventTitle} - {formatDate(item.eventDate)}</option>)}
            </select>
          </FilterRow>
          <FilterRow label="Vendor package">
            <select value={packageId} onChange={(item) => setPackageId(item.target.value)} className="field-dark">
              {packages.map((item) => <option key={packageKey(item)} value={packageKey(item)}>{item.title} - {formatLKR(item.price)}</option>)}
            </select>
          </FilterRow>
          <textarea value={notes} onChange={(item) => setNotes(item.target.value)} rows={4} className="field-dark" placeholder="Optional notes for the vendor" />
          {event && (
            <div className={`rounded-md border p-3 text-sm ${available ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-blush-300/30 bg-blush-700/15 text-blush-200'}`}>
              {available ? `Available request date: ${formatDate(event.eventDate)}` : 'Vendor is unavailable for this date.'}
            </div>
          )}
        </div>
        <Button className="mt-5 w-full" disabled={saving || !available} icon={<CalendarCheck size={18} />} onClick={() => void submit()}>
          {saving ? 'Sending request...' : 'Submit Booking Request'}
        </Button>
      </div>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-ivory-50/76">{label}{children}</label>
}

function ModalHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-gold-300">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold">{title}</h2>
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10" onClick={onClose} aria-label="Close"><X size={20} /></button>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-white/10 bg-white/6 p-3"><p className="text-xs text-ivory-50/50">{label}</p><p className="mt-1 font-bold">{value}</p></div>
}

function RatingBadge({ vendor }: { vendor: Vendor }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-gold-300/14 px-2 py-1 text-xs font-bold text-gold-300"><Star size={14} fill="currentColor" /> {vendorRating(vendor).toFixed(1)}</span>
}

function vendorId(vendor: Vendor) { return vendor._id ?? vendor.id }
function vendorName(vendor: Vendor) { return vendor.vendorName ?? vendor.businessName ?? vendor.name }
function vendorPrice(vendor: Vendor) { return vendor.pricing ?? vendor.startingPrice ?? vendor.packages?.[0]?.price ?? 0 }
function vendorRating(vendor: Vendor) { return vendor.averageRating ?? vendor.rating ?? 0 }
function vendorImage(vendor: Vendor) { return vendor.images?.[0] ?? vendor.image }
function vendorPackages(vendor: Vendor) { return vendor.packages?.length ? vendor.packages : [{ title: 'Standard package', price: vendorPrice(vendor) }] }
function packageKey(item: { _id?: string; id?: string; title: string }) { return item._id ?? item.id ?? item.title }
function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
function isVendorAvailable(vendor: Vendor, event?: EventPlan) {
  if (!event || !vendor.availability?.length) return true
  const eventKey = new Date(event.eventDate).toISOString().slice(0, 10)
  return vendor.availability.some((date) => new Date(date).toISOString().slice(0, 10) === eventKey)
}
