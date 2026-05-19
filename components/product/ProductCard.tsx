'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/components/providers/CartProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { toast } from '@/components/ui/use-toast'
import { cn, formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
  variant?: 'default' | 'compact' | 'list'
}

export function ProductCard({ product, index = 0, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ product, quantity: 1 })
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href={`/product/${product.slug}`} className="group block">
          <div className="flex gap-5 p-4 glass-card rounded-2xl hover:border-kartel-gold/[0.15] transition-all duration-500 shadow-sm hover:shadow-luxury">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden shrink-0">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="144px"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-kartel-gold/60">
                  {product.brand}
                </p>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-heading group-hover:text-kartel-gold transition-colors duration-500 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted/70 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center gap-1 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.floor(product.rating)
                          ? 'text-kartel-gold fill-kartel-gold'
                          : isDark ? 'text-white/20' : 'text-black/20'
                      )}
                    />
                  ))}
                  <span className="text-[11px] text-muted ml-1.5">
                    ({product.reviewCount || 0})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-lg font-bold text-heading tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-muted line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="p-2.5 rounded-full bg-kartel-gold/10 text-kartel-gold hover:bg-kartel-gold hover:text-kartel-black transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative glass-card rounded-2xl overflow-hidden hover:border-kartel-gold/[0.15] transition-all duration-700 shadow-luxury hover:shadow-luxury-xl">
          {/* Decorative corner */}
          <div className="absolute top-5 right-5 w-8 h-8 rounded-full border border-kartel-gold/[0.08] flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-2 h-2 rounded-full bg-kartel-gold/20" />
          </div>

          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-all duration-1000 ease-out scale-105 group-hover:scale-100"
            />

            {/* Multi-layer gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

            {/* Hover overlay with CTAs */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[4px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="p-4 rounded-full bg-kartel-gold text-kartel-black shadow-gold-glow transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-full glass-dark transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150"
              >
                <Heart className="w-5 h-5" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.featured && (
                <span className="px-4 py-1.5 bg-kartel-gold/90 text-kartel-black text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm shadow-gold-glow">
                  Featured
                </span>
              )}
              {product.comparePrice && discountPercent > 0 && (
                <span className="px-4 py-1.5 bg-red-500/80 text-white text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
                  -{discountPercent}%
                </span>
              )}
              {product.new && (
                <span className="px-4 py-1.5 glass text-kartel-black text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-kartel-gold/60">
              {product.brand}
            </p>
            <h3 className="font-serif text-lg lg:text-xl font-semibold text-heading group-hover:text-kartel-gold transition-colors duration-500 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < Math.floor(product.rating)
                    ? 'text-kartel-gold fill-kartel-gold'
                    : isDark ? 'text-white/30' : 'text-black/30'
                  )}
                />
              ))}
              <span className="text-[11px] text-muted ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-xl font-bold text-heading tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute bottom-5 right-5 w-6 h-6 rounded-full border border-kartel-gold/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-1.5 h-1.5 rounded-full bg-kartel-gold/20" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}