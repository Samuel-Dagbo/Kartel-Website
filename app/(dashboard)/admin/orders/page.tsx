'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Package, Eye, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  user: {
    name: string
    email: string
  }
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
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

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/customer')
    } else if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, session, router])

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const statusStats = [
    { label: 'Total Orders', value: orders.length, color: 'from-blue-500/20' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'from-yellow-500/20' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'from-purple-500/20' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'from-green-500/20' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading">Orders Management</h1>
          <p className="text-muted text-sm mt-1">Track and process customer orders</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 glass-card rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <ShoppingCart className="w-4 h-4 text-kartel-gold" />
              </div>
              <div>
                <p className="text-muted text-xs">{stat.label}</p>
                <p className="text-lg font-bold text-heading">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Eye className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-11 pr-4 py-3 rounded-xl text-sm" 
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-luxury px-4 py-3 rounded-xl text-sm"
        >
          <option value="all">All Status</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-kartel-white-50 dark:bg-kartel-black">
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Customer</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Total</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Payment</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-heading">
                        {order.orderNumber || `KRT-${order._id.slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-body">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-muted">{order.user?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-heading">{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                        order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                        order.status === 'processing' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                        'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        order.paymentStatus === 'paid' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg glass-card text-muted hover:text-kartel-gold hover:border-kartel-gold/20 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center mb-4">
                        <ShoppingCart className="w-6 h-6 text-muted" />
                      </div>
                      <p className="text-muted">No orders found</p>
                      <p className="text-muted/50 text-sm mt-1">Orders will appear here when customers purchase</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            >
              <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-heading">
                    Order {selectedOrder.orderNumber || `KRT-${selectedOrder._id.slice(-6).toUpperCase()}`}
                  </h2>
                  <p className="text-muted text-sm mt-1">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg glass-card text-muted hover:text-heading hover:border-kartel-gold/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Update */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass">
                  <div>
                    <p className="text-muted text-xs uppercase tracking-wider mb-1">Current Status</p>
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                      selectedOrder.status === 'delivered' ? 'bg-green-500/15 text-green-400' :
                      selectedOrder.status === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                      selectedOrder.status === 'processing' ? 'bg-purple-500/15 text-purple-400' :
                      selectedOrder.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                      'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {selectedOrder.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder._id, s)}
                        disabled={updating || selectedOrder.status === s}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedOrder.status === s 
                            ? 'btn-primary' 
                            : 'glass text-muted hover:text-heading'
                        } disabled:opacity-40`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-xl glass-card">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">Customer</p>
                  <p className="text-heading font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                  <p className="text-body text-sm">{selectedOrder.user?.email || 'No email'}</p>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="p-4 rounded-xl glass-card">
                    <p className="text-muted text-xs uppercase tracking-wider mb-3">Shipping Address</p>
                    <p className="text-body text-sm">
                      {selectedOrder.shippingAddress.street}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                    {selectedOrder.shippingAddress.phone && (
                      <p className="text-muted text-sm mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="p-4 rounded-xl glass-card">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden glass shrink-0">
                          {item.product?.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-heading text-sm truncate">{item.product?.name || 'Product'}</p>
                          <p className="text-muted text-xs">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="text-heading font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex justify-between">
                    <span className="text-muted">Total</span>
                    <span className="text-lg font-bold text-heading">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}