import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { router } from './routes/index.js'

export const app = express()

const allowedOrigins = new Set([
  env.CLIENT_URL,
])

function isAllowedOrigin(origin?: string) {
  if (!origin) return true
  if (allowedOrigins.has(origin)) return true

  try {
    const url = new URL(origin)
    return env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname)
  } catch {
    return false
  }
}

app.set('trust proxy', 1)
app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/v1', router)
app.use(notFound)
app.use(errorHandler)
