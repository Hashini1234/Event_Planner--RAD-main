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

const demoUsers: Array<{
  name: string
  email: string
  phone: string
  password: string
  role: Role
}> = [
  {
    name: 'Demo Customer',
    email: 'customer@celebratelk.demo',
    phone: '0700000001',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Demo Vendor',
    email: 'vendor@celebratelk.demo',
    phone: '0700000002',
    password: 'password123',
    role: 'vendor',
  },
  {
    name: 'Demo Admin',
    email: 'admin@celebratelk.demo',
    phone: '0700000003',
    password: 'password123',
    role: 'admin',
  },
]

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

export async function seedLocalDemoUsers() {
  await Promise.all(demoUsers.map((user) => createLocalUser(user)))
}
