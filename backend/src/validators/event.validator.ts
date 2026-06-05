import { body } from 'express-validator'

export const eventRules = [
  body('eventTitle').trim().isLength({ min: 3, max: 120 }).withMessage('Event title must be 3-120 characters'),
  body('eventType').isIn(['Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary', 'Party', 'Other']),
  body('eventDate').isISO8601().withMessage('Event date is required'),
  body('startTime').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Start time must use HH:mm format'),
  body('endTime')
    .optional({ checkFalsy: true })
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('End time must use HH:mm format')
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime && req.body.startTime >= endTime) {
        throw new Error('End time must be after start time')
      }
      return true
    }),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('district').trim().notEmpty().withMessage('District is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('description').optional({ checkFalsy: true }).isLength({ max: 2000 }),
  body('theme').optional({ checkFalsy: true }).isLength({ max: 80 }),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive amount'),
  body('status').optional().isIn(['Planning', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled']),
  body('notes').optional({ checkFalsy: true }).isLength({ max: 2000 }),
]
