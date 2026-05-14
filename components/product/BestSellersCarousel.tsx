'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { toast } from '@/components/ui/use-toast'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface BestSellersCarouselProps {
  products?: Product[]
}

export default function BestSellersCarousel({ products = [] }: BestSellersCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { addItem } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const displayedProducts = products.length > 0 ? products : []

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % displayedProducts.length)
  }, [displayedProducts.length])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + displayedProducts.length) % displayedProducts.length)
  }, [displayedProducts.length])

  useEffect(() => {
    if (displayedProducts.length === 0 || isPaused) return
    const timer = setInterval(() => {
      handleNext()
    }, 10000)
    return () => clearInterval(timer)
  }, [displayedProducts.length, handleNext, isPaused])

  if (displayedProducts.length === 0) return null

  const product = displayedProducts[current]
  const rating = Math.round(product?.rating || 0)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product) return
    addItem({ product, quantity: 1 })
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
  }

  return (
    <section className={`section-padding relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-secondary' : 'bg-kartel-cream'
      }`}>
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-kartel-gold/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-[-5%] w-[400px] h-[400px] bg-kartel-gold/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/15 to-transparent" />

      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-4 sm:mb-6 px-4 sm:px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
            Most Loved
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-[1.05] tracking-[-0.02em]">
            Best <span className="text-gradient">Sellers</span>
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed">
            Our customers&apos; favorite fragrances, curated for you.
          </p>
        </motion.div>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center"
        >
          {/* Content - Left Side */}
          <div className="relative order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={product._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5 sm:space-y-7"
              >
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-kartel-gold/60">
                    {product.brand || 'CARL JONES'}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] font-bold text-heading mt-2 sm:mt-3 leading-[1.15] text-balance">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-5">
                    <div className="flex gap-0.5 sm:gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < rating
                              ? 'text-kartel-gold fill-kartel-gold'
                              : isDark ? 'text-white/10' : 'text-black/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs sm:text-sm ${
                      isDark ? 'text-white/40' : 'text-kartel-black-400'
                    }`}>
                      {product.rating} ({product.reviewCount || 0})
                    </span>
                  </div>
                </div>

                <p className={`text-sm sm:text-base leading-[1.7] sm:leading-[1.8] line-clamp-2 sm:line-clamp-none max-w-md ${
                  isDark ? 'text-white/40' : 'text-kartel-black-500'
                }`}>
                  {product.description}
                </p>

                <div className="flex items-baseline gap-3 sm:gap-4">
                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-kartel-black-900'
                  }`}>
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className={`text-base sm:text-lg line-through ${
                      isDark ? 'text-white/25' : 'text-kartel-black-400'
                    }`}>
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black text-xs sm:text-sm font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full overflow-hidden shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500"
                  >
                    <span className="relative z-10">View Details</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={handleAddToCart}
                    className={`group inline-flex items-center gap-2 border text-xs sm:text-sm font-medium px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 ${
                      isDark
                        ? 'bg-white/[0.04] hover:bg-kartel-gold/[0.08] border-white/[0.06] hover:border-kartel-gold/25 text-white/80 hover:text-kartel-gold'
                        : 'bg-black/[0.03] hover:bg-kartel-gold/[0.08] border-black/[0.08] hover:border-kartel-gold/25 text-kartel-black-500 hover:text-kartel-gold'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2} />
                    Add to Bag
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-4 mt-14">
              <button
                onClick={handlePrev}
                className={`group p-3.5 rounded-full border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.05] hover:bg-kartel-gold/[0.08] hover:border-kartel-gold/25 text-white/30 hover:text-kartel-gold'
                    : 'bg-black/[0.03] border-black/[0.06] hover:bg-kartel-gold/[0.08] hover:border-kartel-gold/25 text-kartel-black-400 hover:text-kartel-gold'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className={`group p-3.5 rounded-full border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.05] hover:bg-kartel-gold/[0.08] hover:border-kartel-gold/25 text-white/30 hover:text-kartel-gold'
                    : 'bg-black/[0.03] border-black/[0.06] hover:bg-kartel-gold/[0.08] hover:border-kartel-gold/25 text-kartel-black-400 hover:text-kartel-gold'
                }`}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
              </button>
              <div className="flex gap-2.5 ml-4">
                {displayedProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > current ? 1 : -1)
                      setCurrent(idx)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      idx === current
                        ? 'w-10 bg-kartel-gold'
                        : `w-2 ${isDark ? 'bg-white/10 hover:bg-white/25' : 'bg-black/10 hover:bg-black/25'}`
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Image - Right Side */}
          <div className="relative order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${product._id}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-lg"
              >
                {/* Background glow */}
                <div className="absolute inset-0 -m-10 bg-kartel-gold/[0.04] rounded-full blur-[100px]" />
                <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-kartel-gold/[0.025] via-transparent to-kartel-gold/[0.015] rounded-full blur-[80px]" />

                <div className="relative z-10 w-full h-full p-5 sm:p-8">
                  <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden border shadow-luxury-xl ${
                    isDark
                      ? 'border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent'
                      : 'border-black/[0.06] bg-gradient-to-b from-black/[0.02] to-transparent'
                  }`}>
                    <Image
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=735&auto=format&fit=crop'
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6 sm:p-8 drop-shadow-2xl"
                      loading="lazy"
                    />

                    {/* Decorative elements */}
                    <div className="absolute top-6 left-6 w-10 h-10 rounded-full border border-kartel-gold/[0.08] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-kartel-gold/25" />
                    </div>
                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md border ${
                      isDark
                        ? 'bg-kartel-black/40 border-white/[0.04]'
                        : 'bg-white/60 border-black/[0.06]'
                    }`}>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-kartel-gold/60">Bestseller</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                className={`p-3.5 rounded-full border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.05] text-white/30 hover:text-kartel-gold hover:border-kartel-gold/25'
                    : 'bg-black/[0.03] border-black/[0.06] text-kartel-black-400 hover:text-kartel-gold hover:border-kartel-gold/25'
                }`}
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="flex gap-2">
                {displayedProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > current ? 1 : -1)
                      setCurrent(idx)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === current ? 'w-8 bg-kartel-gold' : `w-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className={`p-3.5 rounded-full border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.05] text-white/30 hover:text-kartel-gold hover:border-kartel-gold/25'
                    : 'bg-black/[0.03] border-black/[0.06] text-kartel-black-400 hover:text-kartel-gold hover:border-kartel-gold/25'
                }`}
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
