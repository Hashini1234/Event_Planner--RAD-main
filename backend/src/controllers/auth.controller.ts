import crypto from 'crypto'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { UserModel, type Role, type UserDocument } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js'
import { sendEmail } from '../services/notification.service.js'
import {
  compareLocalPassword,
  createLocalUser,
  findLocalUserByEmail,
  findLocalUserById,
  setLocalRefreshTokenHash,
  type LocalUser,
} from '../services/localAuthStore.js'

function publicUser(user: {
  id?: string
  _id?: { toString(): string }
  name: string
  email: string
  role: Role
  avatar?: string
  isEmailVerified: boolean
}) {
  return {
    id: user.id ?? user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  }
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}

export async function register(req: Request, res: Response) {
  if (!isDatabaseConnected()) {
    const user = await createLocalUser(req.body)
    if (!user) throw new AppError('Email already registered', 409)
    res.status(201).json({ success: true, data: { user: publicUser(user) } })
    return
  }

  const exists = await UserModel.exists({ email: req.body.email })
  if (exists) throw new AppError('Email already registered', 409)

  const verificationToken = crypto.randomBytes(24).toString('hex')
  const user = await UserModel.create({
    ...req.body,
    emailVerificationToken: verificationToken,
  })
  await sendEmail(user.email, 'Verify your CelebrateLK account', `<p>Your verification token is ${verificationToken}</p>`)
  res.status(201).json({ success: true, data: { user: publicUser(user) } })
}

export async function login(req: Request, res: Response) {
  const user: UserDocument | LocalUser | null = isDatabaseConnected()
    ? ((await UserModel.findOne({ email: req.body.email }).select('+password +refreshTokenHash')) as UserDocument | null)
    : findLocalUserByEmail(req.body.email)

  const passwordMatches = user
    ? 'comparePassword' in user
      ? await user.comparePassword(req.body.password)
      : await compareLocalPassword(user, req.body.password)
    : false

  if (!user || !passwordMatches) {
    throw new AppError('Invalid email or password', 401)
  }
  if (req.body.role && req.body.role !== user.role) {
    throw new AppError(`This account is registered as ${user.role}, not ${req.body.role}`, 403)
  }

  const payload = { sub: user.id, role: user.role }
  const token = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  if (isDatabaseConnected() && 'save' in user) {
    user.refreshTokenHash = refreshTokenHash
    await user.save()
  } else {
    setLocalRefreshTokenHash(user.id, refreshTokenHash)
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.json({ success: true, data: { user: publicUser(user), token } })
}

export async function me(req: Request, res: Response) {
  const user = isDatabaseConnected() ? await UserModel.findById(req.user?.id) : findLocalUserById(req.user?.id ?? '')
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, data: { user: publicUser(user) } })
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) throw new AppError('Refresh token required', 401)
  const payload = verifyRefreshToken(refreshToken)
  const token = signAccessToken({ sub: payload.sub, role: payload.role })
  res.json({ success: true, data: { token } })
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('refreshToken')
  res.json({ success: true })
}

export async function verifyEmail(req: Request, res: Response) {
  const user = await UserModel.findOne({ emailVerificationToken: req.body.token }).select('+emailVerificationToken')
  if (!user) throw new AppError('Invalid verification token', 400)
  user.isEmailVerified = true
  user.emailVerificationToken = undefined
  await user.save()
  res.json({ success: true })
}

export async function forgotPassword(req: Request, res: Response) {
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  await UserModel.updateOne(
    { email: req.body.email },
    { passwordResetOtp: otp, passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000) },
  )
  await sendEmail(req.body.email, 'CelebrateLK password reset OTP', `<p>Your OTP is ${otp}</p>`)
  res.json({ success: true })
}

export async function resetPassword(req: Request, res: Response) {
  const user = await UserModel.findOne({
    email: req.body.email,
    passwordResetOtp: req.body.otp,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetOtp +passwordResetExpires')
  if (!user) throw new AppError('Invalid or expired OTP', 400)
  user.password = req.body.password
  user.passwordResetOtp = undefined
  user.passwordResetExpires = undefined
  await user.save()
  res.json({ success: true })
}
