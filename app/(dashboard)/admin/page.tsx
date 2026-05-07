'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Settings,
  Plus
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
import { ChevronRight } from 'lucide-react'
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
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
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
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Business Overview</h1>
          <p className="text-white/60">Real-time performance tracking and analytics for KARTEL.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory
          </Link>
          <Link href="/admin/products" className="px-4 py-2 rounded-lg bg-kartel-gold text-kartel-black text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Revenue', 
            value: formatPrice(stats.totalRevenue), 
            change: '+12.5%', 
            trend: 'up', 
            icon: DollarSign, 
            color: 'text-green-400' 
          },
          { 
            label: 'Total Orders', 
            value: stats.totalOrders.toString(), 
            change: '+8.2%', 
            trend: 'up', 
            icon: ShoppingBag, 
            color: 'text-blue-400' 
          },
          { 
            label: 'Customers', 
            value: stats.totalCustomers.toString(), 
            change: '+2.4%', 
            trend: 'up', 
            icon: Users, 
            color: 'text-pink-400' 
          },
          { 
            label: 'Avg. Order Value', 
            value: formatPrice(stats.avgOrderValue), 
            change: '+4.1%', 
            trend: 'up', 
            icon: TrendingUp, 
            color: 'text-kartel-gold' 
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="luxury-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 luxury-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-white">Revenue Overview</h3>
          </div>
          <div className="h-[350px] w-full flex items-center justify-center text-white/40">
            {orders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orders.slice(0, 10).map((o, i) => ({ name: `#${i + 1}`, sales: o.totalAmount }))}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff20', color: '#fff' }} itemStyle={{ color: '#D4AF37' }} />
                  <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No order data yet</p>
            )}
          </div>
        </div>

        <div className="luxury-card p-8">
          <h3 className="font-serif text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'View Inventory', icon: Package, href: '/admin/products' },
              { label: 'Manage Orders', icon: ShoppingBag, href: '/admin/orders' },
              { label: 'Add Product', icon: Plus, href: '/admin/products' },
            ].map((action, i) => (
              <Link 
                key={i} 
                href={action.href}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-5 h-5 text-white/40 group-hover:text-kartel-gold transition-colors" />
                  <span className="text-sm text-white/80">{action.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-white">Recent Transactions</h3>
          <Link href="/admin/orders" className="text-sm text-kartel-gold hover:underline">View All Orders</Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-medium">Order ID</th>
                  <th className="px-8 py-4 font-medium">Customer</th>
                  <th className="px-8 py-4 font-medium">Total</th>
                  <th className="px-8 py-4 font-medium">Status</th>
                  <th className="px-8 py-4 font-medium">Date</th>
                  <th className="px-8 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order, i) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 text-sm font-medium text-white">
                      {order.orderNumber || `KARTEL-${order._id.slice(-6).toUpperCase()}`}
                    </td>
                    <td className="px-8 py-4 text-sm text-white/80">{order.user?.name || 'Unknown'}</td>
                    <td className="px-8 py-4 text-sm font-bold text-white">{formatPrice(order.totalAmount)}</td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-white/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Link href="/admin/orders" className="text-xs text-kartel-gold hover:underline">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-white/60">
            No orders yet
          </div>
        )}
      </div>
    </div>
  )
}