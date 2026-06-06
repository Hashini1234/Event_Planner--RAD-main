import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { cloudinary } from '../config/cloudinary.js'
import { env } from '../config/env.js'
import { EventModel } from '../models/Event.js'
import { GalleryPostModel, galleryBudgetRanges } from '../models/GalleryPost.js'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const maxGalleryImages = 8

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}

export async function listGalleryPosts(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: { items: [], total: 0 } })
    return
  }

  const { search, eventType, budgetRange, page = '1', limit = '12' } = req.query
  const filter: Record<string, unknown> = { status: 'active' }
  if (eventType && eventType !== 'All') filter.eventType = eventType
  if (budgetRange && budgetRange !== 'All') filter.budgetRange = budgetRange
  if (search) {
    const pattern = new RegExp(String(search).trim(), 'i')
    filter.$or = [{ title: pattern }, { location: pattern }, { eventType: pattern }]
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    GalleryPostModel.find(filter)
      .populate('customerId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    GalleryPostModel.countDocuments(filter),
  ])

  res.json({ success: true, data: { items, total } })
}

export async function getGalleryPost(req: Request, res: Response) {
  const post = await GalleryPostModel.findById(req.params.id).populate('customerId', 'name')
  if (!post || (post.status !== 'active' && req.user?.role !== 'admin' && String(post.customerId) !== req.user?.id)) {
    throw new AppError('Gallery post not found', 404)
  }
  res.json({ success: true, data: post })
}

export async function createGalleryPost(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to create gallery posts', 503)
  const event = await assertCustomerEvent(req.body.eventId, req.user!.id)
  const images = await storeGalleryImages(req)
  if (images.length === 0) throw new AppError('At least one event photo is required', 400)

  const payload = buildGalleryPayload(req.body, event, req.user!.id, images)
  const post = await GalleryPostModel.create(payload)
  res.status(201).json({ success: true, data: post })
}

export async function updateGalleryPost(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to update gallery posts', 503)
  const post = await GalleryPostModel.findById(req.params.id)
  if (!post) throw new AppError('Gallery post not found', 404)
  assertCanModifyPost(post.customerId, req.user!.id, req.user!.role)

  const event = req.body.eventId ? await assertCustomerEvent(req.body.eventId, req.user!.id) : null
  const newImages = await storeGalleryImages(req)
  const existingImages = req.body.keepExistingImages === 'false' ? [] : post.images
  Object.assign(post, buildGalleryPayload(req.body, event, req.user!.id, [...existingImages, ...newImages], post))
  await post.save()
  res.json({ success: true, data: post })
}

export async function deleteGalleryPost(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to delete gallery posts', 503)
  const post = await GalleryPostModel.findById(req.params.id)
  if (!post) throw new AppError('Gallery post not found', 404)
  assertCanModifyPost(post.customerId, req.user!.id, req.user!.role)
  await post.deleteOne()
  res.json({ success: true, data: { id: req.params.id } })
}

export async function toggleGalleryLike(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to like gallery posts', 503)
  const post = await GalleryPostModel.findById(req.params.id)
  if (!post || post.status !== 'active') throw new AppError('Gallery post not found', 404)
  const userId = req.user!.id
  const liked = post.likes.some((id) => String(id) === userId)
  ;(post as any).likes = liked
    ? post.likes.filter((id) => String(id) !== userId)
    : [...post.likes, new mongoose.Types.ObjectId(userId)]
  await post.save()
  res.json({ success: true, data: { liked: !liked, likesCount: post.likes.length, post } })
}

export async function addGalleryComment(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to comment on gallery posts', 503)
  const text = String(req.body.text ?? '').trim()
  if (!text) throw new AppError('Comment text is required', 400)
  if (text.length > 1000) throw new AppError('Comment is too long', 400)
  const post = await GalleryPostModel.findById(req.params.id)
  if (!post || post.status !== 'active') throw new AppError('Gallery post not found', 404)
  const user = await UserModel.findById(req.user!.id).select('name')
  post.comments.push({ userId: new mongoose.Types.ObjectId(req.user!.id), userName: user?.name ?? 'Customer', text })
  await post.save()
  res.status(201).json({ success: true, data: post.comments[post.comments.length - 1] })
}

