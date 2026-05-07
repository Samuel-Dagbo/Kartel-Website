'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/components/providers/CartProvider'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, index = 0, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart()

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative bg-gradient-to-b from-kartel-black-900/40 to-transparent rounded-2xl overflow-hidden border border-white/[0.04] hover:border-kartel-gold/[0.15] transition-all duration-700 shadow-luxury hover:shadow-luxury-xl">
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
              className="object-cover transition-all duration-1000 ease-out scale-105 group-hover:scale-100 brightness-90 group-hover:brightness-100"
            />

            {/* Multi-layer gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-kartel-black via-kartel-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kartel-black/60" />

            {/* Hover overlay with CTAs */}
            <div className="absolute inset-0 bg-kartel-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[4px]">
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
                className="p-4 rounded-full bg-white/90 text-kartel-black transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150"
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
                <span className="px-4 py-1.5 bg-white/90 text-kartel-black text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
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
            <h3 className="font-serif text-lg lg:text-xl font-semibold text-white/90 group-hover:text-kartel-gold transition-colors duration-500 line-clamp-2 leading-tight">
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
                      : 'text-white/15'
                  )}
                />
              ))}
              <span className="text-[11px] text-white/30 ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-xl font-bold text-white tracking-tight">
                ${product.price}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-white/30 line-through">
                  ${product.comparePrice}
                </span>
              )}
            </div>
          </div>

          {/* Bottom decoratve element */}
          <div className="absolute bottom-5 right-5 w-6 h-6 rounded-full border border-kartel-gold/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-1.5 h-1.5 rounded-full bg-kartel-gold/20" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
