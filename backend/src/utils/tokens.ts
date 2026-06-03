import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import type { Role } from '../models/User.js'
import { env } from '../config/env.js'

export interface JwtPayload {
  sub: string
  role: Role
}

export function signAccessToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRES as SignOptions['expiresIn'] }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options)
}

export function signRefreshToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRES as SignOptions['expiresIn'] }
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, options)
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload
}
