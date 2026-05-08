'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Calendar, MapPin, ChevronRight, Eye, X, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface OrderItem {
  product: {
    _id: string
    name: string
    images: string[]
  }
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  status: string
  paymentStatus: string
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }
}

export default function OrderHistory() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Please sign in to view your orders.</p>
          <Link href="/login" className="text-kartel-gold hover:text-kartel-gold/80">Sign In →</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">My Orders</h1>
          <p className="text-white/40 text-sm mt-1">View and track your order history</p>
        </div>
        <div className="flex items-center justify-center h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-white/40 text-sm">Loading orders...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">My Orders</h1>
          <p className="text-white/40 text-sm mt-1">View and track your order history</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-white/60 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">Start shopping to see your orders here. We have amazing fragrances waiting for you!</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold hover:brightness-110 transition-all"
          >
            Browse Shop
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-white/[0.1] transition-all"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06]">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-white">{order.orderNumber || `KRT-${order._id.slice(-6).toUpperCase()}`}</span>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                      order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                      order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                      order.status === 'processing' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                      order.status === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      'bg-white/10 text-white/50 border border-white/[0.1]'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    {order.shippingAddress && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2.5 rounded-xl bg-white/[0.03] text-white/50 hover:text-kartel-gold hover:bg-white/[0.06] transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              <div className="p-5 sm:p-6 bg-white/[0.01]">
                <div className="flex flex-wrap gap-3">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="relative w-8 h-8 rounded overflow-hidden bg-white/[0.02]">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-3.5 h-3.5 text-white/20" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-white/70">
                        <span className="text-kartel-gold font-semibold">{item.quantity}×</span> {item.product?.name || 'Product'}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-xs text-white/40">+{order.items.length - 3} more</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-kartel-black-900 border border-white/[0.1]"
            >
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-white">
                    Order {selectedOrder.orderNumber || `KRT-${selectedOrder._id.slice(-6).toUpperCase()}`}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Status</p>
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                    selectedOrder.status === 'delivered' ? 'bg-green-500/15 text-green-400' :
                    selectedOrder.status === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                    selectedOrder.status === 'processing' ? 'bg-yellow-500/15 text-yellow-400' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {selectedOrder.status || 'pending'}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-white/50 text-xs uppercase tracking-wider">Items</p>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/[0.02] shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{item.product?.name || 'Product'}</p>
                        <p className="text-white/40 text-xs">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-white font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-white/[0.06] flex justify-between">
                  <span className="text-white/60">Total</span>
                  <span className="text-lg font-bold text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}