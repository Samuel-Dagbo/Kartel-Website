'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'

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
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export default function OrderHistory() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400'
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-white/10 text-white/60'
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Please sign in to view your orders.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="font-serif text-4xl font-bold text-white">My Orders</h1>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold text-white">My Orders</h1>
        <div className="text-white/60 text-sm">Total Orders: {orders.length}</div>
      </div>

      {orders.length === 0 ? (
        <div className="luxury-card p-12 text-center">
          <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
          <p className="text-white/60 mb-6">Start shopping to see your orders here.</p>
          <a href="/shop" className="btn-primary px-6 py-3 inline-block">
            Browse Shop
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="luxury-card overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between gap-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{order.orderNumber || `KARTEL-${order._id.slice(-6).toUpperCase()}`}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    {order.shippingAddress && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatPrice(order.totalAmount)}</p>
                  <button className="text-xs text-kartel-gold hover:underline mt-1">Track Order</button>
                </div>
              </div>
              <div className="p-6 bg-white/5">
                <div className="flex flex-wrap gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="text-kartel-gold font-bold">{item.quantity}x</span> {item.product?.name || 'Product'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors group">
                  View Order Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}