import { Schema, model, Types } from 'mongoose'

const paymentSchema = new Schema(
  {
    booking: { type: Types.ObjectId, ref: 'Booking', required: true, index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'lkr' },
    stripePaymentIntentId: { type: String, index: true },
    invoiceUrl: String,
    status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
    refundedAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const PaymentModel = model('Payment', paymentSchema)
