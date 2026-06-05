import type { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { AppError } from '../utils/AppError.js'

export const notFound = () => {
  throw new AppError('Route not found', 404)
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next
  const isValidationError = error instanceof mongoose.Error.ValidationError
  const isCastError = error instanceof mongoose.Error.CastError
  const isDuplicateKey = typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
  const status = error instanceof AppError ? error.statusCode : isValidationError || isCastError ? 400 : isDuplicateKey ? 409 : 500
  res.status(status).json({
    success: false,
    message:
      error instanceof AppError || isValidationError || isCastError || isDuplicateKey
        ? error.message || 'Request failed'
        : 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
}
