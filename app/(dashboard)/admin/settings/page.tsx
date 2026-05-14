'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Save, Building2, Mail, Phone, MapPin, DollarSign, Truck, Bell, Package } from 'lucide-react'

interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  taxRate: number
  shippingFee: number
  freeShippingThreshold: number
  orderPrefix: string
  lowStockThreshold: number
  emailNotifications: boolean
}

export default function SettingsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [form, setForm] = useState<StoreSettings>({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'GHS',
    taxRate: 0,
    shippingFee: 0,
    freeShippingThreshold: 0,
    orderPrefix: 'CJ',
    lowStockThreshold: 10,
    emailNotifications: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return
        setForm({
          storeName: data.storeName || '',
          storeEmail: data.storeEmail || '',
          storePhone: data.storePhone || '',
          storeAddress: data.storeAddress || '',
          currency: data.currency || 'GHS',
          taxRate: data.taxRate || 0,
          shippingFee: data.shippingFee || 0,
          freeShippingThreshold: data.freeShippingThreshold || 0,
          orderPrefix: data.orderPrefix || 'CJ',
          lowStockThreshold: data.lowStockThreshold || 10,
          emailNotifications: data.emailNotifications ?? true,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const sections = [
    {
      title: 'Store Information',
      icon: Building2,
      fields: [
        { key: 'storeName', label: 'Store Name', type: 'text', icon: Building2 },
        { key: 'storeEmail', label: 'Store Email', type: 'email', icon: Mail },
        { key: 'storePhone', label: 'Phone Number', type: 'text', icon: Phone },
        { key: 'storeAddress', label: 'Address', type: 'text', icon: MapPin },
      ],
    },
    {
      title: 'Pricing & Shipping',
      icon: DollarSign,
      fields: [
        { key: 'currency', label: 'Currency', type: 'text', icon: DollarSign },
        { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', icon: DollarSign },
        { key: 'shippingFee', label: 'Shipping Fee', type: 'number', icon: Truck },
        { key: 'freeShippingThreshold', label: 'Free Shipping Threshold', type: 'number', icon: Truck },
      ],
    },
    {
      title: 'System Preferences',
      icon: Package,
      fields: [
        { key: 'orderPrefix', label: 'Order Number Prefix', type: 'text', icon: Package },
        { key: 'lowStockThreshold', label: 'Low Stock Threshold', type: 'number', icon: Package },
      ],
    },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Settings</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-gold-glow"
        >
          <Save className="w-4 h-4" strokeWidth={2} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {sections.map((section) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border transition-colors duration-300 ${
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-kartel-gold/10 flex items-center justify-center">
              <section.icon className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
            </div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{section.title}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-kartel-black-400'}`} strokeWidth={1.5} />
                  <input
                    type={field.type}
                    value={String((form as unknown as Record<string, unknown>)[field.key] ?? '')}
                    onChange={(e) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                      isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-kartel-gold/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
          </div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Notifications</h3>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm({ ...form, emailNotifications: !form.emailNotifications })}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.emailNotifications ? 'bg-kartel-gold' : isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.emailNotifications ? 'translate-x-5' : ''}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Enable Email Notifications</p>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-kartel-black-400'}`}>Receive order and low stock alerts</p>
          </div>
        </label>
      </motion.div>
    </div>
  )
}
