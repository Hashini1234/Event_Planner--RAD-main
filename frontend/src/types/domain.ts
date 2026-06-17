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
  availability?: string[]
  packages?: Array<{
    _id?: string
    id?: string
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
  eventId?: EventPlan | string
  vendor?: Vendor
  vendorId?: Vendor | string
  customerId?: string
  packageId?: string
  eventTitle: string
  vendorName: string
  amount: number
  packagePrice?: number
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'completed' | 'cancelled' | 'refunded'
  date: string
  eventDate?: string
  packageTitle?: string
  packageName?: string
  notes?: string
  customerNote?: string
  createdAt?: string
  updatedAt?: string
}

export interface EventPackage {
  id?: string
  _id?: string
  title: string
  category: 'Birthday' | 'Wedding' | 'Festival' | 'Meetings' | 'House Warming' | 'Baby Shower' | 'Other'
  venue: string
  location: string
  price: number
  description?: string
  image?: string
  inclusions?: string[]
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  id?: string
  _id?: string
  vendor: string
  customer?: { id?: string; _id?: string; name?: string } | string
  booking?: string
  rating: number
  comment?: string
  status?: 'published' | 'flagged' | 'hidden'
  createdAt?: string
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
  amount: number
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

export interface GalleryImage {
  url: string
  publicId?: string
}

export interface GalleryComment {
  _id?: string
  id?: string
  userId: string
  userName: string
  text: string
  createdAt: string
}

export interface GalleryPost {
  _id?: string
  id?: string
  customerId?: { _id?: string; id?: string; name?: string } | string
  eventId: string
  title: string
  eventType: EventType
  location: string
  budgetRange: 'Under LKR 100,000' | 'LKR 100,000 - 500,000' | 'Above LKR 500,000'
  description: string
  images: GalleryImage[]
  likes: string[]
  comments: GalleryComment[]
  status: 'active' | 'pending' | 'hidden'
  createdAt?: string
  updatedAt?: string
}
