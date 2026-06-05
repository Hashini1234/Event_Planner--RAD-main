import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { UserModel, type Role } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/tokens.js'
import { findLocalUserById } from '../services/localAuthStore.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: Role
      }
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) throw new AppError('Authentication required', 401)

    const payload = verifyAccessToken(token)
    if (mongoose.connection.readyState !== 1) {
      const localUser = findLocalUserById(payload.sub)
      if (!localUser || !localUser.isActive) throw new AppError('Invalid authentication token', 401)
      req.user = { id: localUser.id, role: localUser.role }
      next()
      return
    }

    const user = await UserModel.findById(payload.sub).select('_id role isActive')
    if (!user || !user.isActive) throw new AppError('Invalid authentication token', 401)

    req.user = { id: user.id, role: user.role }
    next()
  } catch (error) {
    if (error instanceof Error && ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
      next(new AppError('Invalid or expired authentication token', 401))
      return
    }
    next(error)
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403)
    }
    next()
  }
}
