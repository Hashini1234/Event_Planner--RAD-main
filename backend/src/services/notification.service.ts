import nodemailer from 'nodemailer'
import twilio from 'twilio'
import { Server } from 'socket.io'
import { env } from '../config/env.js'
import { NotificationModel } from '../models/Notification.js'

let io: Server | null = null

export function attachSocket(server: Server) {
  io = server
}

export async function createNotification(input: {
  user: string
  title: string
  message: string
  type: 'booking' | 'payment' | 'vendor' | 'system' | 'rsvp'
  channel?: 'in-app' | 'email' | 'sms'
  metadata?: Record<string, unknown>
}) {
  const notification = await NotificationModel.create(input)
  io?.to(input.user).emit('notification:new', notification)
  return notification
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })
  await transport.sendMail({ from: env.SMTP_USER, to, subject, html })
}

export async function sendSms(to: string, body: string) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM) return
  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
  await client.messages.create({ from: env.TWILIO_FROM, to, body })
}
