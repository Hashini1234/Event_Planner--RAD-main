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
  createEventPackage,
  createReview,
  createVendor,
  deleteEventPackage,
  deleteVendor,
  deleteBudgetItem,
  deleteEvent,
  deleteGuest,
  getVendor,
  getEventPackage,
  getEvent,
  listBudgetItems,
  listBudgetSummary,
  listEvents,
  listEventPackages,
  listBookings,
  listMyEvents,
  listGuests,
  listMyBookings,
  listNotifications,
  listVendorReviews,
  listVendors,
  markNotificationRead,
  recommendVendors,
  updateEvent,
  updateEventPackage,
  updateVendor,
  updateBudgetItem,
  updateBookingStatus,
  updateGuest,
  upsertBudget,
} from '../controllers/resource.controllers.js'
import { eventRules } from '../validators/event.validator.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  addGalleryComment,
  createGalleryPost,
  deleteGalleryComment,
  deleteGalleryPost,
  getGalleryPost,
  listGalleryPosts,
  toggleGalleryLike,
  updateGalleryPost,
} from '../controllers/gallery.controller.js'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, service: 'CelebrateLK API', uptime: process.uptime() })
})

router.use('/auth', authRouter)

router.get('/gallery', asyncHandler(listGalleryPosts))
router.get('/gallery/:id', asyncHandler(getGalleryPost))
router.post('/gallery', authenticate, authorize('customer'), upload.array('images', 8), asyncHandler(createGalleryPost))
router.put('/gallery/:id', authenticate, authorize('customer', 'admin'), upload.array('images', 8), asyncHandler(updateGalleryPost))
router.delete('/gallery/:id', authenticate, authorize('customer', 'admin'), asyncHandler(deleteGalleryPost))
router.post('/gallery/:id/like', authenticate, authorize('customer', 'admin'), asyncHandler(toggleGalleryLike))
router.post('/gallery/:id/comments', authenticate, authorize('customer', 'admin'), asyncHandler(addGalleryComment))
router.delete('/gallery/:id/comments/:commentId', authenticate, authorize('customer', 'admin'), asyncHandler(deleteGalleryComment))

router.get('/vendors', asyncHandler(listVendors))
router.get('/vendors/:id', asyncHandler(getVendor))
router.get('/vendors/:id/reviews', asyncHandler(listVendorReviews))
router.post('/vendors', authenticate, authorize('vendor', 'admin'), upload.array('images', 8), asyncHandler(createVendor))
router.put('/vendors/:id', authenticate, authorize('admin'), asyncHandler(updateVendor))
router.delete('/vendors/:id', authenticate, authorize('admin'), asyncHandler(deleteVendor))
router.patch('/vendors/:id/approve', authenticate, authorize('admin'), asyncHandler(approveVendor))

router.get('/event-packages', asyncHandler(listEventPackages))
router.get('/event-packages/:id', asyncHandler(getEventPackage))
router.post('/event-packages', authenticate, authorize('admin'), asyncHandler(createEventPackage))
router.put('/event-packages/:id', authenticate, authorize('admin'), asyncHandler(updateEventPackage))
router.delete('/event-packages/:id', authenticate, authorize('admin'), asyncHandler(deleteEventPackage))

router.get('/events', authenticate, authorize('admin'), asyncHandler(listEvents))
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
router.get('/bookings', authenticate, authorize('admin'), asyncHandler(listBookings))
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
router.get('/reviews/vendor/:vendorId', asyncHandler(listVendorReviews))
router.post('/ai/recommendations', authenticate, asyncHandler(aiRecommend))
router.post('/ai/vendor-recommendations', authenticate, authorize('customer', 'admin'), asyncHandler(recommendVendors))
router.get('/notifications', authenticate, asyncHandler(listNotifications))
router.patch('/notifications/:id/read', authenticate, asyncHandler(markNotificationRead))
