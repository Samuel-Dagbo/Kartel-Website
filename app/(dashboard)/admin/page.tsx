'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight,
  Package,
  Plus,
  Eye,
  Search
} from 'lucide-react'
import { 
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
}

interface Order {
  _id: string
  orderNumber: string
  user: { name: string; email: string }
  totalAmount: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/customer')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, session, router])

  const fetchData = async () => {
    try {
      const [ordersRes] = await Promise.all([
        fetch('/api/orders')
      ])

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)

        const totalRevenue = ordersData.reduce((sum: number, o: Order) => sum + o.totalAmount, 0)
        const totalOrders = ordersData.length
        const uniqueCustomers = new Set(ordersData.map((o: Order) => o.user?.email)).size

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: uniqueCustomers || 3,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading dashboard&hellip;</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const recentOrders = orders.slice(0, 5)

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(stats.totalRevenue), 
      change: '+12.5%', 
      trend: 'up', 
      icon: DollarSign, 
      gradient: 'from-green-500/20 to-green-500/5'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      change: '+8.2%', 
      trend: 'up', 
      icon: ShoppingBag, 
      gradient: 'from-blue-500/20 to-blue-500/5'
    },
    { 
      label: 'Customers', 
      value: stats.totalCustomers.toString(), 
      change: '+2.4%', 
      trend: 'up', 
      icon: Users, 
      gradient: 'from-purple-500/20 to-purple-500/5'
    },
    { 
      label: 'Avg. Order Value', 
      value: formatPrice(stats.avgOrderValue), 
      change: '+4.1%', 
      trend: 'up', 
      icon: TrendingUp, 
      gradient: 'from-kartel-gold/20 to-kartel-gold/5'
    },
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products" 
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.06] hover:text-white transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory</span>
          </Link>
          <Link 
            href="/admin/products?action=add" 
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-kartel-gold/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-5 lg:p-6 rounded-2xl bg-gradient-to-b from-kartel-black-900/50 to-kartel-black-950/50 border border-white/[0.06] hover:border-kartel-gold/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} border border-white/[0.06]`}>
                  <stat.icon className="w-5 h-5 text-kartel-gold" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-b from-kartel-black-900/30 to-kartel-black-950/30 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-semibold text-white">Revenue Trend</h3>
            <span className="text-xs text-white/40">Last 30 days</span>
          </div>
          <div className="h-[280px] w-full">
            {orders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orders.slice(0, 10).map((o, i) => ({ name: `Order ${i + 1}`, sales: o.totalAmount }))}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `GHS ${v}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '12px',
                      color: '#fff' 
                    }} 
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#D4AF37" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5 text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm">No data available yet</p>
                  <p className="text-white/20 text-xs mt-1">Orders will appear here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-b from-kartel-black-900/30 to-kartel-black-950/30 border border-white/[0.06]"
        >
          <h3 className="font-serif text-lg font-semibold text-white mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'View Products', icon: Package, href: '/admin/products', color: 'from-blue-500/20' },
              { label: 'Manage Orders', icon: ShoppingBag, href: '/admin/orders', color: 'from-purple-500/20' },
              { label: 'Add New Product', icon: Plus, href: '/admin/products?action=add', color: 'from-kartel-gold/20' },
            ].map((action, i) => (
              <Link 
                key={i} 
                href={action.href}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                    <action.icon className="w-4 h-4 text-white/70 group-hover:text-kartel-gold transition-colors" />
                  </div>
                  <span className="text-sm text-white/70">{action.label}</span>
                </div>
                <Eye className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-gradient-to-b from-kartel-black-900/30 to-kartel-black-950/30 border border-white/[0.06] overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-white">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-kartel-gold hover:text-kartel-gold/80 transition-colors">
            View All →
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-[10px] font-semibold text-white/40 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((order, i) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">
                        {order.orderNumber || `KRT-${order._id.slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white/80">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-white/40">{order.user?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                        order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                        order.status === 'processing' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                        'bg-white/10 text-white/50 border border-white/[0.1]'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/50">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href="/admin/orders" 
                        className="text-xs text-kartel-gold hover:text-kartel-gold/70 transition-colors"
                      >
                        Manage →
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-white/40">No orders yet</p>
            <p className="text-white/20 text-sm mt-1">Orders will appear here when customers purchase</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}