'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function CallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')

    if (!reference) {
      setStatus('failed')
      return
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`)
        const data = await res.json()

        if (data.success) {
          setStatus('success')
          setOrderNumber(data.order?.orderNumber || '')
        } else {
          setStatus('failed')
        }
      } catch {
        setStatus('failed')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-kartel-gold animate-spin mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-heading">Verifying Payment</h1>
          <p className="text-muted">Please wait while we confirm your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-heading">Payment Successful!</h1>
          <p className="text-body">
            Your payment has been confirmed. {orderNumber && (
              <>Order <span className="text-kartel-gold font-semibold">{orderNumber}</span> is being processed.</>
            )}
          </p>
          <p className="text-muted text-sm">Check your email for the order confirmation.</p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/customer/orders" className="btn-primary px-6 py-3">
              View My Orders
            </Link>
            <Link href="/shop" className="btn-outline px-6 py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-heading">Payment Failed</h1>
        <p className="text-body">
          Your payment could not be processed. Your order has not been charged.
        </p>
        <Link href="/checkout" className="btn-primary px-6 py-3 inline-block">
          Try Again
        </Link>
      </div>
    </div>
  )
}

export default function PaystackCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-kartel-gold animate-spin mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-heading">Loading...</h1>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
