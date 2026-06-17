import { BarChart3, CheckCircle2, Edit3, PackagePlus, Plus, Store, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import {
  createAdminVendor,
  createEventPackage,
  deleteAdminVendor,
  deleteEventPackage,
  fetchAdminBookings,
  fetchEventPackages,
  updateBookingStatus,
  updateEventPackage,
} from '../../services/adminService'
import { fetchVendors } from '../../services/customerService'
import type { Booking, EventPackage, Vendor } from '../../types/domain'
import { formatLKR } from '../../utils/currency'

const adminTabs: Array<['packages' | 'vendors' | 'bookings' | 'reports', typeof PackagePlus, string]> = [
  ['packages', PackagePlus, 'Event Packages'],
  ['vendors', Store, 'Vendors'],
  ['bookings', CheckCircle2, 'Bookings'],
  ['reports', BarChart3, 'Reports'],
]

const emptyPackage: EventPackage = {
  title: '',
  category: 'Wedding',
  venue: '',
  location: 'Colombo',
  price: 0,
  description: '',
  image: '',
  inclusions: [],
  active: true,
}

const emptyVendor: Partial<Vendor> = {
  vendorName: '',
  businessName: '',
  category: 'Photography',
  city: 'Colombo',
  district: 'Colombo',
  description: '',
  pricing: 0,
  verified: true,
  images: [],
}

export function AdminDashboard() {
  const [tab, setTab] = useState<'packages' | 'vendors' | 'bookings' | 'reports'>('packages')
  const [packages, setPackages] = useState<EventPackage[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [packageForm, setPackageForm] = useState<EventPackage>(emptyPackage)
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>(emptyVendor)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)

  const load = async () => {
    try {
      const [packageData, vendorData, bookingData] = await Promise.all([
        fetchEventPackages(),
        fetchVendors({}),
        fetchAdminBookings(),
      ])
      setPackages(packageData)
      setVendors(vendorData.items)
      setBookings(bookingData)
    } catch {
      toast.error('Could not load admin data')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const report = useMemo(() => {
    const revenue = bookings.filter((item) => ['paid', 'completed'].includes(item.status)).reduce((sum, item) => sum + Number(item.amount || item.packagePrice || 0), 0)
    return {
      packages: packages.length,
      vendors: vendors.length,
      pendingBookings: bookings.filter((item) => item.status === 'pending').length,
      revenue,
    }
  }, [bookings, packages.length, vendors.length])

  const savePackage = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editingPackageId) {
        await updateEventPackage(editingPackageId, packageForm)
        toast.success('Package updated')
      } else {
        await createEventPackage(packageForm)
        toast.success('Package added')
      }
      setPackageForm(emptyPackage)
      setEditingPackageId(null)
      await load()
    } catch (error) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not save package')
    }
  }

  const saveVendor = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await createAdminVendor({
        ...vendorForm,
        image: vendorForm.images?.[0],
        name: vendorForm.vendorName ?? vendorForm.businessName ?? '',
        rating: 0,
        reviews: 0,
        startingPrice: Number(vendorForm.pricing ?? 0),
        tags: [],
      } as Partial<Vendor>)
      toast.success('Vendor added')
      setVendorForm(emptyVendor)
      await load()
    } catch (error) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not add vendor')
    }
  }

  const approveBooking = async (booking: Booking, status: Booking['status']) => {
    const id = booking._id ?? booking.id
    if (!id) return
    try {
      await updateBookingStatus(id, status)
      toast.success(`Booking ${status}`)
      await load()
    } catch {
      toast.error('Could not update booking')
    }
  }

  return (
    <section className="px-4 py-5 text-[#171124] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.07)]">
          <p className="text-sm font-bold uppercase tracking-wide text-[#7c3aed]">Admin Console</p>
          <h1 className="mt-2 text-4xl font-bold">Manage packages, vendors, bookings and reports</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {adminTabs.map(([id, Icon, label]) => (
              <button
                key={String(id)}
                onClick={() => setTab(id as typeof tab)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold ${tab === id ? 'bg-[#6d28d9] text-white' : 'bg-[#faf8ff] text-[#4b3a5d]'}`}
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric title="Packages" value={String(report.packages)} icon={<PackagePlus />} />
          <Metric title="Vendors" value={String(report.vendors)} icon={<Store />} />
          <Metric title="Pending Bookings" value={String(report.pendingBookings)} icon={<Users />} />
          <Metric title="Paid Revenue" value={formatLKR(report.revenue)} icon={<BarChart3 />} />
        </div>

        {tab === 'packages' && (
          <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <AdminCard title={editingPackageId ? 'Update Event Package' : 'Add Event Package'}>
              <form onSubmit={savePackage} className="grid gap-3">
                <Input label="Title" value={packageForm.title} onChange={(value) => setPackageForm({ ...packageForm, title: value })} />
                <Select label="Category" value={packageForm.category} options={['Birthday', 'Wedding', 'Festival', 'Meetings', 'House Warming', 'Baby Shower', 'Other']} onChange={(value) => setPackageForm({ ...packageForm, category: value as EventPackage['category'] })} />
                <Input label="Venue" value={packageForm.venue} onChange={(value) => setPackageForm({ ...packageForm, venue: value })} />
                <Input label="Location" value={packageForm.location} onChange={(value) => setPackageForm({ ...packageForm, location: value })} />
                <Input label="Price" type="number" value={String(packageForm.price)} onChange={(value) => setPackageForm({ ...packageForm, price: Number(value) })} />
                <Input label="Image URL" value={packageForm.image ?? ''} onChange={(value) => setPackageForm({ ...packageForm, image: value })} />
                <Textarea label="Description" value={packageForm.description ?? ''} onChange={(value) => setPackageForm({ ...packageForm, description: value })} />
                <Input label="Inclusions comma separated" value={packageForm.inclusions?.join(', ') ?? ''} onChange={(value) => setPackageForm({ ...packageForm, inclusions: value.split(',').map((item) => item.trim()).filter(Boolean) })} />
                <button className="min-h-11 rounded-xl bg-[#6d28d9] text-sm font-bold text-white">{editingPackageId ? 'Update Package' : 'Add Package'}</button>
              </form>
            </AdminCard>
            <AdminCard title="Event Packages">
              <div className="grid gap-3 lg:grid-cols-2">
                {packages.map((item) => (
                  <div key={item._id ?? item.id} className="rounded-xl border border-[#ece6f5] p-4">
                    <div className="flex gap-3">
                      <img src={item.image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=300&q=80'} alt={item.title} className="h-20 w-24 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{item.title}</p>
                        <p className="text-sm text-[#6b6078]">{item.category} / {item.venue}</p>
                        <p className="mt-1 font-bold text-[#7c3aed]">{formatLKR(item.price)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e7dff0] text-sm font-bold" onClick={() => { setEditingPackageId(item._id ?? item.id ?? null); setPackageForm(item) }}>
                        <Edit3 size={15} /> Edit
                      </button>
                      <button className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#ffe4e6] text-sm font-bold text-[#be123c]" onClick={() => item._id && void deleteEventPackage(item._id).then(load)}>
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        )}

        {tab === 'vendors' && (
          <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <AdminCard title="Add Vendor">
              <form onSubmit={saveVendor} className="grid gap-3">
                <Input label="Vendor Name" value={vendorForm.vendorName ?? ''} onChange={(value) => setVendorForm({ ...vendorForm, vendorName: value, businessName: value })} />
                <Select label="Category" value={String(vendorForm.category)} options={['Photography', 'Catering', 'Decoration', 'Music / DJ', 'Makeup', 'Bridal Dressing', 'Event Hall', 'Hotels', 'Cake Designers', 'Florists']} onChange={(value) => setVendorForm({ ...vendorForm, category: value })} />
                <Input label="City" value={vendorForm.city ?? ''} onChange={(value) => setVendorForm({ ...vendorForm, city: value, district: value })} />
                <Input label="Pricing" type="number" value={String(vendorForm.pricing ?? 0)} onChange={(value) => setVendorForm({ ...vendorForm, pricing: Number(value) })} />
                <Input label="Image URL" value={vendorForm.images?.[0] ?? ''} onChange={(value) => setVendorForm({ ...vendorForm, images: [value] })} />
                <Textarea label="Description" value={vendorForm.description ?? ''} onChange={(value) => setVendorForm({ ...vendorForm, description: value })} />
                <button className="min-h-11 rounded-xl bg-[#6d28d9] text-sm font-bold text-white"><Plus size={15} className="mr-1 inline" /> Add Vendor</button>
              </form>
            </AdminCard>
            <AdminCard title="Manage Vendors">
              <div className="grid gap-3 lg:grid-cols-2">
                {vendors.map((vendor) => (
                  <div key={vendor._id ?? vendor.id} className="rounded-xl border border-[#ece6f5] p-4">
                    <p className="font-bold">{vendor.vendorName ?? vendor.businessName ?? vendor.name}</p>
                    <p className="text-sm text-[#6b6078]">{vendor.category} / {vendor.city}</p>
                    <p className="mt-1 font-bold text-[#7c3aed]">{formatLKR(vendor.pricing ?? vendor.startingPrice ?? 0)}</p>
                    <button className="mt-3 min-h-9 w-full rounded-lg bg-[#ffe4e6] text-sm font-bold text-[#be123c]" onClick={() => (vendor._id || vendor.id) && void deleteAdminVendor(vendor._id ?? vendor.id).then(load)}>Delete Vendor</button>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        )}

        {tab === 'bookings' && (
          <AdminCard title="Customer Booking Requests">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#faf8ff] text-[#6b6078]">
                  <tr><th className="p-3">Vendor</th><th>Event</th><th>Amount</th><th>Status</th><th className="text-right">Action</th></tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id ?? booking.id} className="border-b border-[#f0ebf6]">
                      <td className="p-3 font-bold">{bookingVendor(booking)}</td>
                      <td>{bookingEvent(booking)}</td>
                      <td>{formatLKR(Number(booking.amount ?? booking.packagePrice ?? 0))}</td>
                      <td><span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-bold capitalize text-[#b45309]">{booking.status}</span></td>
                      <td className="p-3 text-right">
                        <button className="rounded-lg bg-[#dcfce7] px-3 py-2 text-xs font-bold text-[#15803d]" onClick={() => void approveBooking(booking, 'accepted')}>Approve</button>
                        <button className="ml-2 rounded-lg bg-[#ffe4e6] px-3 py-2 text-xs font-bold text-[#be123c]" onClick={() => void approveBooking(booking, 'rejected')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {tab === 'reports' && (
          <AdminCard title="Reports">
            <div className="grid gap-4 md:grid-cols-2">
              <ReportBlock title="Booking Pipeline" rows={[['Pending', report.pendingBookings], ['Accepted', bookings.filter((item) => item.status === 'accepted').length], ['Paid', bookings.filter((item) => item.status === 'paid').length]]} />
              <ReportBlock title="Platform Inventory" rows={[['Packages', report.packages], ['Vendors', report.vendors], ['Revenue', formatLKR(report.revenue)]]} />
            </div>
          </AdminCard>
        )}
      </div>
    </section>
  )
}

function Metric({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return <div className="rounded-2xl bg-white p-5 shadow-[0_12px_35px_rgba(31,17,50,0.06)]"><span className="text-[#7c3aed]">{icon}</span><p className="mt-3 text-sm font-semibold text-[#6b6078]">{title}</p><p className="text-2xl font-bold">{value}</p></div>
}

function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return <article className="rounded-2xl bg-white p-5 shadow-[0_12px_35px_rgba(31,17,50,0.06)]"><h2 className="mb-4 text-xl font-bold">{title}</h2>{children}</article>
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#554a63]">{label}<input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="market-field" required /></label>
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#554a63]">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} className="market-field min-h-24" /></label>
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#554a63]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="market-field">{options.map((item) => <option key={item}>{item}</option>)}</select></label>
}

function ReportBlock({ title, rows }: { title: string; rows: Array<[string, string | number]> }) {
  return <div className="rounded-xl border border-[#ece6f5] p-4"><h3 className="font-bold">{title}</h3><div className="mt-3 space-y-2">{rows.map(([label, value]) => <div key={label} className="flex justify-between text-sm"><span className="text-[#6b6078]">{label}</span><span className="font-bold">{value}</span></div>)}</div></div>
}

function bookingVendor(booking: Booking) {
  const vendor = booking.vendor ?? (typeof booking.vendorId === 'object' ? booking.vendorId : undefined)
  return vendor?.vendorName ?? vendor?.businessName ?? booking.vendorName ?? 'Vendor'
}

function bookingEvent(booking: Booking) {
  const event = booking.event ?? (typeof booking.eventId === 'object' ? booking.eventId : undefined)
  return event?.eventTitle ?? booking.eventTitle ?? 'Event'
}
