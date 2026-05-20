import { Schema, model, Types } from 'mongoose'

const bookingSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true, index: true },
    packageTitle: String,
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'paid', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    notes: String,
    contractUrl: String,
  },
  { timestamps: true },
)

export const BookingModel = model('Booking', bookingSchema)
