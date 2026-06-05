import mongoose from 'mongoose'
import { env } from './env.js'
import { seedLocalDemoUsers } from '../services/localAuthStore.js'

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    await seedLocalDemoUsers()
    console.warn('MONGODB_URI not set. Running auth in local memory mode.')
    return false
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('MongoDB connected')
  return true
}
