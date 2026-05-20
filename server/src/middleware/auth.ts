import type { NextFunction, Request, Response } from 'express'
import { UserModel, type Role } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/tokens.js'

declare global {
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
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) throw new AppError('Authentication required', 401)

  const payload = verifyAccessToken(token)
  const user = await UserModel.findById(payload.sub).select('_id role isActive')
  if (!user || !user.isActive) throw new AppError('Invalid authentication token', 401)

  req.user = { id: user.id, role: user.role }
  next()
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403)
    }
    next()
  }
}
