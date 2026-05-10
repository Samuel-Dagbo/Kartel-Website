'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, CheckCircle } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [order, setOrder] = useState<any>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setOrder({
        id: orderId || 'KTL-2024-123456',
        status: 'shipped',
        estimatedDelivery: 'March 15, 2024',
        items: 2,
        tracking: '1Z999AA10123456784',
        timeline: [
          { status: 'Order Placed', date: 'March 10, 2024', completed: true },
          { status: 'Processing', date: 'March 11, 2024', completed: true },
          { status: 'Shipped', date: 'March 12, 2024', completed: true },
          { status: 'Out for Delivery', date: 'March 15, 2024', completed: false },
          { status: 'Delivered', date: '', completed: false },
        ],
      })
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-primary">
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kartel-gold/10 mb-6">
              <Package className="w-8 h-8 text-kartel-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mb-4">
              Track Your Order
            </h1>
            <p className="text-muted">
              Enter your order details to see real-time tracking information.
            </p>
          </motion.div>

          {!order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl mx-auto glass-card p-8"
            >
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <label className="block text-sm text-muted mb-2">Order ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="KTL-2024-XXXXXX"
                    className="input-luxury w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-luxury w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary w-full px-6 py-3.5 flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-kartel-black/30 border-t-kartel-black rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="p-6 rounded-2xl bg-kartel-gold/10 border border-kartel-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted text-sm">Order ID</span>
                  <span className="text-heading font-medium">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-sm">Estimated Delivery</span>
                  <span className="text-kartel-gold font-semibold">{order.estimatedDelivery}</span>
                </div>
              </div>

              <div className="p-8 glass-card">
                <h2 className="font-serif text-xl font-semibold text-heading mb-8">Delivery Progress</h2>
                <div className="space-y-6">
                  {order.timeline.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed 
                          ? 'bg-kartel-gold text-kartel-black' 
                          : 'bg-white/[0.05] text-muted'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-medium ${step.completed ? 'text-heading' : 'text-muted'}`}>
                          {step.status}
                        </h3>
                        {step.date && (
                          <p className="text-muted/70 text-sm mt-1">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOrder(null)}
                className="text-muted hover:text-heading transition-colors text-sm"
              >
                Track another order
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}