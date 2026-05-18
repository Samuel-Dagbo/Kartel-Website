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
  Sun,
  Moon,
  UserCog,
  BarChart3,
  Percent,
  Star,
  FileText,
  CreditCard,
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
import { useTheme } from '@/components/providers/ThemeProvider'

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
  const { theme, toggleTheme } = useTheme()
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

  const isDark = theme === 'dark'

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading dashboard&hellip;</span>
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
    <div className={`space-y-8 ${isDark ? '' : 'light-mode-admin'}`}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>Dashboard Overview</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-muted' : 'text-black/50'}`}>Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'glass-card text-muted hover:text-kartel-gold' 
                : 'bg-kartel-gold/10 text-black/50 hover:text-kartel-gold border border-kartel-gold/20'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Link 
            href="/admin/products" 
            className={`px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all ${
              isDark 
                ? 'glass-card text-body hover:bg-white/[0.06]' 
                : 'bg-white border border-black/[0.06] text-black/70 hover:border-kartel-gold/30 hover:bg-kartel-gold/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory</span>
          </Link>
          <Link 
            href="/admin/products?action=add" 
            className="btn-primary px-4 py-2.5 flex items-center gap-2"
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
            className={`group relative p-5 lg:p-6 rounded-2xl transition-all duration-500 ${
              isDark 
                ? 'glass-card hover:border-kartel-gold/20' 
                : 'bg-white border border-black/[0.06] hover:border-kartel-gold/20 hover:shadow-luxury'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="w-5 h-5 text-kartel-gold" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
              <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-muted' : 'text-black/40'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>{stat.value}</p>
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
          className={`lg:col-span-2 p-6 rounded-2xl ${
            isDark 
              ? 'glass-card' 
              : 'bg-white border border-black/[0.06]'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-serif text-lg font-semibold ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>Revenue Trend</h3>
            <span className={`text-xs ${isDark ? 'text-muted' : 'text-black/40'}`}>Last 30 days</span>
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
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                  <XAxis dataKey="name" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `GHS ${v}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? 'rgba(22, 22, 22, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', 
                      borderRadius: '12px',
                      color: isDark ? '#ffffff' : '#1a1a1a' 
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isDark ? 'glass-card' : 'bg-kartel-white-50'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${isDark ? 'text-muted' : 'text-black/40'}`} />
                  </div>
                  <p className={`text-sm ${isDark ? 'text-muted' : 'text-black/40'}`}>No data available yet</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-muted/50' : 'text-black/30'}`}>Orders will appear here</p>
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
          className={`p-6 rounded-2xl ${
            isDark 
              ? 'glass-card' 
              : 'bg-white border border-black/[0.06]'
          }`}
        >
          <h3 className={`font-serif text-lg font-semibold mb-5 ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Point of Sale', icon: CreditCard, href: '/admin/pos', color: 'from-green-500/20' },
              { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', color: 'from-purple-500/20' },
              { label: 'Manage Orders', icon: ShoppingBag, href: '/admin/orders', color: 'from-blue-500/20' },
              { label: 'View Products', icon: Package, href: '/admin/products', color: 'from-kartel-gold/20' },
              { label: 'Discounts', icon: Percent, href: '/admin/discounts', color: 'from-pink-500/20' },
              { label: 'Reviews', icon: Star, href: '/admin/reviews', color: 'from-yellow-500/20' },
              { label: 'Reports', icon: FileText, href: '/admin/reports', color: 'from-red-500/20' },
              { label: 'Users', icon: UserCog, href: '/admin/users', color: 'from-teal-500/20' },
            ].map((action, i) => (
              <Link 
                key={i} 
                href={action.href}
                className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                   isDark 
                     ? 'glass-card hover:border-kartel-gold/20' 
                     : 'bg-kartel-white-50 hover:border-kartel-gold/20 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                    <action.icon className={`w-4 h-4 ${isDark ? 'text-muted group-hover:text-kartel-gold' : 'text-black/40 group-hover:text-kartel-gold'} transition-colors`} />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-body' : 'text-black/70'}`}>{action.label}</span>
                </div>
                <Eye className={`w-4 h-4 ${isDark ? 'text-muted/50 group-hover:text-muted' : 'text-black/30 group-hover:text-black/50'} transition-colors`} />
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
        className={`rounded-2xl overflow-hidden ${
          isDark 
            ? 'glass-card' 
            : 'bg-white border border-black/[0.06]'
        }`}
      >
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isDark ? 'border-white/[0.04]' : 'border-black/[0.06]'
        }`}>
          <h3 className={`font-serif text-lg font-semibold ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>Recent Orders</h3>
          <Link href="/admin/orders" className={`text-sm transition-colors ${isDark ? 'text-kartel-gold hover:text-kartel-gold/80' : 'text-kartel-gold hover:text-kartel-gold/80'}`}>
            View All →
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                    <tr className={isDark ? 'bg-white/[0.02]' : 'bg-kartel-white-50'}>
                  <th className={`px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Order ID</th>
                  <th className={`px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Customer</th>
                  <th className={`px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Amount</th>
                  <th className={`px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Date</th>
                  <th className={`px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-muted' : 'text-black/40'}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-black/[0.04]'}`}>
                {recentOrders.map((order, i) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                     className={`transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-kartel-white-50'}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>
                        {order.orderNumber || `CJ-${order._id.slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`text-sm ${isDark ? 'text-body' : 'text-black/70'}`}>{order.user?.name || 'Guest'}</p>
                        <p className={`text-xs ${isDark ? 'text-muted' : 'text-black/40'}`}>{order.user?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${isDark ? 'text-heading' : 'text-kartel-black-900'}`}>{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                        order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                        order.status === 'processing' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                        isDark ? 'bg-white/10 text-muted border border-white/[0.1]' : 'bg-black/[0.05] text-black/50 border border-black/[0.1]'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${isDark ? 'text-muted' : 'text-black/40'}`}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href="/admin/orders" 
                        className={`text-xs transition-colors ${isDark ? 'text-kartel-gold hover:text-kartel-gold/70' : 'text-kartel-gold hover:text-kartel-gold/80'}`}
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
             <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'glass-card' : 'bg-kartel-white-50'}`}>
               <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-muted' : 'text-black/40'}`} />
            </div>
            <p className={isDark ? 'text-muted' : 'text-black/50'}>No orders yet</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-muted/50' : 'text-black/30'}`}>Orders will appear here when customers purchase</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}