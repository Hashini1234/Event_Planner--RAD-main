import {
  CalendarCheck,
  CheckCircle2,
  Eye,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadMyEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createAdminVendor, fetchStoredAdminVendors } from '../services/adminService'
import { bookVendor, fetchVendor, fetchVendorReviews, fetchVendors } from '../services/customerService'
import type { EventPlan, Review, Vendor } from '../types/domain'
import { formatLKR } from '../utils/currency'
import { vendors as demoVendors } from '../utils/mockData'

const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music / DJ', 'Makeup', 'Bridal Dressing', 'Hotels', 'Event Hall', 'Cake Designers', 'Florists']
const locations = ['All', 'Colombo', 'Kandy', 'Galle', 'Gampaha', 'Kalutara']

export function MarketplacePage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const user = useAppSelector((state) => state.auth.user)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')
  const [maxPrice, setMaxPrice] = useState('750000')
  const [minRating, setMinRating] = useState('0')
  const [detailsVendor, setDetailsVendor] = useState<Vendor | null>(null)
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null)
  const [addingVendor, setAddingVendor] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(loadMyEvents())
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
        const stored = await fetchStoredAdminVendors()
        const storedIds = new Set(stored.map((item) => vendorId(item)))
        setVendors([...stored, ...response.items.filter((item) => !storedIds.has(vendorId(item)))])
      } catch {
        const stored = await fetchStoredAdminVendors()
        setVendors([...stored, ...demoVendors])
      } finally {
        setLoading(false)
      }
    }
    const timer = window.setTimeout(() => void load(), 250)
    return () => window.clearTimeout(timer)
  }, [category, location, maxPrice, minRating, query, reloadKey])

  const handleVendorCreated = (vendor: Vendor) => {
    setVendors((items) => [vendor, ...items.filter((item) => vendorId(item) !== vendorId(vendor))])
    setReloadKey((value) => value + 1)
    setAddingVendor(false)
  }

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
    <section className="px-4 py-5 text-[#171124] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="relative overflow-hidden rounded-2xl border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.07)] lg:p-8">
          <div className="absolute right-0 top-0 h-48 w-80 rounded-bl-full bg-[#f1e7ff]" />
          <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f1e7ff] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#6d28d9]">
                <CheckCircle2 size={15} />
                Verified Sri Lankan vendors
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight">Find vendors for your event</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6078]">
                Browse trusted venues, caterers, photographers and decorators. Select one of your events
                and send a booking request directly to the vendor.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 xl:max-w-md">
              <label className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-[#ded6ea] bg-white px-4 shadow-sm">
                <Search size={18} className="text-[#6d6474]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search vendor, category or location"
                  className="w-full bg-transparent text-sm text-[#21142f] outline-none placeholder:text-[#8d8498]"
                />
              </label>
              {isAdmin && (
                <Button
                  icon={<Plus size={18} />}
                  className="min-h-12 rounded-xl bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/20 hover:bg-[#5b21b6]"
                  onClick={() => setAddingVendor(true)}
                >
                  Add Vendor
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#ece6f5] bg-white p-4 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#3d2b4f]">
            <SlidersHorizontal size={18} className="text-[#7c3aed]" />
            Refine vendors
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <FilterRow label="Category">
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="market-field">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FilterRow>
            <FilterRow label="Location">
              <select value={location} onChange={(event) => setLocation(event.target.value)} className="market-field">
                {locations.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FilterRow>
            <FilterRow label="Max Price">
              <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" className="market-field" />
            </FilterRow>
            <FilterRow label="Min Rating">
              <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className="market-field">
                <option value="0">Any rating</option>
                <option value="3.5">3.5+</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
            </FilterRow>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#ece6f5] bg-white p-10 text-center text-sm font-semibold text-[#6b6078] shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            Loading vendors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#ece6f5] bg-white p-12 text-center shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            <PackageCheck className="mx-auto text-[#7c3aed]" size={42} />
            <h2 className="mt-4 text-2xl font-bold">No vendors found</h2>
            <p className="mt-2 text-sm text-[#6b6078]">Try changing the category, location, price, or rating filters.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((vendor) => (
              <VendorCard key={vendorId(vendor)} vendor={vendor} onDetails={() => void openDetails(vendor)} onBook={() => setBookingVendor(vendor)} />
            ))}
          </div>
        )}
      </div>

      {detailsVendor && <VendorDetailsModal vendor={detailsVendor} reviews={reviews} onBook={() => { setBookingVendor(detailsVendor); setDetailsVendor(null) }} onClose={() => setDetailsVendor(null)} />}
      {bookingVendor && <BookingModal vendor={bookingVendor} events={events} onClose={() => setBookingVendor(null)} onBooked={() => setBookingVendor(null)} />}
      {addingVendor && <AddVendorModal onClose={() => setAddingVendor(false)} onCreated={handleVendorCreated} />}
    </section>
  )
}