export async function deleteGalleryComment(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to delete comments', 503)
  const post = await GalleryPostModel.findById(req.params.id)
  if (!post) throw new AppError('Gallery post not found', 404)
  const comment = (post.comments as any).id(req.params.commentId)
  if (!comment) throw new AppError('Comment not found', 404)
  if (req.user!.role !== 'admin' && String(comment.userId) !== req.user!.id) {
    throw new AppError('You can only delete your own comment', 403)
  }
  comment.deleteOne()
  await post.save()
  res.json({ success: true, data: { id: req.params.commentId } })
}

async function assertCustomerEvent(eventId: string, userId: string) {
  if (!eventId) throw new AppError('Selected event is required', 400)
  const event = await EventModel.findById(eventId)
  if (!event) throw new AppError('Event not found', 404)
  if (String(event.createdBy) !== userId) throw new AppError('You can only create gallery posts for your own events', 403)
  return event
}

function assertCanModifyPost(ownerId: unknown, userId: string, role: string) {
  if (role !== 'admin' && String(ownerId) !== userId) {
    throw new AppError('You can only modify your own gallery post', 403)
  }
}

function buildGalleryPayload(body: Record<string, unknown>, event: unknown, userId: string, images: Array<{ url: string; publicId?: string }>, existing?: any) {
  const title = getString(body.title, existing?.title)
  const eventType = getString(body.eventType, existing?.eventType)
  const location = getString(body.location, existing?.location)
  const budgetRange = getString(body.budgetRange, existing?.budgetRange)
  const description = getString(body.description, existing?.description)

  if (!title || title.length < 3) throw new AppError('Gallery title must be at least 3 characters', 400)
  if (!eventType) throw new AppError('Event type is required', 400)
  if (!location) throw new AppError('Location is required', 400)
  if (!budgetRange || !galleryBudgetRanges.includes(budgetRange as (typeof galleryBudgetRanges)[number])) {
    throw new AppError('Valid budget range is required', 400)
  }
  if (!description || description.length < 10) throw new AppError('Description must be at least 10 characters', 400)
  if (images.length === 0) throw new AppError('At least one event photo is required', 400)
  if (images.length > maxGalleryImages) throw new AppError(`You can upload up to ${maxGalleryImages} photos`, 400)

  return {
    customerId: existing?.customerId ?? userId,
    eventId: (event as { id?: string } | null)?.id ?? body.eventId ?? existing?.eventId,
    title,
    eventType,
    location,
    budgetRange,
    description,
    images,
    status: existing?.status ?? 'active',
  }
}

async function storeGalleryImages(req: Request) {
  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  if (files.length > maxGalleryImages) throw new AppError(`You can upload up to ${maxGalleryImages} photos`, 400)
  return Promise.all(files.map((file) => storeGalleryImage(file, req)))
}

async function storeGalleryImage(file: Express.Multer.File, req: Request) {
  validateImageFile(file)
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    const result = await uploadToCloudinary(file)
    return { url: result.secure_url, publicId: result.public_id }
  }

  const extension = mimeExtension(file.mimetype)
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`
  const uploadDir = path.join(process.cwd(), 'uploads', 'gallery')
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, fileName), file.buffer)
  return { url: `${req.protocol}://${req.get('host')}/uploads/gallery/${fileName}`, publicId: `local/gallery/${fileName}` }
}

function uploadToCloudinary(file: Express.Multer.File) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'celebratelk/gallery', resource_type: 'image' }, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error('Cloudinary upload failed'))
        return
      }
      resolve({ secure_url: result.secure_url, public_id: result.public_id })
    })
    stream.end(file.buffer)
  })
}

function validateImageFile(file: Express.Multer.File) {
  if (!allowedMimeTypes.has(file.mimetype)) throw new AppError('Only jpg, jpeg, png and webp images are allowed', 400)
  if (file.size > 5 * 1024 * 1024) throw new AppError('Each image must be 5MB or smaller', 400)
}

function mimeExtension(mimetype: string) {
  if (mimetype === 'image/png') return 'png'
  if (mimetype === 'image/webp') return 'webp'
  return 'jpg'
}

function getString(value: unknown, fallback?: unknown) {
  const selected = value ?? fallback
  return typeof selected === 'string' ? selected.trim() : selected == null ? undefined : String(selected)
}
