import { Router } from 'express'
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validation/auth.validation.js'

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)