function VendorCard({ vendor, onDetails, onBook }: { vendor: Vendor; onDetails: () => void; onBook: () => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#ece6f5] bg-white shadow-[0_12px_35px_rgba(31,17,50,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(109,40,217,0.13)]">
      <div className="relative h-56 overflow-hidden bg-[#f7f4fb]">
        <img src={vendorImage(vendor)} alt={vendorName(vendor)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[#6d28d9] shadow-sm">
          {vendor.category}
        </div>
        <div className="absolute right-4 top-4">
          <RatingBadge vendor={vendor} />
        </div>
      </div>
      <div className="p-5">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-[#171124]">{vendorName(vendor)}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[#6b6078]">
            <MapPin size={15} /> {vendor.city ?? vendor.district ?? 'Sri Lanka'}
          </p>
        </div>
        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#6b6078]">
          {vendor.description ?? 'Verified event partner with trusted service packages.'}
        </p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8195]">Starting from</p>
            <p className="mt-1 text-lg font-bold text-[#171124]">{formatLKR(vendorPrice(vendor))}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="min-h-10 rounded-lg border-[#e7dff0] bg-white px-3 text-[#4b3a5d] hover:bg-[#faf7ff]"
              icon={<Eye size={16} />}
              onClick={onDetails}
            >
              Details
            </Button>
            <Button
              className="min-h-10 rounded-lg bg-[#171124] px-4 text-white hover:bg-[#2b2140]"
              icon={<CalendarCheck size={16} />}
              onClick={onBook}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function VendorDetailsModal({ vendor, reviews, onBook, onClose }: { vendor: Vendor; reviews: Review[]; onBook: () => void; onClose: () => void }) {
  const packages = vendorPackages(vendor)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#171124]/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 text-[#171124] shadow-2xl">
        <ModalHeader eyebrow={`${vendor.category} / ${vendor.city ?? vendor.district ?? 'Sri Lanka'}`} title={vendorName(vendor)} onClose={onClose} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <img src={vendorImage(vendor)} alt={vendorName(vendor)} className="h-80 w-full rounded-xl object-cover" />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(vendor.images ?? []).slice(1, 4).map((image) => <img key={image} src={image} alt={vendorName(vendor)} className="h-24 w-full rounded-lg object-cover" />)}
            </div>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Starting price" value={formatLKR(vendorPrice(vendor))} />
              <InfoTile label="Rating" value={`${vendorRating(vendor).toFixed(1)} / 5`} />
              <InfoTile label="Location" value={`${vendor.city ?? vendor.district ?? 'Sri Lanka'}`} />
              <InfoTile label="Availability" value={vendor.availability?.length ? 'Limited listed dates' : 'Open for requests'} />
            </div>
            <p className="mt-4 rounded-xl bg-[#faf8ff] p-4 text-sm leading-7 text-[#6b6078]">
              {vendor.description ?? 'Professional vendor profile with packages, transparent pricing and customer-ready booking.'}
            </p>
            <Button className="mt-4 w-full rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6]" icon={<CalendarCheck size={18} />} onClick={onBook}>
              Book Vendor
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-[#ece6f5] bg-white p-5">
            <h3 className="text-lg font-bold">Service packages</h3>
            <div className="mt-4 grid gap-3">
              {packages.map((item) => (
                <div key={packageKey(item)} className="rounded-xl border border-[#ece6f5] bg-[#faf8ff] p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">{item.title}</p>
                    <p className="font-bold text-[#6d28d9]">{formatLKR(item.price)}</p>
                  </div>
                  {item.description && <p className="mt-2 text-sm text-[#6b6078]">{item.description}</p>}
                  {item.inclusions?.length ? <p className="mt-2 text-xs text-[#8a8195]">{item.inclusions.join(' / ')}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#ece6f5] bg-white p-5">
            <h3 className="text-lg font-bold">Customer reviews</h3>
            <div className="mt-4 grid gap-3">
              {reviews.length === 0 && <p className="text-sm text-[#6b6078]">No reviews yet.</p>}
              {reviews.map((review) => (
                <div key={review._id ?? review.id} className="rounded-xl bg-[#faf8ff] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{typeof review.customer === 'object' ? review.customer.name ?? 'Customer' : 'Customer'}</p>
                    <span className="text-sm font-bold text-[#d4af37]">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6b6078]">{review.comment || 'No comment provided.'}</p>
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#171124]/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 text-[#171124] shadow-2xl">
        <ModalHeader eyebrow="Booking request" title={vendorName(vendor)} onClose={onClose} />
        <div className="mt-5 grid gap-4">
          <FilterRow label="Select your event">
            <select value={eventId} onChange={(item) => setEventId(item.target.value)} className="market-field">
              <option value="">Choose your event</option>
              {events.map((item) => <option key={item._id ?? item.id} value={item._id ?? item.id}>{item.eventTitle} - {formatDate(item.eventDate)}</option>)}
            </select>
          </FilterRow>
          <FilterRow label="Vendor package">
            <select value={packageId} onChange={(item) => setPackageId(item.target.value)} className="market-field">
              {packages.map((item) => <option key={packageKey(item)} value={packageKey(item)}>{item.title} - {formatLKR(item.price)}</option>)}
            </select>
          </FilterRow>
          <textarea value={notes} onChange={(item) => setNotes(item.target.value)} rows={4} className="market-field min-h-28" placeholder="Optional notes for the vendor" />
          {event && (
            <div className={`rounded-xl border p-3 text-sm font-semibold ${available ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]' : 'border-[#fecdd3] bg-[#fff1f2] text-[#be123c]'}`}>
              {available ? `Available request date: ${formatDate(event.eventDate)}` : 'Vendor is unavailable for this date.'}
            </div>
          )}
        </div>
        <Button className="mt-5 w-full rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6]" disabled={saving || !available} icon={<CalendarCheck size={18} />} onClick={() => void submit()}>
          {saving ? 'Sending request...' : 'Submit Booking Request'}
        </Button>
      </div>
    </div>
  )
}

function AddVendorModal({ onClose, onCreated }: { onClose: () => void; onCreated: (vendor: Vendor) => void }) {
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState(
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
  )

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const vendorName = String(form.get('vendorName') ?? '').trim()
    const category = String(form.get('category') ?? 'Decoration')
    const city = String(form.get('city') ?? 'Colombo').trim()
    const district = String(form.get('district') ?? city).trim()
    const pricing = Number(form.get('pricing') ?? 0)
    const image = String(form.get('image') ?? '').trim() || imagePreview
    const packageTitle = String(form.get('packageTitle') ?? 'Standard package').trim()
    const packagePrice = Number(form.get('packagePrice') ?? pricing)
    const inclusions = String(form.get('inclusions') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!vendorName || !city || !district || !pricing) {
      toast.error('Please fill vendor name, location and starting price')
      return
    }

    setSaving(true)
    try {
      const vendor = await createAdminVendor({
        name: vendorName,
        vendorName,
        businessName: vendorName,
        category,
        city,
        district,
        description: String(form.get('description') ?? '').trim(),
        pricing,
        startingPrice: pricing,
        image,
        images: [image],
        verified: true,
        rating: 0,
        averageRating: 0,
        reviews: 0,
        reviewCount: 0,
        tags: ['admin-added', category],
        packages: [
          {
            title: packageTitle || 'Standard package',
            description: String(form.get('packageDescription') ?? '').trim(),
            price: packagePrice || pricing,
            inclusions,
          },
        ],
      })
      toast.success('Vendor added successfully')
      onCreated(vendor)
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ??
        (error as { message?: string }).message ??
        'Could not add vendor'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#171124]/70 p-4 backdrop-blur-sm">
      <form onSubmit={(event) => void submit(event)} className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 text-[#171124] shadow-2xl">
        <ModalHeader eyebrow="Admin vendor manager" title="Add verified vendor" onClose={onClose} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-[#ece6f5] bg-[#faf8ff] p-4">
            <img src={imagePreview} alt="Vendor preview" className="h-64 w-full rounded-xl object-cover" />
            <p className="mt-4 text-sm font-semibold text-[#6b6078]">
              This vendor will appear in the marketplace for customers to view and book.
            </p>
            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8a8195]">Customer flow</p>
              <p className="mt-2 text-sm leading-6 text-[#6b6078]">
                Customer opens details, sends booking request, admin approves, then customer pays.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FilterRow label="Vendor name">
                <input name="vendorName" required className="market-field" placeholder="Royal Catering" />
              </FilterRow>
              <FilterRow label="Category">
                <select name="category" className="market-field" defaultValue="Decoration">
                  {categories.filter((item) => item !== 'All').map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </FilterRow>
              <FilterRow label="City">
                <input name="city" required className="market-field" placeholder="Colombo" />
              </FilterRow>
              <FilterRow label="District">
                <select name="district" className="market-field" defaultValue="Colombo">
                  {locations.filter((item) => item !== 'All').map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </FilterRow>
              <FilterRow label="Starting price">
                <input name="pricing" required type="number" min="0" className="market-field" placeholder="120000" />
              </FilterRow>
              <FilterRow label="Image URL">
                <input
                  name="image"
                  className="market-field"
                  defaultValue={imagePreview}
                  onChange={(event) => setImagePreview(event.target.value || imagePreview)}
                  placeholder="https://..."
                />
              </FilterRow>
            </div>

            <FilterRow label="Description">
              <textarea name="description" rows={4} className="market-field min-h-28" placeholder="Professional wedding and event service provider..." />
            </FilterRow>

            <div className="rounded-2xl border border-[#ece6f5] bg-[#faf8ff] p-4">
              <h3 className="text-lg font-bold">Default package</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FilterRow label="Package title">
                  <input name="packageTitle" className="market-field" defaultValue="Standard package" />
                </FilterRow>
                <FilterRow label="Package price">
                  <input name="packagePrice" type="number" min="0" className="market-field" placeholder="120000" />
                </FilterRow>
              </div>
              <FilterRow label="Package description">
                <input name="packageDescription" className="market-field" placeholder="Includes setup, coordination and basic service package" />
              </FilterRow>
              <FilterRow label="Inclusions comma separated">
                <input name="inclusions" className="market-field" placeholder="Setup, Coordination, Transport" />
              </FilterRow>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="rounded-xl border-[#e7dff0] bg-white px-6 text-[#4b3a5d]" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} icon={<Plus size={18} />} className="rounded-xl bg-[#6d28d9] px-7 text-white hover:bg-[#5b21b6]">
                {saving ? 'Adding vendor...' : 'Add Vendor'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#554a63]">{label}{children}</label>
}

function ModalHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-[#7c3aed]">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-bold">{title}</h2>
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-xl text-[#4b3a5d] hover:bg-[#faf7ff]" onClick={onClose} aria-label="Close"><X size={20} /></button>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[#ece6f5] bg-[#faf8ff] p-3"><p className="text-xs font-semibold text-[#8a8195]">{label}</p><p className="mt-1 font-bold">{value}</p></div>
}

function RatingBadge({ vendor }: { vendor: Vendor }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[#d4a017] shadow-sm"><Star size={14} fill="currentColor" /> {vendorRating(vendor).toFixed(1)}</span>
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
