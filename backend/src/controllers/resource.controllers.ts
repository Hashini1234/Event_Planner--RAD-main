import crypto from 'crypto'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { AiRecommendationModel } from '../models/AiRecommendation.js'
import { BookingModel } from '../models/Booking.js'
import { BudgetModel } from '../models/Budget.js'
import { EventModel } from '../models/Event.js'
import { GuestModel } from '../models/Guest.js'
import { NotificationModel } from '../models/Notification.js'
import { PaymentModel } from '../models/Payment.js'
import { ReviewModel } from '../models/Review.js'
import { VendorModel } from '../models/Vendor.js'
import { AppError } from '../utils/AppError.js'
import { generatePlanningRecommendation } from '../services/ai.service.js'
import { createNotification } from '../services/notification.service.js'
import { createPaymentIntent } from '../services/payment.service.js'

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}

export async function listVendors(req: Request, res: Response) {
  if (mongoose.connection.readyState !== 1) {
    res.json({ success: true, data: { items: [], total: 0, page: Number(req.query.page ?? '1') } })
    return
  }

  const { q, category, city, district, location, minPrice, maxPrice, minRating, page = '1', limit = '12' } = req.query
  const filter: Record<string, unknown> = { verified: true }
  if (category) filter.category = category
  const selectedLocation = city ?? district ?? location
  if (selectedLocation) {
    filter.$or = [
      { city: new RegExp(String(selectedLocation), 'i') },
      { district: new RegExp(String(selectedLocation), 'i') },
    ]
  }
  if (minPrice || maxPrice) {
    filter.pricing = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    }
  }
  if (minRating) filter.averageRating = { $gte: Number(minRating) }
  if (q) filter.$text = { $search: String(q) }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    VendorModel.find(filter).skip(skip).limit(Number(limit)).sort({ averageRating: -1 }),
    VendorModel.countDocuments(filter),
  ])
  res.json({ success: true, data: { items, total, page: Number(page) } })
}

export async function getVendor(req: Request, res: Response) {
  const vendor = await VendorModel.findById(req.params.id).populate('reviews')
  if (!vendor || !vendor.verified) throw new AppError('Vendor not found', 404)
  res.json({ success: true, data: vendor })
}

export async function createVendor(req: Request, res: Response) {
  const vendor = await VendorModel.create({ ...req.body, owner: req.user!.id, ownerId: req.user!.id })
  res.status(201).json({ success: true, data: vendor })
}

export async function approveVendor(req: Request, res: Response) {
  const vendor = await VendorModel.findByIdAndUpdate(
    req.params.id,
    { verified: true, approvedAt: new Date() },
    { new: true },
  )
  if (!vendor) throw new AppError('Vendor not found', 404)
  res.json({ success: true, data: vendor })
}

export async function createEvent(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    throw new AppError('MongoDB is not connected. Set MONGODB_URI in backend/.env and restart the API to create events.', 503)
  }
  const payload = buildEventPayload(req, req.user!.id)
  const event = await EventModel.create(payload)
  res.status(201).json({ success: true, data: event })
}

export async function listEvents(req: Request, res: Response) {
  if (mongoose.connection.readyState !== 1) {
    res.json({ success: true, data: { items: [], total: 0, page: Number(req.query.page ?? '1') } })
    return
  }

  const { search, eventType, status, page = '1', limit = '10' } = req.query
  const filter: Record<string, unknown> = req.user!.role === 'admin' ? {} : { createdBy: req.user!.id }
  if (eventType) filter.eventType = eventType
  if (status) filter.status = status
  if (search) filter.$text = { $search: String(search) }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    EventModel.find(filter).populate('selectedVendors').skip(skip).limit(Number(limit)).sort({ eventDate: 1 }),
    EventModel.countDocuments(filter),
  ])
  res.json({ success: true, data: { items, total, page: Number(page) } })
}

export async function listMyEvents(req: Request, res: Response) {
  if (mongoose.connection.readyState !== 1) {
    res.json({ success: true, data: [] })
    return
  }

  const events = await EventModel.find({ createdBy: req.user!.id }).populate('selectedVendors').sort({ eventDate: 1 })
  res.json({ success: true, data: events })
}

export async function getEvent(req: Request, res: Response) {
  const event = await EventModel.findById(req.params.id).populate('selectedVendors')
  if (!event) throw new AppError('Event not found', 404)
  if (req.user!.role !== 'admin' && String(event.createdBy) !== req.user!.id) {
    throw new AppError('You can only view your own events', 403)
  }
  res.json({ success: true, data: event })
}

