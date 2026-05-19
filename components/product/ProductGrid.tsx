'use client'

import { Product as ProductType } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { motion } from 'framer-motion'
import { PackageX } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ProductGridProps {
  products: ProductType[]
  viewMode?: 'grid' | 'list'
}

export function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center relative"
      >
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-kartel-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 ${
            isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-black/[0.03] border border-black/[0.08]'
          }`}>
            <PackageX className={`w-8 h-8 ${isDark ? 'text-white/30' : 'text-black/30'}`} strokeWidth={1.5} />
          </div>
          <h3 className={`font-serif text-2xl font-semibold mb-3 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            No products found
          </h3>
          <p className={`text-base max-w-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            Try adjusting your filters or search terms to find what you&apos;re
            looking for.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'
          : 'grid grid-cols-1 gap-6'
      }
    >
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} variant={viewMode === 'list' ? 'list' : 'default'} />
      ))}
    </motion.div>
  )
}
