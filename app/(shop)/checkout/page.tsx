'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/components/providers/CartProvider'
import { formatPrice } from '@/lib/utils'
import { CreditCard, Truck, CheckCircle2, ShoppingBag, Lock, Banknote, Wallet } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'cod' | 'card'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    paymentMethod: PaymentMethod;
  } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Ghana',
    phone: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setLoading(false)
    } else {
      setLoading(false)
      if (session.user) {
        setFormData(prev => ({
          ...prev,
          name: session.user.name || prev.name,
          email: session.user.email || prev.email,
        }))
      }
    }
  }, [session, status])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-primary px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-kartel-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-heading mb-4">Sign In Required</h1>
          <p className="text-body mb-8">
            Please sign in to complete your purchase. You can also create an account if you don&apos;t have one.
          </p>
          <div className="space-y-4">
            <Link
              href="/login?callbackUrl=/checkout"
              className="btn-primary w-full py-4 block"
            >
              Sign In to Checkout
            </Link>
            <Link
              href="/register?callbackUrl=/checkout"
              className="btn-ghost w-full py-4 block"
            >
              Create an Account
            </Link>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-8 text-sm text-muted hover:text-kartel-gold transition-colors"
          >
            ← Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      if (paymentMethod === 'card') {
        const initRes = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({
              product: item.product._id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            shippingAddress: {
              email: formData.email,
              name: formData.name,
              street: formData.street,
              city: formData.city,
              state: formData.state || 'Accra',
              zip: formData.zip || '00000',
              country: formData.country,
              phone: formData.phone,
            },
            totalAmount: totalPrice,
            callbackUrl: `${window.location.origin}/paystack/callback`,
          }),
        })

        const initData = await initRes.json()

        if (!initRes.ok) {
          throw new Error(initData.error || 'Payment initialization failed')
        }

        window.location.href = initData.authorizationUrl
        return
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            email: formData.email,
            name: formData.name,
            street: formData.street,
            city: formData.city,
            state: formData.state || 'Accra',
            zip: formData.zip || '00000',
            country: formData.country,
            phone: formData.phone,
          },
          totalAmount: totalPrice,
          paymentMethod: 'cod',
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Order processing failed')
      }

      const orderData = await response.json()
      clearCart()
      setCompletedOrder({
        orderNumber: orderData.orderNumber || orderData.order?.orderNumber,
        paymentMethod: 'cod',
      })
      setStep(3)
      toast({
        title: 'Order Placed!',
        description: 'Your luxury fragrance is on its way.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order. Please try again.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-primary">
        <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center text-muted mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-heading mb-4">Your bag is empty</h1>
        <p className="text-body mb-8 max-w-md">You haven&apos;t added any fragrances to your bag yet. Explore our collection to find your signature scent.</p>
        <Link href="/shop" className="btn-primary px-8 py-3">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 section-padding bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s ? 'bg-kartel-gold text-kartel-black' :
                step > s ? 'bg-green-500 text-white' : 'bg-black/[0.06] dark:bg-white/[0.06] text-muted'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`h-px w-12 ${step > s ? 'bg-green-500' : 'bg-black/[0.08] dark:bg-white/[0.08]'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Truck className="w-6 h-6 text-kartel-gold" />
                  <h2 className="font-serif text-2xl font-bold text-heading">Shipping Details</h2>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">Email Address</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-muted">Street Address</label>
                    <input name="street" value={formData.street} onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.street || !formData.city || !formData.phone) {
                          toast({ title: 'Required Fields', description: 'Please fill in all shipping fields.' })
                          return
                        }
                        setStep(2)
                      }}
                      className="btn-primary w-full py-4 mt-2"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <OrderSummary totalPrice={totalPrice} items={items} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <CreditCard className="w-6 h-6 text-kartel-gold" />
                  <h2 className="font-serif text-2xl font-bold text-heading">Payment Method</h2>
                </div>
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-kartel-gold bg-kartel-gold/5'
                          : 'border-black/[0.08] dark:border-white/[0.08] hover:border-kartel-gold/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          paymentMethod === 'card' ? 'bg-kartel-gold/20' : 'bg-black/[0.04] dark:bg-white/[0.04]'
                        }`}>
                          <Wallet className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-kartel-gold' : 'text-muted'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-heading">Pay with Card</p>
                          <p className="text-xs text-muted mt-0.5">Visa, Mastercard, Mobile Money</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="mt-3 pt-3 border-t border-kartel-gold/20 text-xs text-kartel-gold">
                          Secured by Paystack. You will be redirected to complete payment.
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-kartel-gold bg-kartel-gold/5'
                          : 'border-black/[0.08] dark:border-white/[0.08] hover:border-kartel-gold/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'bg-kartel-gold/20' : 'bg-black/[0.04] dark:bg-white/[0.04]'
                        }`}>
                          <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-kartel-gold' : 'text-muted'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-heading">Cash on Delivery</p>
                          <p className="text-xs text-muted mt-0.5">Pay when you receive</p>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && (
                        <div className="mt-3 pt-3 border-t border-kartel-gold/20 text-xs text-kartel-gold">
                          No extra fees. Pay upon delivery.
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-outline flex-1 py-4"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-kartel-black/30 border-t-kartel-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : paymentMethod === 'card' ? (
                        <>Pay with Card - {formatPrice(totalPrice)}</>
                      ) : (
                        <>Place Order - {formatPrice(totalPrice)}</>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted flex items-center gap-2 text-center justify-center">
                    <Lock className="w-3 h-3" />
                    Your payment information is secure and encrypted
                  </p>
                </form>
              </div>
            </div>
            <OrderSummary totalPrice={totalPrice} items={items} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center space-y-8 py-12"
          >
            <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-heading mb-4">Thank You!</h1>
            <p className="text-body text-lg leading-relaxed">
              {completedOrder?.paymentMethod === 'cod'
                ? 'Your order has been placed successfully. We\'re preparing your signature scent with the utmost care. You will receive a confirmation email shortly.'
                : 'Your payment has been confirmed and your order is being processed.'}
            </p>
            <div className="p-6 glass-card text-left space-y-3 mb-8">
              <p className="text-sm text-muted">
                Order Number:{' '}
                <span className="text-heading font-medium">
                  #{completedOrder?.orderNumber || `CJ-${Math.floor(Math.random() * 1000000)}`}
                </span>
              </p>
              <p className="text-sm text-muted">
                Payment:{' '}
                <span className="text-heading font-medium">
                  {completedOrder?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid via Card'}
                </span>
              </p>
              <p className="text-sm text-muted">Estimated Delivery: <span className="text-heading font-medium">3-5 Business Days</span></p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/customer/orders" className="btn-primary px-8 py-4">
                View My Orders
              </Link>
              <Link href="/shop" className="btn-outline px-8 py-4">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function OrderSummary({ totalPrice, items }: { totalPrice: number; items: any[] }) {
  return (
    <div className="glass-card p-8 h-fit sticky top-28">
      <h2 className="font-serif text-2xl font-bold text-heading mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
        {items.map((item) => (
          <div key={item.product._id} className="flex gap-4 items-center">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-black/[0.08] dark:border-white/[0.08]">
              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-body">{item.product.name}</h3>
              <p className="text-xs text-muted">{item.quantity} x {formatPrice(item.product.price)}</p>
            </div>
            <span className="text-sm font-bold text-heading">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-6 border-t border-black/[0.08] dark:border-white/[0.08]">
        <div className="flex justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>Shipping</span>
          <span className="text-green-500">Free</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-heading pt-3">
          <span>Total</span>
          <span className="text-kartel-gold">{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  )
}
