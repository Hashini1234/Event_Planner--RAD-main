import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { authRouter } from './auth.routes.js'
import {
  aiRecommend,
  approveVendor,
  checkInGuest,
  createBooking,
  createEvent,
  createGuest,
  createPayment,
  createReview,
  createVendor,
  deleteEvent,
  getEvent,
  listEvents,
  listMyEvents,
  listVendors,
  updateEvent,
  updateBookingStatus,
  upsertBudget,
} from '../controllers/resource.controllers.js'
import { eventRules } from '../validators/event.validator.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, service: 'CelebrateLK API', uptime: process.uptime() })
})

router.use('/auth', authRouter)

router.get('/vendors', asyncHandler(listVendors))
router.post('/vendors', authenticate, authorize('vendor', 'admin'), upload.array('images', 8), asyncHandler(createVendor))
router.patch('/vendors/:id/approve', authenticate, authorize('admin'), asyncHandler(approveVendor))

router.get('/events', authenticate, asyncHandler(listEvents))
router.get('/events/user/my-events', authenticate, authorize('customer', 'admin'), asyncHandler(listMyEvents))
router.get('/events/:id', authenticate, asyncHandler(getEvent))
router.post('/events', authenticate, authorize('customer'), upload.single('eventImage'), eventRules, validateRequest, asyncHandler(createEvent))
router.put('/events/:id', authenticate, authorize('customer', 'admin'), upload.single('eventImage'), eventRules, validateRequest, asyncHandler(updateEvent))
router.delete('/events/:id', authenticate, authorize('customer', 'admin'), asyncHandler(deleteEvent))

router.post('/budgets', authenticate, authorize('customer', 'admin'), asyncHandler(upsertBudget))

router.post('/bookings', authenticate, authorize('customer', 'admin'), asyncHandler(createBooking))
router.patch('/bookings/:id/status', authenticate, authorize('vendor', 'admin'), asyncHandler(updateBookingStatus))

router.post('/guests', authenticate, authorize('customer', 'admin'), asyncHandler(createGuest))
router.patch('/guests/check-in/:token', asyncHandler(checkInGuest))

router.post('/payments/intent', authenticate, authorize('customer', 'admin'), asyncHandler(createPayment))
router.post('/reviews', authenticate, authorize('customer'), asyncHandler(createReview))
router.post('/ai/recommendations', authenticate, asyncHandler(aiRecommend))
