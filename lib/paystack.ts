import crypto from 'crypto'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
const PAYSTACK_API = 'https://api.paystack.co'

export function getPaystackPublicKey(): string {
  return PAYSTACK_PUBLIC_KEY
}

export async function initializeTransaction(params: {
  email: string
  amount: number
  metadata: Record<string, unknown>
  callbackUrl: string
}) {
  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      currency: 'GHS',
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  })

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || 'Paystack initialization failed')
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  }
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(`${PAYSTACK_API}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || 'Paystack verification failed')
  }

  return {
    status: data.data.status,
    amount: data.data.amount / 100,
    currency: data.data.currency,
    paidAt: data.data.paid_at,
    channel: data.data.channel,
    reference: data.data.reference,
    metadata: data.data.metadata,
    gatewayResponse: data.data.gateway_response,
  }
}

export function verifyWebhookSignature(signature: string, body: string): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex')
  return hash === signature
}

export const PAYSTACK_PUBLIC_KEY_EXPORT = PAYSTACK_PUBLIC_KEY
