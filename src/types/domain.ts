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
  name: string
  category: string
  city: string
  rating: number
  reviews: number
  startingPrice: number
  verified: boolean
  image: string
  tags: string[]
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
  eventTitle: string
  vendorName: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'completed'
  date: string
}

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  group: string
  rsvp: 'pending' | 'accepted' | 'declined'
  checkedIn: boolean
}
