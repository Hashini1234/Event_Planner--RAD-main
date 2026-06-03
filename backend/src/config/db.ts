import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    console.warn('MONGODB_URI not set. Running auth in local memory mode.')
    return false
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.MONGODB_URI)
  console.log('MongoDB connected')
  return true
}
