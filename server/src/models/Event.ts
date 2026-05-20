import { Schema, model, Types } from 'mongoose'

export const sriLankaDistricts = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const

export const eventTypes = ['Wedding', 'Birthday', 'Engagement', 'Corporate', 'Party', 'Anniversary', 'Other'] as const

const timelineItemSchema = new Schema(
  {
    title: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    owner: String,
  },
  { _id: true },
)

const eventSchema = new Schema(
  {
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    eventTitle: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    eventType: { type: String, enum: eventTypes, required: true, index: true },
    type: { type: String, enum: eventTypes, required: true, index: true },
    eventDate: { type: Date, required: true, index: true },
    date: { type: Date, required: true, index: true },
    startTime: String,
    endTime: String,
    time: String,
    venue: { type: String, required: true, trim: true },
    district: { type: String, enum: sriLankaDistricts, required: true, index: true },
    guestCount: { type: Number, default: 0, min: 0 },
    description: { type: String, maxlength: 2000 },
    eventDescription: { type: String, maxlength: 2000 },
    theme: String,
    eventTheme: String,
    budget: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ['Planning', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Planning',
      index: true,
    },
    eventImage: String,
    notes: { type: String, maxlength: 2000 },
    selectedVendors: [{ type: Types.ObjectId, ref: 'Vendor' }],
    timeline: [timelineItemSchema],
  },
  { timestamps: true },
)

eventSchema.pre('validate', function normalizeEventFields(next) {
  this.title ??= this.eventTitle
  this.eventTitle ??= this.title
  this.type ??= this.eventType
  this.eventType ??= this.type
  this.date ??= this.eventDate
  this.eventDate ??= this.date
  this.time ??= this.startTime
  this.createdBy ??= this.customer
  this.eventDescription ??= this.description
  this.description ??= this.eventDescription
  this.eventTheme ??= this.theme
  this.theme ??= this.eventTheme
  next()
})

eventSchema.index({ eventTitle: 'text', eventDescription: 'text', eventTheme: 'text', district: 'text' })

export const EventModel = model('Event', eventSchema)
