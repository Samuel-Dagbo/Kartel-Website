'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, CheckCircle, XCircle } from 'lucide-react'

const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Order not found')
      } else {
        setOrder(data.order)
      }
    } catch {
      setError('Failed to look up order. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1

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
                  <label className="block text-sm text-muted mb-2">Order Number</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. CJ-XXXXX"
                    className="input-luxury w-full px-4 py-3 rounded-xl"
                    required
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
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
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
                  <span className="text-muted text-sm">Order Number</span>
                  <span className="text-heading font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-sm">Status</span>
                  <span className={`font-semibold capitalize ${
                    order.status === 'delivered' ? 'text-green-500' :
                    order.status === 'cancelled' ? 'text-red-500' : 'text-kartel-gold'
                  }`}>{order.status}</span>
                </div>
                {order.totalAmount && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-muted text-sm">Total</span>
                    <span className="text-heading font-medium">GHS {order.totalAmount}</span>
                  </div>
                )}
              </div>

              <div className="p-8 glass-card">
                <h2 className="font-serif text-xl font-semibold text-heading mb-8">Delivery Progress</h2>
                <div className="space-y-6">
                  {statusSteps.map((step, i) => {
                    const isCompleted = currentStepIndex >= i
                    const isCancelled = order.status === 'cancelled'
                    return (
                      <div key={step} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCancelled && !isCompleted
                            ? 'bg-red-500/10 text-red-500'
                            : isCompleted
                              ? 'bg-kartel-gold text-kartel-black'
                              : 'bg-white/[0.05] text-muted'
                        }`}>
                          {isCancelled && !isCompleted ? (
                            <XCircle className="w-5 h-5" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-semibold">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <h3 className={`font-medium capitalize ${
                            isCompleted ? 'text-heading' : 'text-muted'
                          }`}>
                            {step}
                          </h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {isSearching && (
                  <p className="text-center text-sm text-muted mt-6">Fetching latest status...</p>
                )}
              </div>

              <button
                onClick={() => { setOrder(null); setError('') }}
                className="text-muted hover:text-heading transition-colors text-sm block mx-auto"
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
