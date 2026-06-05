import { Schema, model, Types } from 'mongoose'

const bookingSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true, index: true },
    packageTitle: String,
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    bookingDateKey: { type: String, required: true, index: true },
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

bookingSchema.pre('validate', function normalizeBookingDate(next) {
  if (this.date) {
    this.bookingDateKey = new Date(this.date).toISOString().slice(0, 10)
  }
  next()
})

bookingSchema.index(
  { vendor: 1, bookingDateKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'accepted', 'paid', 'completed'] },
    },
  },
)

export const BookingModel = model('Booking', bookingSchema)
