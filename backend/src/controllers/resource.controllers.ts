import crypto from 'crypto'
import type { Request, Response } from 'express'
import { AiRecommendationModel } from '../models/AiRecommendation.js'
import { BookingModel } from '../models/Booking.js'
import { BudgetModel } from '../models/Budget.js'
import { EventModel } from '../models/Event.js'
import { GuestModel } from '../models/Guest.js'
import { PaymentModel } from '../models/Payment.js'
import { ReviewModel } from '../models/Review.js'
import { VendorModel } from '../models/Vendor.js'
import { AppError } from '../utils/AppError.js'
import { generatePlanningRecommendation } from '../services/ai.service.js'
import { createNotification } from '../services/notification.service.js'
import { createPaymentIntent } from '../services/payment.service.js'

export async function listVendors(req: Request, res: Response) {
  const { q, category, city, page = '1', limit = '12' } = req.query
  const filter: Record<string, unknown> = { verified: true }
  if (category) filter.category = category
  if (city) filter.city = city
  if (q) filter.$text = { $search: String(q) }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    VendorModel.find(filter).skip(skip).limit(Number(limit)).sort({ averageRating: -1 }),
    VendorModel.countDocuments(filter),
  ])
  res.json({ success: true, data: { items, total, page: Number(page) } })
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
  const event = await EventModel.create({
    ...req.body,
    customer: req.user!.id,
    createdBy: req.user!.id,
    title: req.body.eventTitle,
    type: req.body.eventType,
    date: req.body.eventDate,
    eventImage: req.file ? `/uploads/${req.file.filename}` : req.body.eventImage,
  })
  res.status(201).json({ success: true, data: event })
}

export async function listEvents(req: Request, res: Response) {
  const { search, eventType, status, page = '1', limit = '10' } = req.query
  const filter: Record<string, unknown> = req.user!.role === 'admin' ? {} : { createdBy: req.user!.id }
  if (eventType) filter.eventType = eventType
  if (status) filter.status = status
  if (search) filter.$text = { $search: String(search) }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    EventModel.find(filter).populate('vendors').skip(skip).limit(Number(limit)).sort({ eventDate: 1 }),
    EventModel.countDocuments(filter),
  ])
  res.json({ success: true, data: { items, total, page: Number(page) } })
}

export async function listMyEvents(req: Request, res: Response) {
  const events = await EventModel.find({ createdBy: req.user!.id }).populate('vendors').sort({ eventDate: 1 })
  res.json({ success: true, data: events })
}

export async function getEvent(req: Request, res: Response) {
  const event = await EventModel.findById(req.params.id).populate('vendors')
  if (!event) throw new AppError('Event not found', 404)
  if (req.user!.role !== 'admin' && String(event.createdBy) !== req.user!.id) {
    throw new AppError('You can only view your own events', 403)
  }
  res.json({ success: true, data: event })
}

export async function updateEvent(req: Request, res: Response) {
  const event = await EventModel.findById(req.params.id)
  if (!event) throw new AppError('Event not found', 404)
  if (req.user!.role !== 'admin' && String(event.createdBy) !== req.user!.id) {
    throw new AppError('You can only update your own events', 403)
  }
  Object.assign(event, {
    ...req.body,
    title: req.body.eventTitle ?? event.title,
    type: req.body.eventType ?? event.type,
    date: req.body.eventDate ?? event.date,
    eventImage: req.file ? `/uploads/${req.file.filename}` : req.body.eventImage ?? event.eventImage,
  })
  await event.save()
  res.json({ success: true, data: event })
}

export async function deleteEvent(req: Request, res: Response) {
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
  const booking = await BookingModel.create({ ...req.body, customer: req.user!.id })
  await createNotification({
    user: req.user!.id,
    title: 'Booking request sent',
    message: 'Your vendor booking request is now pending review.',
    type: 'booking',
    metadata: { bookingId: booking.id },
  })
  res.status(201).json({ success: true, data: booking })
}

export async function updateBookingStatus(req: Request, res: Response) {
  const booking = await BookingModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!booking) throw new AppError('Booking not found', 404)
  res.json({ success: true, data: booking })
}

export async function createGuest(req: Request, res: Response) {
  const guest = await GuestModel.create({ ...req.body, qrToken: crypto.randomBytes(16).toString('hex') })
  res.status(201).json({ success: true, data: guest })
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
