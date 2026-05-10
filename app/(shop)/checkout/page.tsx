'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/components/providers/CartProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { formatPrice } from '@/lib/utils'
import { CreditCard, Truck, CheckCircle2, ShoppingBag } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
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
            street: formData.street,
            city: formData.city,
            state: formData.state || 'NY',
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          },
          totalAmount: totalPrice,
        }),
      })

      if (!response.ok) throw new Error('Order processing failed')
      
      setStep(3)
      clearCart()
      toast({
        title: "Order Placed!",
        description: "Your luxury fragrance is on its way.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
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
                step > s ? 'bg-green-500 text-white' : 'bg-white/[0.1] text-muted'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`h-px w-12 ${step > s ? 'bg-green-500' : 'bg-white/[0.1]'}`} />}
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
                    <input name="name" onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">Email Address</label>
                    <input name="email" onChange={handleInputChange} type="email" required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-muted">Street Address</label>
                    <input name="street" onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">City</label>
                    <input name="city" onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted">Zip Code</label>
                    <input name="zip" onChange={handleInputChange} required className="input-luxury w-full px-4 py-3 rounded-lg" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary w-full py-4 mt-4"
                  >
                    Review Order
                  </button>
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
                  <div className="p-4 rounded-xl border border-kartel-gold/30 bg-kartel-gold/5 flex items-center gap-4 mb-8">
                    <Truck className="w-5 h-5 text-kartel-gold" />
                    <p className="text-sm text-body">Cash on Delivery - Pay when you receive your order</p>
                  </div>
                  <div className="p-4 rounded-lg glass-card space-y-2">
                    <p className="text-sm text-muted">Payment Option:</p>
                    <p className="text-body font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Cash on Delivery
                    </p>
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
                      {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(totalPrice)}`}
                    </button>
                  </div>
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
              Your order has been placed successfully. We&apos;re preparing your signature scent with the utmost care. You will receive a confirmation email shortly.
            </p>
            <div className="p-6 glass-card text-left space-y-3 mb-8">
              <p className="text-sm text-muted">Order Number: <span className="text-heading font-medium">#KARTEL-{Math.floor(Math.random() * 1000000)}</span></p>
              <p className="text-sm text-muted">Estimated Delivery: <span className="text-heading font-medium">3-5 Business Days</span></p>
            </div>
            <Link href="/" className="btn-primary px-8 py-4">Return to Home</Link>
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
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-black/[0.05] dark:border-white/[0.05]">
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
      <div className="space-y-3 pt-6 border-t border-black/[0.04] dark:border-white/[0.04]">
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