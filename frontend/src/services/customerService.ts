import { api } from './api'
import type { Booking, BudgetItem, EventPlan, Guest, NotificationItem, Vendor } from '../types/domain'

export interface VendorFilters {
  q?: string
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

export async function fetchVendors(params: VendorFilters = {}) {
  const { data } = await api.get('/vendors', { params })
  return data.data as { items: Vendor[]; total: number; page: number }
}

export async function fetchVendor(id: string) {
  const { data } = await api.get(`/vendors/${id}`)
  return data.data as Vendor
}

export async function bookVendor(payload: {
  event: string
  vendor: string
  packageTitle?: string
  amount?: number
  date?: string
  notes?: string
}) {
  const { data } = await api.post('/bookings', payload)
  return data.data as Booking
}

export async function fetchMyBookings() {
  const { data } = await api.get('/bookings/my')
  return data.data as Booking[]
}

export async function cancelBooking(id: string) {
  const { data } = await api.patch(`/bookings/${id}/cancel`)
  return data.data as Booking
}

export async function fetchBudget(event: string) {
  const { data } = await api.get('/budget-items', { params: { event } })
  return data.data as {
    items: BudgetItem[]
    budget: number
    totalSpent: number
    remaining: number
    warning: string | null
    categories: Array<{ category: string; amount: number }>
  }
}

export async function createBudgetItem(payload: BudgetItem) {
  const { data } = await api.post('/budget-items', payload)
  return data.data as BudgetItem
}

export async function updateBudgetItem(id: string, payload: Partial<BudgetItem>) {
  const { data } = await api.put(`/budget-items/${id}`, payload)
  return data.data as BudgetItem
}

export async function deleteBudgetItem(id: string) {
  const { data } = await api.delete(`/budget-items/${id}`)
  return data.data as { id: string }
}

export async function fetchGuests(event: string) {
  const { data } = await api.get('/guests', { params: { event } })
  return data.data as Guest[]
}

export async function createGuest(payload: Omit<Guest, 'id' | 'checkedIn'> & { event: string }) {
  const { data } = await api.post('/guests', payload)
  return data.data as Guest
}

export async function updateGuest(id: string, payload: Partial<Guest>) {
  const { data } = await api.put(`/guests/${id}`, payload)
  return data.data as Guest
}

export async function deleteGuest(id: string) {
  const { data } = await api.delete(`/guests/${id}`)
  return data.data as { id: string }
}

export async function fetchNotifications() {
  const { data } = await api.get('/notifications')
  return data.data as NotificationItem[]
}

export async function markNotificationRead(id: string) {
  const { data } = await api.patch(`/notifications/${id}/read`)
  return data.data as NotificationItem
}

export async function fetchVendorRecommendations(event: EventPlan) {
  const { data } = await api.post('/ai/vendor-recommendations', {
    eventId: event._id ?? event.id,
    budget: event.budget,
    minRating: 3.5,
  })
  return data.data as Array<{ vendor: Vendor; score: number; reason: string }>
}