export async function updateEvent(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    throw new AppError('MongoDB is not connected. Set MONGODB_URI in backend/.env and restart the API to update events.', 503)
  }
  const event = await EventModel.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)
  if (req.user!.role !== 'admin' && String(event.createdBy) !== req.user!.id) {
    throw new AppError('You can only update your own events', 403)
  }
  Object.assign(event, buildEventPayload(req, req.user!.id, event))
  await event.save()
  res.json({ success: true, data: event })
}

export async function deleteEvent(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    throw new AppError('MongoDB is not connected. Set MONGODB_URI in backend/.env and restart the API to delete events.', 503)
  }
  const event = await EventModel.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)
  if (req.user!.role !== 'admin' && String(event.createdBy) !== req.user!.id) {
    throw new AppError('You can only delete your own events', 403)
  }
  await event.deleteOne()
  res.json({ success: true, data: { id: req.params.id } })
}

export async function upsertBudget(req: Request, res: Response) {
  const item = await BudgetModel.create(req.body)
  res.status(201).json({ success: true, data: item })
}

export async function createBooking(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to create bookings', 503)
  const event = await EventModel.findById(req.body.event)
  if (!event) throw new AppError('Event not found', 404)
  if (String(event.createdBy) !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('You can only book vendors for your own events', 403)
  }

  const vendor = await VendorModel.findById(req.body.vendor)
  if (!vendor || !vendor.verified) throw new AppError('Vendor not found', 404)

  const bookingDate = new Date(req.body.date ?? event.eventDate)
  const bookingDateKey = bookingDate.toISOString().slice(0, 10)
  const duplicate = await BookingModel.findOne({
    vendor: vendor.id,
    bookingDateKey,
    status: { $in: ['pending', 'accepted', 'paid', 'completed'] },
  })
  if (duplicate) throw new AppError('This vendor already has an active booking on this date', 409)

  const packageTitle = req.body.packageTitle ?? vendor.packages?.[0]?.title ?? 'Standard package'
  const amount = Number(req.body.amount ?? vendor.packages?.[0]?.price ?? vendor.pricing ?? 0)
  const booking = await BookingModel.create({
    event: event.id,
    customer: req.user!.id,
    vendor: vendor.id,
    packageTitle,
    amount,
    date: bookingDate,
    notes: req.body.notes,
  })
  await createNotification({
    user: req.user!.id,
    title: 'Booking request sent',
    message: 'Your vendor booking request is now pending review.',
    type: 'booking',
    metadata: { bookingId: booking.id },
  })
  res.status(201).json({ success: true, data: booking })
}

export async function listMyBookings(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: [] })
    return
  }
  const bookings = await BookingModel.find({ customer: req.user!.id })
    .populate('event', 'eventTitle eventDate venue district budget')
    .populate('vendor', 'vendorName businessName category city district pricing averageRating images')
    .sort({ createdAt: -1 })
  res.json({ success: true, data: bookings })
}

export async function cancelBooking(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to cancel bookings', 503)
  const booking = await BookingModel.findOne({ _id: req.params.id, customer: req.user!.id })
  if (!booking) throw new AppError('Booking not found', 404)
  if (booking.status !== 'pending') throw new AppError('Only pending bookings can be cancelled', 400)
  booking.status = 'cancelled'
  await booking.save()
  await createNotification({
    user: req.user!.id,
    title: 'Booking cancelled',
    message: 'Your pending vendor booking was cancelled.',
    type: 'booking',
    metadata: { bookingId: booking.id },
  })
  res.json({ success: true, data: booking })
}

export async function updateBookingStatus(req: Request, res: Response) {
  const booking = await BookingModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!booking) throw new AppError('Booking not found', 404)
  res.json({ success: true, data: booking })
}

export async function createGuest(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage guests', 503)
  await assertOwnEvent(req.body.event, req.user!.id, req.user!.role)
  const guest = await GuestModel.create({ ...req.body, qrToken: crypto.randomBytes(16).toString('hex') })
  res.status(201).json({ success: true, data: guest })
}

export async function listGuests(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: [] })
    return
  }
  await assertOwnEvent(String(req.query.event), req.user!.id, req.user!.role)
  const guests = await GuestModel.find({ event: req.query.event }).sort({ createdAt: -1 })
  res.json({ success: true, data: guests })
}

