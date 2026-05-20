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

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, service: 'CelebrateLK API', uptime: process.uptime() })
})

router.use('/auth', authRouter)

router.get('/vendors', listVendors)
router.post('/vendors', authenticate, authorize('vendor', 'admin'), upload.array('images', 8), createVendor)
router.patch('/vendors/:id/approve', authenticate, authorize('admin'), approveVendor)

router.get('/events', authenticate, listEvents)
router.get('/events/user/my-events', authenticate, authorize('customer', 'admin'), listMyEvents)
router.get('/events/:id', authenticate, getEvent)
router.post('/events', authenticate, authorize('customer'), upload.single('eventImage'), eventRules, validateRequest, createEvent)
router.put('/events/:id', authenticate, authorize('customer', 'admin'), upload.single('eventImage'), eventRules, validateRequest, updateEvent)
router.delete('/events/:id', authenticate, authorize('customer', 'admin'), deleteEvent)

router.post('/budgets', authenticate, authorize('customer', 'admin'), upsertBudget)

router.post('/bookings', authenticate, authorize('customer', 'admin'), createBooking)
router.patch('/bookings/:id/status', authenticate, authorize('vendor', 'admin'), updateBookingStatus)

router.post('/guests', authenticate, authorize('customer', 'admin'), createGuest)
router.patch('/guests/check-in/:token', checkInGuest)

router.post('/payments/intent', authenticate, authorize('customer', 'admin'), createPayment)
router.post('/reviews', authenticate, authorize('customer'), createReview)
router.post('/ai/recommendations', authenticate, aiRecommend)
