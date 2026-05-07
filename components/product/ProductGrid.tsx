'use client'

import { Product as ProductType } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { motion } from 'framer-motion'
import { PackageX } from 'lucide-react'

interface ProductGridProps {
  products: ProductType[]
}

export function ProductGrid({ products }: ProductGridProps) {
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
          <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-8">
            <PackageX className="w-8 h-8 text-white/20" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-white/70 mb-3">
            No products found
          </h3>
          <p className="text-base text-white/35 max-w-sm leading-relaxed">
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
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
    >
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </motion.div>
  )
}
