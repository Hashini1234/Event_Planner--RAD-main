import type { ErrorRequestHandler } from 'express'
import { AppError } from '../utils/AppError.js'

export const notFound = () => {
  throw new AppError('Route not found', 404)
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof AppError ? error.statusCode : 500
  res.status(status).json({
    success: false,
    message: error.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}
