'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { TrendingUp, ShoppingBag, DollarSign, Package, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts'

interface Analytics {
  totalOrders: number
  thisMonthOrders: number
  totalRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  totalProducts: number
  totalUsers: number
  ordersByStatus: Record<string, number>
  monthlyRevenue: { month: string; revenue: number; orders: number }[]
  dailyRevenue: { _id: string; revenue: number; orders: number }[]
}

export default function AnalyticsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-muted text-center py-20">Failed to load analytics.</p>
  }

  const revenueChange = data.lastMonthRevenue > 0
    ? ((data.thisMonthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue * 100).toFixed(1)
    : 0

  const stats = [
    { label: 'Total Revenue', value: `GHS ${(data.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, sub: `${revenueChange}% vs last month`, up: Number(revenueChange) >= 0 },
    { label: 'Total Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag, sub: `${data.thisMonthOrders} this month`, up: true },
    { label: 'Products', value: data.totalProducts.toLocaleString(), icon: Package, sub: `${data.totalUsers} registered users`, up: true },
    { label: 'Avg Order Value', value: `GHS ${data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(0) : 0}`, icon: TrendingUp, sub: `${Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0)} total orders`, up: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Analytics</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Track your store&apos;s performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl border transition-colors duration-300 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stat.label}</span>
              <div className="w-9 h-9 rounded-lg bg-kartel-gold/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-kartel-gold" strokeWidth={1.5} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{stat.value}</p>
            <p className={`text-xs mt-1.5 flex items-center gap-1 ${
              stat.up ? 'text-green-500' : 'text-red-400'
            }`}>
              {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      }`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Monthly Revenue</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDark ? '#888' : '#999' }} />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#888' : '#999' }} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1c1c1c' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Orders by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(data.ordersByStatus).map(([status, count]) => ({ status, count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: isDark ? '#888' : '#999' }} />
                <YAxis tick={{ fontSize: 12, fill: isDark ? '#888' : '#999' }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1c1c1c' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Daily Revenue (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis dataKey="_id" tick={false} />
                <YAxis tick={{ fontSize: 12, fill: isDark ? '#888' : '#999' }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1c1c1c' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
