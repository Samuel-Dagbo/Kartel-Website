'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Search, Plus, Minus, ShoppingCart, Trash2, X, CreditCard, Printer, CheckCircle, User, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface POSProduct {
  _id: string
  name: string
  price: number
  images: string[]
  quantity: number
  brand: string
  category: string
}

interface CartItem {
  product: POSProduct
  quantity: number
}

export default function POSPage() {
  const { data: session } = useSession()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [products, setProducts] = useState<POSProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkoutModal, setCheckoutModal] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        const mapped = (Array.isArray(data) ? data : []).map((p: POSProduct) => ({
          ...p,
          quantity: p.quantity || 0,
        }))
        setProducts(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory.toLowerCase()
    return matchSearch && matchCategory && p.quantity > 0
  })

  const addToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id)
      if (existing) {
        if (existing.quantity >= product.quantity) return prev
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            name: customerName || session?.user?.name || 'POS Customer',
            email: customerEmail || session?.user?.email || 'pos@carljones.com',
            street: 'In-Store Purchase',
            city: 'In-Store',
            state: 'N/A',
            zip: '00000',
            country: 'In-Store',
            phone: 'N/A',
          },
          totalAmount: total,
          paymentStatus: 'completed',
        }),
      })

      if (!res.ok) throw new Error('Checkout failed')

      setSuccess(true)
      setTimeout(() => {
        setCart([])
        setCheckoutModal(false)
        setSuccess(false)
        setCustomerName('')
        setCustomerEmail('')
        setProcessing(false)
      }, 2000)
    } catch {
      setProcessing(false)
      alert('Checkout failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const categories = ['All', 'Mens', 'Womens', 'Unisex', 'Niche']

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Products Panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search & Filter */}
        <div className={`p-4 rounded-2xl border mb-4 transition-colors duration-300 ${
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-kartel-black-400'}`} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                  isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900 placeholder:text-black/25'
                }`}
                autoFocus
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-kartel-gold text-kartel-black'
                      : isDark
                        ? 'bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.06]'
                        : 'bg-black/[0.03] text-kartel-black-500 hover:text-kartel-black-900 hover:bg-black/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((product) => (
              <motion.button
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => addToCart(product)}
                disabled={product.quantity === 0}
                className={`p-3 rounded-xl border text-left transition-all duration-200 hover:border-kartel-gold/30 hover:shadow-sm ${
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                } ${product.quantity === 0 ? 'opacity-40' : 'cursor-pointer'}`}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-kartel-gold/5 to-kartel-gold/10 flex items-center justify-center mb-2 overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-kartel-gold/30" strokeWidth={1} />
                  )}
                </div>
                <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{product.name}</p>
                <p className="text-kartel-gold text-xs font-bold mt-1">{formatPrice(product.price)}</p>
                <p className={`text-[10px] ${isDark ? 'text-white/30' : 'text-kartel-black-400'}`}>Stock: {product.quantity}</p>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <p className={`col-span-full text-center py-20 text-sm ${isDark ? 'text-white/30' : 'text-kartel-black-300'}`}>
                No products found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className={`w-full lg:w-96 flex flex-col rounded-2xl border transition-colors duration-300 ${
        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      }`}>
        {/* Cart Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Current Sale</span>
          </div>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3" strokeWidth={1} />
              <p className={`text-sm ${isDark ? 'text-white/30' : 'text-kartel-black-300'}`}>Cart is empty</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/20' : 'text-kartel-black-200'}`}>Tap a product to add</p>
            </div>
          )}
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-kartel-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-kartel-gold/50" strokeWidth={1} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{item.product.name}</p>
                  <p className="text-kartel-gold text-xs font-bold">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.product._id, -1)}
                    className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-black/[0.06] text-kartel-black-400'}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className={`w-7 text-center text-sm font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product._id, 1)}
                    disabled={item.quantity >= item.product.quantity}
                    className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-black/[0.06] text-kartel-black-400'}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Footer */}
        <div className={`p-4 border-t space-y-3 ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-kartel-black-500'}`}>Total</span>
            <span className={`text-2xl font-bold text-kartel-gold`}>{formatPrice(total)}</span>
          </div>
          <button
            onClick={() => setCheckoutModal(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:shadow-gold-glow"
          >
            <CreditCard className="w-4 h-4" strokeWidth={2} />
            Checkout (GHS {total.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl p-6 transition-colors ${
                isDark ? 'bg-kartel-black-950 border border-white/[0.06]' : 'bg-white border border-black/[0.06]'
              }`}
            >
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Sale Complete!</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Receipt printed</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Complete Sale</h3>
                    <button onClick={() => setCheckoutModal(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-kartel-black-400'}`}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Order Summary */}
                  <div className={`max-h-40 overflow-y-auto space-y-2 mb-4 p-3 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
                    {cart.map((item) => (
                      <div key={item.product._id} className="flex justify-between text-sm">
                        <span className={`${isDark ? 'text-white/70' : 'text-kartel-black-700'}`}>{item.product.name} × {item.quantity}</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Total</span>
                    <span className="text-xl font-bold text-kartel-gold">{formatPrice(total)}</span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 mb-6">
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-kartel-black-400'}`} strokeWidth={1.5} />
                      <input
                        type="text"
                        placeholder="Customer name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                          isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900 placeholder:text-black/25'
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <Package className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-kartel-black-400'}`} strokeWidth={1.5} />
                      <input
                        type="email"
                        placeholder="Customer email (optional)"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
                          isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900 placeholder:text-black/25'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutModal(false)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                        isDark ? 'border-white/[0.06] text-white/50 hover:text-white' : 'border-black/[0.06] text-kartel-black-500 hover:text-kartel-black-900'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="flex-1 py-3 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-kartel-black/30 border-t-kartel-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <Printer className="w-4 h-4" strokeWidth={2} />
                          Complete Sale
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
