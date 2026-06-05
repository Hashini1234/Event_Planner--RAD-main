export type Role = 'customer' | 'vendor' | 'admin'

export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Engagement'
  | 'Corporate'
  | 'Anniversary'
  | 'Party'
  | 'Other'

export type EventStatus = 'Planning' | 'Pending' | 'Confirmed' | 'Ongoing' | 'Completed' | 'Cancelled'

export const sriLankaDistricts = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  isEmailVerified: boolean
}

export interface Vendor {
  id: string
  _id?: string
  name: string
  vendorName?: string
  businessName?: string
  category: string
  city: string
  district?: string
  description?: string
  rating: number
  averageRating?: number
  reviews: number
  reviewCount?: number
  startingPrice: number
  pricing?: number
  verified: boolean
  image: string
  images?: string[]
  tags: string[]
  packages?: Array<{
    title: string
    description?: string
    price: number
    inclusions?: string[]
  }>
}

export interface EventPlan {
  id: string
  _id?: string
  eventTitle: string
  title?: string
  eventType: EventType
  type?: EventType
  eventDate: string
  date?: string
  startTime?: string
  endTime?: string
  venue: string
  district: string
  guestCount: number
  description?: string
  theme?: string
  budget: number
  spent?: number
  guests?: number
  status: EventStatus
  eventImage?: string
  notes?: string
  vendors?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Booking {
  id: string
  _id?: string
  event?: EventPlan
  vendor?: Vendor
  eventTitle: string
  vendorName: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'completed' | 'cancelled' | 'refunded'
  date: string
  packageTitle?: string
  notes?: string
}

export interface Guest {
  id: string
  _id?: string
  event?: string
  name: string
  email: string
  phone: string
  group: string
  plusOnes?: number
  rsvp: 'pending' | 'accepted' | 'declined'
  checkedIn: boolean
}

export interface BudgetItem {
  id?: string
  _id?: string
  event: string
  category: string
  title: string
  plannedAmount: number
  actualAmount: number
  notes?: string
  paid?: boolean
}

export interface NotificationItem {
  id?: string
  _id?: string
  title: string
  message: string
  type: 'booking' | 'payment' | 'vendor' | 'system' | 'rsvp'
  readAt?: string
  createdAt?: string
}
