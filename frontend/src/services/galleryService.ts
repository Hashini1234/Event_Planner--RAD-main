import { api } from './api'
import type { GalleryComment, GalleryPost } from '../types/domain'

export interface GalleryFilters {
  search?: string
  eventType?: string
  budgetRange?: string
}

export async function fetchGalleryPosts(params: GalleryFilters = {}) {
  const { data } = await api.get('/gallery', { params })
  return data.data as { items: GalleryPost[]; total: number }
}

export async function fetchGalleryPost(id: string) {
  const { data } = await api.get(`/gallery/${id}`)
  return data.data as GalleryPost
}

export async function createGalleryPost(formData: FormData) {
  const { data } = await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data.data as GalleryPost
}

export async function updateGalleryPost(id: string, formData: FormData) {
  const { data } = await api.put(`/gallery/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data.data as GalleryPost
}

export async function deleteGalleryPost(id: string) {
  const { data } = await api.delete(`/gallery/${id}`)
  return data.data as { id: string }
}

export async function toggleGalleryLike(id: string) {
  const { data } = await api.post(`/gallery/${id}/like`)
  return data.data as { liked: boolean; likesCount: number; post: GalleryPost }
}

export async function addGalleryComment(id: string, text: string) {
  const { data } = await api.post(`/gallery/${id}/comments`, { text })
  return data.data as GalleryComment
}

export async function deleteGalleryComment(id: string, commentId: string) {
  const { data } = await api.delete(`/gallery/${id}/comments/${commentId}`)
  return data.data as { id: string }
}
