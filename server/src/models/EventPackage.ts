import { Schema, model } from 'mongoose'

export const packageCategories = ['Birthday', 'Wedding', 'Festival', 'Meetings', 'House Warming', 'Baby Shower', 'Other'] as const

const eventPackageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: packageCategories, required: true, index: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 2000 },
    image: String,
    inclusions: [String],
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

eventPackageSchema.index({ title: 'text', category: 'text', venue: 'text', location: 'text' })

export const EventPackageModel = model('EventPackage', eventPackageSchema)
