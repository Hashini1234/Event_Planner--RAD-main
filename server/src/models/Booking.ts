import { Schema, model, Types } from 'mongoose'

const bookingSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    eventId: { type: Types.ObjectId, ref: 'Event', index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    customerId: { type: Types.ObjectId, ref: 'User', index: true },
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true, index: true },
    vendorId: { type: Types.ObjectId, ref: 'Vendor', index: true },
    packageId: String,
    packageTitle: String,
    packageName: String,
    packagePrice: { type: Number, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    eventDate: { type: Date },
    bookingDateKey: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'paid', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    notes: String,
    customerNote: String,
    contractUrl: String,
  },
  { timestamps: true },
)

bookingSchema.pre('validate', function normalizeBookingDate(next) {
  const booking = this as any
  booking.event ??= booking.eventId
  booking.eventId ??= booking.event
  booking.customer ??= booking.customerId
  booking.customerId ??= booking.customer
  booking.vendor ??= booking.vendorId
  booking.vendorId ??= booking.vendor
  booking.packageTitle ??= booking.packageName
  booking.packageName ??= booking.packageTitle
  booking.amount ??= booking.packagePrice
  booking.packagePrice ??= booking.amount
  booking.notes ??= booking.customerNote
  booking.customerNote ??= booking.notes
  booking.date ??= booking.eventDate
  booking.eventDate ??= booking.date
  if (booking.date) booking.bookingDateKey = new Date(booking.date).toISOString().slice(0, 10)
  next()
})

bookingSchema.index(
  { customer: 1, vendor: 1, event: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'accepted', 'paid', 'completed'] },
    },
  },
)

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