export async function updateGuest(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage guests', 503)
  const guest = await GuestModel.findById(req.params.id)
  if (!guest) throw new AppError('Guest not found', 404)
  await assertOwnEvent(String(guest.event), req.user!.id, req.user!.role)
  Object.assign(guest, req.body)
  await guest.save()
  res.json({ success: true, data: guest })
}

export async function deleteGuest(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage guests', 503)
  const guest = await GuestModel.findById(req.params.id)
  if (!guest) throw new AppError('Guest not found', 404)
  await assertOwnEvent(String(guest.event), req.user!.id, req.user!.role)
  await guest.deleteOne()
  res.json({ success: true, data: { id: req.params.id } })
}

export async function checkInGuest(req: Request, res: Response) {
  const guest = await GuestModel.findOneAndUpdate(
    { qrToken: req.params.token },
    { checkedIn: true, checkedInAt: new Date() },
    { new: true },
  )
  if (!guest) throw new AppError('Guest not found', 404)
  res.json({ success: true, data: guest })
}

export async function createPayment(req: Request, res: Response) {
  const intent = await createPaymentIntent({ ...req.body, customerId: req.user!.id })
  const payment = await PaymentModel.create({
    booking: req.body.bookingId,
    customer: req.user!.id,
    vendor: req.body.vendor,
    amount: req.body.amount,
    stripePaymentIntentId: intent.id,
  })
  res.status(201).json({ success: true, data: { payment, intent } })
}

export async function createReview(req: Request, res: Response) {
  const review = await ReviewModel.create({ ...req.body, customer: req.user!.id })
  res.status(201).json({ success: true, data: review })
}

export async function aiRecommend(req: Request, res: Response) {
  const response = await generatePlanningRecommendation(req.body.prompt)
  const record = await AiRecommendationModel.create({
    user: req.user!.id,
    event: req.body.event,
    type: req.body.type ?? 'planning',
    prompt: req.body.prompt,
    response,
    model: process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'fallback',
  })
  res.json({ success: true, data: record })
}

export async function listBudgetItems(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: { items: [], totalSpent: 0, remaining: 0, budget: 0, warning: null } })
    return
  }
  await assertOwnEvent(String(req.query.event), req.user!.id, req.user!.role)
  const items = await BudgetModel.find({ event: req.query.event }).populate('vendor', 'vendorName businessName category')
  const event = await EventModel.findById(req.query.event)
  const totalSpent = items.reduce((sum, item) => sum + Number(item.actualAmount || item.plannedAmount || 0), 0)
  const remaining = Number(event?.budget ?? 0) - totalSpent
  res.json({
    success: true,
    data: {
      items,
      totalSpent,
      remaining,
      budget: Number(event?.budget ?? 0),
      warning: remaining < 0 ? 'Budget exceeded' : remaining <= Number(event?.budget ?? 0) * 0.1 ? 'Budget almost exhausted' : null,
    },
  })
}

export async function createBudgetItem(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage budget items', 503)
  await assertOwnEvent(req.body.event, req.user!.id, req.user!.role)
  const item = await BudgetModel.create(req.body)
  res.status(201).json({ success: true, data: item })
}

export async function updateBudgetItem(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage budget items', 503)
  const item = await BudgetModel.findById(req.params.id)
  if (!item) throw new AppError('Expense not found', 404)
  await assertOwnEvent(String(item.event), req.user!.id, req.user!.role)
  Object.assign(item, req.body)
  await item.save()
  res.json({ success: true, data: item })
}

export async function deleteBudgetItem(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to manage budget items', 503)
  const item = await BudgetModel.findById(req.params.id)
  if (!item) throw new AppError('Expense not found', 404)
  await assertOwnEvent(String(item.event), req.user!.id, req.user!.role)
  await item.deleteOne()
  res.json({ success: true, data: { id: req.params.id } })
}

export async function listNotifications(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: [] })
    return
  }
  const notifications = await NotificationModel.find({ user: req.user!.id }).sort({ createdAt: -1 }).limit(50)
  res.json({ success: true, data: notifications })
}

export async function markNotificationRead(req: Request, res: Response) {
  if (!isDatabaseConnected()) throw new AppError('MongoDB is required to update notifications', 503)
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    { readAt: new Date() },
    { new: true },
  )
  if (!notification) throw new AppError('Notification not found', 404)
  res.json({ success: true, data: notification })
}

