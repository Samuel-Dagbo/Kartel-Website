'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}

export function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="luxury-card overflow-hidden">
        <div className="aspect-[4/5] bg-white/[0.02] relative">
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="p-5 space-y-3">
          <div className="h-3 w-16 bg-white/[0.05] rounded-full animate-pulse" />
          <div className="h-5 w-3/4 bg-white/[0.05] rounded-full animate-pulse" />
          <div className="h-3 w-full bg-white/[0.03] rounded-full animate-pulse" />
          <div className="flex justify-between pt-1">
            <div className="h-6 w-14 bg-white/[0.05] rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-white/[0.03] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function SkeletonHero() {
  return (
    <div className="min-h-screen flex items-center">
      <div className="container-luxury w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="h-8 w-56 bg-white/[0.03] rounded-full animate-pulse" />
            <div className="h-16 w-3/4 bg-white/[0.03] rounded-2xl animate-pulse" />
            <div className="h-16 w-full bg-white/[0.03] rounded-2xl animate-pulse" />
            <div className="h-14 w-40 bg-white/[0.03] rounded-full animate-pulse" />
          </div>
          <div className="aspect-[4/5] max-w-[520px] bg-white/[0.02] rounded-3xl relative border border-white/[0.04]">
            <Shimmer className="absolute inset-0 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading states for various components
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-8 h-8 border-2 border-kartel-gold/20 border-t-kartel-gold rounded-full animate-spin" />
    </div>
  )
}

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your filters or search terms.',
  icon: Icon = ShoppingBag,
}: {
  title?: string
  description?: string
  icon?: React.ElementType
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-white/15" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl font-semibold text-white/70 mb-2">
        {title}
      </h3>
      <p className="text-body-sm text-white/35 max-w-sm">{description}</p>
    </motion.div>
  )
}
