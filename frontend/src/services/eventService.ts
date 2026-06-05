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
  try {
    const { data } = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data as EventPlan
  } catch (error) {
    throwApiError(error, 'Failed to create event')
  }
}

export async function updateEvent(id: string, formData: FormData) {
  try {
    const { data } = await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data as EventPlan
  } catch (error) {
    throwApiError(error, 'Failed to update event')
  }
}

export async function deleteEvent(id: string) {
  try {
    const { data } = await api.delete(`/events/${id}`)
    return data.data as { id: string }
  } catch (error) {
    throwApiError(error, 'Failed to delete event')
  }
}

function throwApiError(error: unknown, fallback: string): never {
  const message = (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message
  throw new Error(message ?? (error as { message?: string }).message ?? fallback)
}
