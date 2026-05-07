'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Heart, Star, Clock } from 'lucide-react'
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
  const [wishlistCount, setWishlistCount] = useState(0)
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Please sign in to view your dashboard.</p>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Welcome back, {session.user?.name?.split(' ')[0] || 'Customer'}</h1>
          <p className="text-white/60">Manage your orders and explore new fragrance discoveries.</p>
        </div>
        <Link href="/shop" className="btn-primary px-6 py-3 text-sm">
          Explore Collection
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'text-blue-400' },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: Heart, color: 'text-pink-400' },
          { label: 'Delivered', value: deliveredOrders.toString(), icon: Star, color: 'text-kartel-gold' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="luxury-card p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-kartel-gold" />
              Recent Orders
            </h2>
            <Link href="/customer/orders" className="text-sm text-kartel-gold hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
                <div key={order._id} className="luxury-card p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{order.orderNumber || `KARTEL-${order._id.slice(-6).toUpperCase()}`}</p>
                    <p className="text-xs text-white/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="luxury-card p-6 text-center">
                <p className="text-white/60 text-sm">No orders yet</p>
                <Link href="/shop" className="text-kartel-gold text-sm hover:underline mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-white">Curated for You</h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendations.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="luxury-card p-6 text-center">
              <p className="text-white/60">No products available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}