import bcrypt from 'bcryptjs'
import { Schema, model, type HydratedDocument } from 'mongoose'

export type Role = 'customer' | 'vendor' | 'admin'

export interface IUser {
  name: string
  email: string
  phone?: string
  password: string
  role: Role
  avatar?: string
  isEmailVerified: boolean
  emailVerificationToken?: string
  passwordResetOtp?: string
  passwordResetExpires?: Date
  refreshTokenHash?: string
  isActive: boolean
}

export type UserDocument = HydratedDocument<IUser> & {
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: String,
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer', index: true },
    avatar: String,
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetOtp: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const output = ret as Record<string, unknown>
    delete output.password
    delete output.refreshTokenHash
    return ret
  },
})

export const UserModel = model<IUser>('User', userSchema)
