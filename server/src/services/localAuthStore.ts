import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import type { Role } from '../models/User.js'

export interface LocalUser {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  role: Role
  avatar?: string
  isEmailVerified: boolean
  isActive: boolean
  refreshTokenHash?: string
}

const usersByEmail = new Map<string, LocalUser>()
const usersById = new Map<string, LocalUser>()

export function isLocalAuthEnabled() {
  return !process.env.MONGODB_URI
}

export async function createLocalUser(input: {
  name: string
  email: string
  phone?: string
  password: string
  role?: Role
}) {
  const email = input.email.toLowerCase()
  if (usersByEmail.has(email)) return null

  const user: LocalUser = {
    id: crypto.randomUUID(),
    name: input.name,
    email,
    phone: input.phone,
    passwordHash: await bcrypt.hash(input.password, 12),
    role: input.role ?? 'customer',
    isEmailVerified: true,
    isActive: true,
  }

  usersByEmail.set(user.email, user)
  usersById.set(user.id, user)
  return user
}

export function findLocalUserByEmail(email: string) {
  return usersByEmail.get(email.toLowerCase()) ?? null
}

export function findLocalUserById(id: string) {
  return usersById.get(id) ?? null
}

export function setLocalRefreshTokenHash(id: string, refreshTokenHash: string) {
  const user = usersById.get(id)
  if (user) user.refreshTokenHash = refreshTokenHash
}

export function compareLocalPassword(user: LocalUser, password: string) {
  return bcrypt.compare(password, user.passwordHash)
}
