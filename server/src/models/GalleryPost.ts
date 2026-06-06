import { Schema, model, Types } from 'mongoose'
import { eventTypes } from './Event.js'

export const galleryBudgetRanges = ['Under LKR 100,000', 'LKR 100,000 - 500,000', 'Above LKR 500,000'] as const

const galleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
  },
  { _id: false },
)

const galleryCommentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
)

const galleryPostSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    eventId: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    eventType: { type: String, enum: eventTypes, required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 120, index: true },
    budgetRange: { type: String, enum: galleryBudgetRanges, required: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 2500 },
    images: { type: [galleryImageSchema], default: [] },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    comments: { type: [galleryCommentSchema], default: [] },
    status: { type: String, enum: ['active', 'pending', 'hidden'], default: 'active', index: true },
  },
  { timestamps: true },
)

galleryPostSchema.index({ title: 'text', location: 'text', description: 'text' })

export const GalleryPostModel = model('GalleryPost', galleryPostSchema)
