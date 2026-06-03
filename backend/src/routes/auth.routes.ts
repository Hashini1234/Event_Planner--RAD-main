import { Router } from 'express'
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validation/auth.validation.js'

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), asyncHandler(register))
authRouter.post('/login', validate(loginSchema), asyncHandler(login))
authRouter.get('/me', authenticate, asyncHandler(me))
authRouter.post('/refresh', asyncHandler(refresh))
authRouter.post('/logout', logout)
authRouter.post('/verify-email', asyncHandler(verifyEmail))
authRouter.post('/forgot-password', asyncHandler(forgotPassword))
authRouter.post('/reset-password', asyncHandler(resetPassword))
