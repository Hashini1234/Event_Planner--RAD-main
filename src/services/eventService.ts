import { api } from './api'
import type { EventPlan } from '../types/domain'

export interface EventListResponse {
  items: EventPlan[]
  total: number
  page: number
}

export async function fetchEvents(params?: { search?: string; eventType?: string; status?: string }) {
  const { data } = await api.get('/events', { params })
  return data.data as EventListResponse
}

export async function fetchMyEvents() {
  const { data } = await api.get('/events/user/my-events')
  return data.data as EventPlan[]
}

export async function createEvent(formData: FormData) {
  const { data } = await api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data as EventPlan
}

export async function updateEvent(id: string, formData: FormData) {
  const { data } = await api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data as EventPlan
}

export async function deleteEvent(id: string) {
  const { data } = await api.delete(`/events/${id}`)
  return data.data as { id: string }
}
