import type { Booking, EventPlan, Guest, Vendor } from '../types/domain'

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Ceylon Aura Photography',
    category: 'Photography',
    city: 'Colombo',
    rating: 4.9,
    reviews: 186,
    startingPrice: 185000,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    tags: ['weddings', 'cinematic', 'drone'],
  },
  {
    id: 'v2',
    name: 'Lotus Banquet Hall',
    category: 'Event Halls',
    city: 'Kandy',
    rating: 4.8,
    reviews: 94,
    startingPrice: 320000,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
    tags: ['hotel', 'garden', 'parking'],
  },
  {
    id: 'v3',
    name: 'Spice Route Catering',
    category: 'Catering',
    city: 'Galle',
    rating: 4.7,
    reviews: 143,
    startingPrice: 2400,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
    tags: ['Sri Lankan', 'fusion', 'buffet'],
  },
]

export const events: EventPlan[] = [
  {
    id: 'e1',
    title: 'Amani & Nuwan Wedding',
    eventTitle: 'Amani & Nuwan Wedding',
    eventType: 'Wedding',
    eventDate: '2026-08-16',
    venue: 'Mount Lavinia Hotel',
    district: 'Colombo',
    budget: 5200000,
    spent: 3180000,
    guestCount: 245,
    guests: 245,
    status: 'Planning',
  },
  {
    id: 'e2',
    title: 'Wijaya Holdings Annual Gala',
    eventTitle: 'Wijaya Holdings Annual Gala',
    eventType: 'Corporate',
    eventDate: '2026-07-04',
    venue: 'Cinnamon Grand Colombo',
    district: 'Colombo',
    budget: 2800000,
    spent: 2100000,
    guestCount: 420,
    guests: 420,
    status: 'Confirmed',
  },
]

export const bookings: Booking[] = [
  {
    id: 'b1',
    eventTitle: 'Amani & Nuwan Wedding',
    vendorName: 'Ceylon Aura Photography',
    amount: 185000,
    status: 'accepted',
    date: '2026-08-16',
  },
  {
    id: 'b2',
    eventTitle: 'Amani & Nuwan Wedding',
    vendorName: 'Spice Route Catering',
    amount: 588000,
    status: 'pending',
    date: '2026-08-16',
  },
]

export const guests: Guest[] = [
  {
    id: 'g1',
    name: 'Sanduni Perera',
    email: 'sanduni@example.com',
    phone: '+94771234567',
    group: 'Family',
    rsvp: 'accepted',
    checkedIn: false,
  },
  {
    id: 'g2',
    name: 'Kasun Jayawardena',
    email: 'kasun@example.com',
    phone: '+94777654321',
    group: 'Friends',
    rsvp: 'pending',
    checkedIn: false,
  },
]

export const expenseBreakdown = [
  { name: 'Venue', value: 1450000 },
  { name: 'Catering', value: 880000 },
  { name: 'Decor', value: 420000 },
  { name: 'Photo', value: 185000 },
  { name: 'Music', value: 245000 },
]
