'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Download, FileText, TrendingUp, ShoppingBag, DollarSign, Users, Package, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface ReportsData {
  summary: {
    totalRevenue: number
    totalOrders: number
    cancelledOrders: number
    avgOrderValue: number
    totalProductsSold: number
  }
  topCategories: { _id: string; count: number }[]
  ordersByMonth: { _id: { year: number; month: number }; revenue: number; orders: number }[]
  ordersByStatus: { _id: string; count: number }[]
}

export default function ReportsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/reports')
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
    return <p className="text-muted text-center py-20">Failed to load reports.</p>
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  }

  const summaryCards = [
    { label: 'Total Revenue', value: `GHS ${data.summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: data.summary.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Avg Order Value', value: `GHS ${data.summary.avgOrderValue.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Products Sold', value: data.summary.totalProductsSold.toLocaleString(), icon: Package, color: 'text-kartel-gold' },
    { label: 'Cancelled Orders', value: data.summary.cancelledOrders.toLocaleString(), icon: XCircle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Reports</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Business performance overview</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl flex items-center gap-2 transition-all hover:shadow-gold-glow"
        >
          <Download className="w-4 h-4" strokeWidth={2} />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className={`p-4 rounded-2xl border transition-colors ${
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} strokeWidth={1.5} />
            </div>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Month */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Orders by Month</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ordersByMonth.map((r) => ({
                  month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
                  orders: r.orders,
                  revenue: r.revenue,
                })).reverse()}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#888' : '#999' }} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#888' : '#999' }} />
                <Tooltip contentStyle={{ background: isDark ? '#1c1c1c' : '#fff', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="orders" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Order Status Distribution</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ordersByStatus.map((s) => ({ name: s._id, value: s.count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {data.ordersByStatus.map((s) => (
                    <Cell key={s._id} fill={statusColors[s._id] || '#888'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: isDark ? '#1c1c1c' : '#fff', border: 'none', borderRadius: '12px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Product Categories</h3>
          </div>
          <div className="space-y-3">
            {data.topCategories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <span className={`text-sm capitalize ${isDark ? 'text-white/70' : 'text-kartel-black-700'}`}>{cat._id}</span>
                <div className="flex items-center gap-3">
                  <div className={`w-24 sm:w-32 h-2 rounded-full ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`}>
                    <div
                      className="h-full rounded-full bg-kartel-gold"
                      style={{ width: `${Math.min(100, (cat.count / Math.max(...data.topCategories.map((c) => c.count))) * 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium w-8 text-right ${isDark ? 'text-white/50' : 'text-kartel-black-500'}`}>{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
