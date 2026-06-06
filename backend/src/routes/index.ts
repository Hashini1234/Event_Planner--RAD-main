import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { authRouter } from './auth.routes.js'
import {
  aiRecommend,
  approveVendor,
  cancelBooking,
  checkInGuest,
  createBudgetItem,
  createBooking,
  createEvent,
  createGuest,
  createPayment,
  createReview,
  createVendor,
  deleteBudgetItem,
  deleteEvent,
  deleteGuest,
  getVendor,
  getEvent,
  listBudgetItems,
  listBudgetSummary,
  listEvents,
  listMyEvents,
  listGuests,
  listMyBookings,
  listNotifications,
  listVendors,
  markNotificationRead,
  recommendVendors,
  updateEvent,
  updateBudgetItem,
  updateBookingStatus,
  updateGuest,
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
router.get('/vendors/:id', asyncHandler(getVendor))
router.post('/vendors', authenticate, authorize('vendor', 'admin'), upload.array('images', 8), asyncHandler(createVendor))
router.patch('/vendors/:id/approve', authenticate, authorize('admin'), asyncHandler(approveVendor))

router.get('/events', authenticate, asyncHandler(listEvents))
router.get('/events/user/my-events', authenticate, authorize('customer', 'admin'), asyncHandler(listMyEvents))
router.get('/events/:id', authenticate, asyncHandler(getEvent))
router.post('/events', authenticate, authorize('customer'), upload.single('eventImage'), eventRules, validateRequest, asyncHandler(createEvent))
router.put('/events/:id', authenticate, authorize('customer', 'admin'), upload.single('eventImage'), eventRules, validateRequest, asyncHandler(updateEvent))
router.delete('/events/:id', authenticate, authorize('customer', 'admin'), asyncHandler(deleteEvent))

router.post('/budgets', authenticate, authorize('customer', 'admin'), asyncHandler(upsertBudget))
router.get('/budget-items', authenticate, authorize('customer', 'admin'), asyncHandler(listBudgetItems))
router.get('/budget-items/summary', authenticate, authorize('customer', 'admin'), asyncHandler(listBudgetSummary))
router.post('/budget-items', authenticate, authorize('customer', 'admin'), asyncHandler(createBudgetItem))
router.put('/budget-items/:id', authenticate, authorize('customer', 'admin'), asyncHandler(updateBudgetItem))
router.delete('/budget-items/:id', authenticate, authorize('customer', 'admin'), asyncHandler(deleteBudgetItem))

router.post('/bookings', authenticate, authorize('customer', 'admin'), asyncHandler(createBooking))
router.get('/bookings/my', authenticate, authorize('customer', 'admin'), asyncHandler(listMyBookings))
router.patch('/bookings/:id/cancel', authenticate, authorize('customer', 'admin'), asyncHandler(cancelBooking))
router.patch('/bookings/:id/status', authenticate, authorize('vendor', 'admin'), asyncHandler(updateBookingStatus))

router.get('/guests', authenticate, authorize('customer', 'admin'), asyncHandler(listGuests))
router.post('/guests', authenticate, authorize('customer', 'admin'), asyncHandler(createGuest))
router.put('/guests/:id', authenticate, authorize('customer', 'admin'), asyncHandler(updateGuest))
router.delete('/guests/:id', authenticate, authorize('customer', 'admin'), asyncHandler(deleteGuest))
router.patch('/guests/check-in/:token', asyncHandler(checkInGuest))

router.post('/payments/intent', authenticate, authorize('customer', 'admin'), asyncHandler(createPayment))
router.post('/reviews', authenticate, authorize('customer'), asyncHandler(createReview))
router.post('/ai/recommendations', authenticate, asyncHandler(aiRecommend))
router.post('/ai/vendor-recommendations', authenticate, authorize('customer', 'admin'), asyncHandler(recommendVendors))
router.get('/notifications', authenticate, asyncHandler(listNotifications))
router.patch('/notifications/:id/read', authenticate, asyncHandler(markNotificationRead))
