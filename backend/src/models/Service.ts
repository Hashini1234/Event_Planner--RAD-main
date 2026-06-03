import { Schema, model, Types } from 'mongoose'
import { vendorCategories } from './Vendor.js'

const serviceSchema = new Schema(
  {
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true, index: true },
    ownerId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    serviceName: { type: String, required: true, trim: true },
    category: { type: String, enum: vendorCategories, required: true, index: true },
    description: String,
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'LKR' },
      priceUnit: { type: String, default: 'package' },
    },
    inclusions: [String],
    images: [String],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

serviceSchema.index({ serviceName: 'text', description: 'text' })

export const ServiceModel = model('Service', serviceSchema)
