import { Schema, model, Types } from 'mongoose'
import { sriLankaDistricts } from './Event.js'

export const vendorCategories = [
  'Photography',
  'Catering',
  'Decoration',
  'Music / DJ',
  'Makeup',
  'Bridal Dressing',
  'Event Hall',
  'Hotels',
  'Cake Designers',
  'Florists',
] as const

const packageSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    inclusions: [String],
  },
  { _id: false },
)

const vendorSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    ownerId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    vendorName: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    category: { type: String, enum: vendorCategories, required: true, index: true },
    description: String,
    district: { type: String, enum: sriLankaDistricts, required: true, index: true },
    city: { type: String, required: true, index: true },
    address: String,
    pricing: { type: Number, default: 0, min: 0 },
    images: [String],
    packages: [packageSchema],
    availability: [{ type: Date }],
    averageRating: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [{ type: Types.ObjectId, ref: 'Review' }],
    verified: { type: Boolean, default: false, index: true },
    approvedAt: Date,
    bankAccountLast4: String,
  },
  { timestamps: true },
)

vendorSchema.pre('validate', function normalizeVendorFields(next) {
  this.businessName ??= this.vendorName
  this.vendorName ??= this.businessName
  this.city ??= this.district
  this.district ??= this.city as (typeof sriLankaDistricts)[number]
  this.ownerId ??= this.owner
  this.owner ??= this.ownerId
  this.ratings ??= this.averageRating
  next()
})

vendorSchema.index({ vendorName: 'text', businessName: 'text', description: 'text', city: 'text', district: 'text' })

export const VendorModel = model('Vendor', vendorSchema)
