import { Schema, model, Types } from 'mongoose'

const notificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'payment', 'vendor', 'system', 'rsvp'], required: true },
    readAt: Date,
    channel: { type: String, enum: ['in-app', 'email', 'sms'], default: 'in-app' },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true },
)

export const NotificationModel = model('Notification', notificationSchema)
