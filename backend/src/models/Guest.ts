import { Schema, model, Types } from 'mongoose'

const guestSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true },
    email: String,
    phone: String,
    group: String,
    plusOnes: { type: Number, default: 0 },
    rsvp: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending', index: true },
    qrToken: { type: String, required: true, unique: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date,
  },
  { timestamps: true },
)

export const GuestModel = model('Guest', guestSchema)
