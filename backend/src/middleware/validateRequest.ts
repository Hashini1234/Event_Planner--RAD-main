import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { AppError } from '../utils/AppError.js'

export function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    throw new AppError(result.array()[0]?.msg ?? 'Validation failed', 422)
  }
  next()
}
