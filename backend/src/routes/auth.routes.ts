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
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validation/auth.validation.js'

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.get('/me', authenticate, me)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)
