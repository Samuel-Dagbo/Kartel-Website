'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Percent, Plus, X, Search, Tag, Calendar, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface Discount {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
  createdAt: string
}

export default function DiscountsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Discount | null>(null)
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minPurchase: 0,
    maxUses: 0,
    expiresAt: '',
  })

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = () => {
    fetch('/api/admin/discounts')
      .then((r) => r.json())
      .then((data) => { setDiscounts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ code: '', type: 'percentage', value: 0, minPurchase: 0, maxUses: 0, expiresAt: '' })
    setModal(true)
  }

  const openEdit = (d: Discount) => {
    setEditing(d)
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minPurchase: d.minPurchase,
      maxUses: d.maxUses,
      expiresAt: new Date(d.expiresAt).toISOString().split('T')[0],
    })
    setModal(true)
  }

  const handleSave = async () => {
    const url = editing ? `/api/admin/discounts?id=${editing._id}` : '/api/admin/discounts'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setModal(false)
      fetchDiscounts()
    }
  }

  const toggleActive = async (d: Discount) => {
    await fetch(`/api/admin/discounts?id=${d._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !d.isActive }),
    })
    fetchDiscounts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount code?')) return
    await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' })
    fetchDiscounts()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = discounts.filter(
    (d) => d.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Discounts</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Manage promo codes and coupons</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl flex items-center gap-2 transition-all hover:shadow-gold-glow"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Discount
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-kartel-black-400'}`} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search by code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
            isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900 placeholder:text-black/25'
          }`}
        />
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((discount) => (
          <motion.div
            key={discount._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-5 rounded-2xl border transition-colors duration-300 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            } ${!discount.isActive ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kartel-gold/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className={`font-bold text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{discount.code}</p>
                  <p className={`text-xs ${isDark ? 'text-white/30' : 'text-kartel-black-400'}`}>
                    {discount.type === 'percentage' ? `${discount.value}% Off` : `GHS ${discount.value} Off`}
                  </p>
                </div>
              </div>
              <button onClick={() => toggleActive(discount)} className="text-kartel-gold">
                {discount.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-1.5 mb-4">
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>
                Min purchase: GHS {discount.minPurchase.toLocaleString()}
              </p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>
                Used: {discount.usedCount}/{discount.maxUses || '∞'}
              </p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>
                  Expires: {new Date(discount.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(discount)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isDark ? 'border-white/[0.06] text-white/50 hover:text-white' : 'border-black/[0.06] text-kartel-black-500 hover:text-kartel-black-900'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(discount._id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className={`col-span-full text-center py-16 text-sm ${isDark ? 'text-white/30' : 'text-kartel-black-300'}`}>
            No discounts found
          </p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl p-6 transition-colors ${
                isDark ? 'bg-kartel-black-950 border border-white/[0.06]' : 'bg-white border border-black/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{editing ? 'Edit Discount' : 'Add Discount'}</h3>
                <button onClick={() => setModal(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-kartel-black-400'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Discount Code</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                      isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                    }`}
                    placeholder="SUMMER20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                        isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                      }`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Value</label>
                    <input
                      type="number"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                        isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Min Purchase Amount</label>
                  <input
                    type="number"
                    value={form.minPurchase}
                    onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                      isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Max Uses (0 = unlimited)</label>
                    <input
                      type="number"
                      value={form.maxUses}
                      onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                        isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Expiry Date</label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                        isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setModal(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                      isDark ? 'border-white/[0.06] text-white/50 hover:text-white' : 'border-black/[0.06] text-kartel-black-500 hover:text-kartel-black-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl transition-all hover:shadow-gold-glow"
                  >
                    {editing ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