export async function recommendVendors(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    res.json({ success: true, data: [] })
    return
  }
  const event = await assertOwnEvent(req.body.eventId, req.user!.id, req.user!.role)
  const eventBudget = Number(req.body.budget ?? event.budget ?? 0)
  const typeCategoryMap: Record<string, string[]> = {
    Wedding: ['Photography', 'Catering', 'Decoration', 'Makeup', 'Bridal Dressing', 'Florists', 'Hotels', 'Event Hall'],
    Engagement: ['Photography', 'Decoration', 'Makeup', 'Cake Designers'],
    Birthday: ['Catering', 'Decoration', 'Cake Designers', 'Music / DJ'],
    Corporate: ['Photography', 'Catering', 'Hotels', 'Event Hall', 'Music / DJ'],
    Party: ['Music / DJ', 'Catering', 'Decoration'],
    Anniversary: ['Photography', 'Catering', 'Decoration', 'Florists'],
    Other: [],
  }
  const eventType = String(event.eventType)
  const preferredCategories = typeCategoryMap[eventType] ?? []
  const vendors = await VendorModel.find({
    verified: true,
    ...(preferredCategories.length ? { category: { $in: preferredCategories } } : {}),
    pricing: { $lte: Math.max(eventBudget * 0.35, 1) },
    averageRating: { $gte: Number(req.body.minRating ?? 3.5) },
  })
    .sort({ averageRating: -1, pricing: 1 })
    .limit(8)

  const recommendations = vendors.map((vendor) => ({
    vendor,
    score:
      Math.round(
        ((Number(vendor.averageRating || 0) * 18 +
          Math.max(0, 100 - (Number(vendor.pricing) / Math.max(eventBudget, 1)) * 100)) *
          10),
      ) / 10,
    reason: `${vendor.category} match for ${eventType}, rating ${vendor.averageRating || 0}, within your event budget.`,
  }))
  res.json({ success: true, data: recommendations })
}

async function assertOwnEvent(eventId: string, userId: string, role: string) {
  if (!eventId) throw new AppError('Event is required', 400)
  const event = await EventModel.findById(eventId)
  if (!event) throw new AppError('Event not found', 404)
  if (role !== 'admin' && String(event.createdBy) !== userId) {
    throw new AppError('You can only manage your own event records', 403)
  }
  return event
}

function buildEventPayload(req: Request, userId: string, existing?: any) {
  const eventTitle = getString(req.body.eventTitle, existing?.eventTitle)
  const eventType = getString(req.body.eventType, existing?.eventType)
  const eventDate = parseEventDate(req.body.eventDate ?? existing?.eventDate)
  const startTime = getString(req.body.startTime, existing?.startTime)
  const endTime = getString(req.body.endTime, existing?.endTime)
  const guestCount = Number(req.body.guestCount ?? existing?.guestCount ?? 0)
  const budget = Number(req.body.budget ?? existing?.budget ?? 0)

  if (!eventTitle || eventTitle.length < 3) throw new AppError('Event title must be at least 3 characters', 400)
  if (!eventType) throw new AppError('Event type is required', 400)
  if (!eventDate) throw new AppError('Event date must be a valid date', 400)
  if (startTime && !isValidTime(startTime)) throw new AppError('Start time must use HH:mm format', 400)
  if (endTime && !isValidTime(endTime)) throw new AppError('End time must use HH:mm format', 400)
  if (startTime && endTime && startTime >= endTime) throw new AppError('End time must be after start time', 400)
  if (!Number.isFinite(guestCount) || guestCount < 1) throw new AppError('Guest count must be at least 1', 400)
  if (!Number.isFinite(budget) || budget < 0) throw new AppError('Budget must be a positive amount', 400)

  const description = getString(req.body.description, existing?.description)
  const theme = getString(req.body.theme, existing?.theme)

  return {
    ...req.body,
    customer: existing?.customer ?? userId,
    createdBy: existing?.createdBy ?? userId,
    eventTitle,
    title: eventTitle,
    eventType,
    type: eventType,
    eventDate,
    date: eventDate,
    startTime,
    endTime,
    time: startTime,
    venue: getString(req.body.venue, existing?.venue),
    district: getString(req.body.district, existing?.district),
    guestCount,
    budget,
    description,
    eventDescription: description,
    theme,
    eventTheme: theme,
    status: getString(req.body.status, existing?.status) || 'Planning',
    notes: getString(req.body.notes, existing?.notes),
    eventImage: req.file ? `/uploads/${req.file.filename}` : req.body.eventImage ?? existing?.eventImage,
  }
}

function getString(value: unknown, fallback?: unknown) {
  const selected = value ?? fallback
  return typeof selected === 'string' ? selected.trim() : selected == null ? undefined : String(selected)
}

function parseEventDate(value: unknown) {
  if (!value) return null
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}
