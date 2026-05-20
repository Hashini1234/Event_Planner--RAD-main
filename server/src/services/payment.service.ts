import Stripe from 'stripe'
import { env } from '../config/env.js'

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null

export async function createPaymentIntent(input: {
  amount: number
  currency?: string
  bookingId: string
  customerId: string
}) {
  if (!stripe) {
    return {
      id: `mock_pi_${Date.now()}`,
      clientSecret: 'mock_client_secret',
      status: 'requires_payment_method',
    }
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(input.amount * 100),
    currency: input.currency ?? 'lkr',
    metadata: {
      bookingId: input.bookingId,
      customerId: input.customerId,
    },
    automatic_payment_methods: { enabled: true },
  })

  return {
    id: intent.id,
    clientSecret: intent.client_secret,
    status: intent.status,
  }
}
