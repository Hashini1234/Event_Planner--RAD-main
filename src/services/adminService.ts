import { api } from './api'
import type { Booking, EventPackage, Vendor } from '../types/domain'

const PACKAGE_STORE_KEY = 'celebratelk.eventPackages'
const VENDOR_STORE_KEY = 'celebratelk.adminVendors'

const defaultPackages: EventPackage[] = [
  {
    id: 'pkg-birthday',
    title: 'Birthday',
    category: 'Birthday',
    venue: 'Cinnamon Lakeside',
    location: 'Colombo',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=82',
    description: 'Colorful birthday package with decor, lights and vendor coordination.',
    inclusions: ['Decor setup', 'Cake table', 'Lighting', 'Vendor coordination'],
    active: true,
  },
  {
    id: 'pkg-marriage',
    title: 'Marriage',
    category: 'Wedding',
    venue: 'Galle Face Hotel',
    location: 'Colombo',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=82',
    description: 'Elegant wedding package with venue styling, floral entrance and premium planning support.',
    inclusions: ['Venue styling', 'Floral setup', 'Photography support', 'Planning checklist'],
    active: true,
  },
  {
    id: 'pkg-house',
    title: 'House Warming',
    category: 'House Warming',
    venue: 'Colombo Garden Hall',
    location: 'Colombo',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=82',
    description: 'Warm house warming package with catering and decor recommendations.',
    inclusions: ['Simple decor', 'Catering guide', 'Guest setup', 'Music suggestions'],
    active: true,
  },
  {
    id: 'pkg-baby',
    title: 'Baby Shower',
    category: 'Baby Shower',
    venue: 'Bloom Studio',
    location: 'Colombo',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=82',
    description: 'Soft pastel baby shower setup with dessert table and photo corner.',
    inclusions: ['Pastel decor', 'Dessert table', 'Photo corner', 'Invitation theme'],
    active: true,
  },
]

function readPackages() {
  const raw = localStorage.getItem(PACKAGE_STORE_KEY)
  if (!raw) {
    localStorage.setItem(PACKAGE_STORE_KEY, JSON.stringify(defaultPackages))
    return defaultPackages
  }
  try {
    return JSON.parse(raw) as EventPackage[]
  } catch {
    localStorage.setItem(PACKAGE_STORE_KEY, JSON.stringify(defaultPackages))
    return defaultPackages
  }
}

function writePackages(packages: EventPackage[]) {
  localStorage.setItem(PACKAGE_STORE_KEY, JSON.stringify(packages))
}

function readVendors() {
  const raw = localStorage.getItem(VENDOR_STORE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Vendor[]
  } catch {
    localStorage.removeItem(VENDOR_STORE_KEY)
    return []
  }
}

function writeVendors(vendors: Vendor[]) {
  localStorage.setItem(VENDOR_STORE_KEY, JSON.stringify(vendors))
}

export async function fetchEventPackages(params?: { category?: string }) {
  const packages = readPackages()
  return params?.category ? packages.filter((item) => item.category === params.category) : packages
}

export async function createEventPackage(payload: EventPackage) {
  const packages = readPackages()
  const item = { ...payload, id: crypto.randomUUID(), active: payload.active ?? true }
  writePackages([item, ...packages])
  return item
}

export async function updateEventPackage(id: string, payload: EventPackage) {
  const packages = readPackages()
  const updated = packages.map((item) => ((item._id ?? item.id) === id ? { ...payload, id } : item))
  writePackages(updated)
  return updated.find((item) => (item._id ?? item.id) === id) ?? payload
}

export async function deleteEventPackage(id: string) {
  writePackages(readPackages().filter((item) => (item._id ?? item.id) !== id))
  return { id }
}

export async function fetchAdminBookings() {
  try {
    const { data } = await api.get('/bookings/my')
    return data.data as Booking[]
  } catch {
    return []
  }
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status })
  return data.data as Booking
}

export async function fetchStoredAdminVendors() {
  return readVendors()
}

export async function createAdminVendor(payload: Partial<Vendor>) {
  try {
    const { data } = await api.post('/vendors', payload)
    return data.data as Vendor
  } catch {
    const vendors = readVendors()
    const image =
      payload.image ??
      payload.images?.[0] ??
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80'
    const item = {
      id: `admin-vendor-${crypto.randomUUID()}`,
      name: payload.vendorName ?? payload.businessName ?? payload.name ?? 'New Vendor',
      vendorName: payload.vendorName ?? payload.businessName ?? payload.name ?? 'New Vendor',
      businessName: payload.businessName ?? payload.vendorName ?? payload.name ?? 'New Vendor',
      category: payload.category ?? 'Decoration',
      city: payload.city ?? payload.district ?? 'Colombo',
      district: payload.district ?? payload.city ?? 'Colombo',
      description: payload.description ?? 'Admin added verified vendor.',
      rating: payload.rating ?? payload.averageRating ?? 0,
      averageRating: payload.averageRating ?? payload.rating ?? 0,
      reviews: payload.reviews ?? 0,
      reviewCount: payload.reviewCount ?? 0,
      startingPrice: payload.startingPrice ?? payload.pricing ?? 0,
      pricing: payload.pricing ?? payload.startingPrice ?? 0,
      verified: payload.verified ?? true,
      image,
      images: payload.images?.length ? payload.images : [image],
      tags: payload.tags ?? ['admin-added'],
      packages: payload.packages ?? [],
      availability: payload.availability ?? [],
    } satisfies Vendor
    writeVendors([item, ...vendors])
    return item
  }
}

export async function updateAdminVendor(id: string, payload: Partial<Vendor>) {
  const { data } = await api.put(`/vendors/${id}`, payload)
  return data.data as Vendor
}

export async function deleteAdminVendor(id: string) {
  const { data } = await api.delete(`/vendors/${id}`)
  return data.data as { id: string }
}
