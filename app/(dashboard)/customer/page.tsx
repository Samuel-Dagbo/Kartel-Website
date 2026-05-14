'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Heart, Star, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product as ProductType } from '@/types'
import { formatPrice } from '@/lib/utils'

interface Order {
  _id: string
  totalAmount: number
  status: string
  createdAt: string
  orderNumber: string
}

export default function CustomerOverview() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [recommendations, setRecommendations] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products?limit=4')
      ])

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setRecommendations(productsData.products || productsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Please sign in to view your dashboard.</p>
          <Link href="/login" className="text-kartel-gold hover:text-kartel-gold/80">Sign In →</Link>
        </div>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading">
            Welcome back, <span className="text-gradient">{session.user?.name?.split(' ')[0] || 'Customer'}</span>
          </h1>
          <p className="text-muted text-sm mt-1">Manage your orders and discover new fragrances.</p>
        </div>
        <Link 
          href="/shop" 
          className="btn-primary group inline-flex items-center gap-2 px-5 py-2.5"
        >
          Explore Collection
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'Total Orders', value: orders.length.toString(), icon: Package, gradient: 'from-blue-500/20 to-blue-500/5' },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: Heart, gradient: 'from-pink-500/20 to-pink-500/5' },
          { label: 'Delivered', value: deliveredOrders.toString(), icon: Star, gradient: 'from-kartel-gold/20 to-kartel-gold/5' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-5 glass-card rounded-2xl hover:border-kartel-gold/20 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="w-5 h-5 text-kartel-gold" />
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-heading">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-kartel-gold" />
              Recent Orders
            </h2>
            <Link href="/customer/orders" className="text-xs text-kartel-gold hover:text-kartel-gold/80">View all →</Link>
          </div>
          
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.slice(0, 4).map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-4 glass-card rounded-xl hover:border-kartel-gold/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-heading">
                      {order.orderNumber || `CJ-${order._id.slice(-6).toUpperCase()}`}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                      order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                      'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {order.status || 'processing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    <span className="text-sm font-semibold text-heading">{formatPrice(order.totalAmount)}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 glass-card rounded-2xl text-center">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                  <Package className="w-5 h-5 text-muted" />
                </div>
                <p className="text-muted text-sm">No orders yet</p>
                <Link href="/shop" className="text-kartel-gold text-sm mt-2 inline-block hover:text-kartel-gold/80">
                  Start Shopping →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommended Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-heading">Curated for You</h2>
            <Link href="/shop" className="text-xs text-kartel-gold hover:text-kartel-gold/80">View all →</Link>
          </div>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 glass-card rounded-2xl text-center">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5 text-muted" />
              </div>
              <p className="text-muted text-sm">No products available yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}