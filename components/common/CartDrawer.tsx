'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/providers/CartProvider'
import { formatPrice } from '@/lib/utils'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'

export function CartDrawer() {
  const { items, isOpen, removeItem, updateQuantity, totalPrice, setCartOpen } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md border-l shadow-2xl flex flex-col backdrop-blur-2xl"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              backgroundColor: isDark ? 'rgba(10, 10, 10, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
                <h2 className={`font-serif text-xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Your Bag</h2>
                {items.length > 0 && (
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDark
                    ? 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    : 'text-black/50 hover:text-black-900 hover:bg-black/[0.04]'
                }`}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/[0.05] border border-white/[0.08]' : 'bg-black/[0.03] border border-black/[0.08]'
                  }`}>
                    <ShoppingBag className={`w-7 h-7 ${isDark ? 'text-white/40' : 'text-black/40'}`} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <p className={`text-base font-medium ${isDark ? 'text-white/80' : 'text-black/70'}`}>Your bag is empty</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      Discover your next signature scent.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2"
                    onClick={() => setCartOpen(false)}
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: 60,
                          transition: { duration: 0.3 },
                        }}
                        className={`flex gap-4 p-3 rounded-xl border transition-colors ${
                          isDark
                            ? 'bg-white/[0.04] border-white/[0.08] hover:border-kartel-gold/[0.15]'
                            : 'bg-black/[0.02] border-black/[0.08] hover:border-kartel-gold/20'
                        }`}
                      >
                        <div className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border ${
                          isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
                        }`}>
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <h3 className={`font-serif text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                                {item.product.name}
                              </h3>
                              <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                                {item.product.brand}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              className={`p-1.5 rounded-full transition-all shrink-0 ${
                                isDark
                                  ? 'text-white/40 hover:text-red-500 hover:bg-red-500/10'
                                  : 'text-black/40 hover:text-red-500 hover:bg-red-50'
                              }`}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className={`flex items-center gap-2 rounded-full px-2.5 py-1 border ${
                              isDark
                                ? 'bg-white/[0.04] border-white/[0.08]'
                                : 'bg-black/[0.02] border-black/[0.08]'
                            }`}>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product._id, item.quantity - 1)
                                }
                                className={`p-1 transition-colors ${
                                  isDark ? 'text-white/50 hover:text-kartel-gold' : 'text-black/50 hover:text-kartel-gold'
                                }`}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" strokeWidth={2} />
                              </button>
                              <span className={`text-sm font-medium w-5 text-center ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product._id, item.quantity + 1)
                                }
                                className={`p-1 transition-colors ${
                                  isDark ? 'text-white/50 hover:text-kartel-gold' : 'text-black/50 hover:text-kartel-gold'
                                }`}
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" strokeWidth={2} />
                              </button>
                            </div>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-6 border-t space-y-4 flex-shrink-0"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className={isDark ? 'text-white/50' : 'text-black/50'}>Subtotal</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Total</span>
                    <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
                <p className={`text-xs text-center ${isDark ? 'text-white/55' : 'text-black/60'}`}>
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  onClick={() => setCartOpen(false)}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className={`w-full py-3 text-sm text-center transition-colors ${
                    isDark ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black-900'
                  }`}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
