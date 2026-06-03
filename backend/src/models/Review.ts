import { Schema, model, Types } from 'mongoose'

const reviewSchema = new Schema(
  {
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true, index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true },
    booking: { type: Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1200 },
    status: { type: String, enum: ['published', 'flagged', 'hidden'], default: 'published' },
  },
  { timestamps: true },
)

reviewSchema.index({ vendor: 1, customer: 1, booking: 1 }, { unique: true })

export const ReviewModel = model('Review', reviewSchema)
