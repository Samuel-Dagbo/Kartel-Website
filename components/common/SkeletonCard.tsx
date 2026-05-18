'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

export function Shimmer({ className = '' }: { className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent ${
        isDark ? 'via-white/[0.06]' : 'via-black/[0.04]'
      } to-transparent`} />
    </div>
  )
}

export function SkeletonCard({ index = 0 }: { index?: number }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`overflow-hidden rounded-2xl border transition-colors ${
        isDark
          ? 'bg-white/[0.03] border-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06]'
      }`}>
        <div className={`aspect-[4/5] relative ${
          isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'
        }`}>
          <Shimmer className="absolute inset-0" />
        </div>
        <div className="p-5 space-y-3">
          <div className={`h-3 w-16 rounded-full animate-pulse ${
            isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'
          }`} />
          <div className={`h-5 w-3/4 rounded-full animate-pulse ${
            isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'
          }`} />
          <div className={`h-3 w-full rounded-full animate-pulse ${
            isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
          }`} />
          <div className="flex justify-between pt-1">
            <div className={`h-6 w-14 rounded-full animate-pulse ${
              isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'
            }`} />
            <div className={`h-3 w-20 rounded-full animate-pulse ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function SkeletonHero() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen flex items-center">
      <div className="container-luxury w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className={`h-8 w-56 rounded-full animate-pulse ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`} />
            <div className={`h-16 w-3/4 rounded-2xl animate-pulse ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`} />
            <div className={`h-16 w-full rounded-2xl animate-pulse ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`} />
            <div className={`h-14 w-40 rounded-full animate-pulse ${
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            }`} />
          </div>
          <div className={`aspect-[4/5] max-w-[520px] rounded-3xl relative border ${
            isDark
              ? 'bg-white/[0.02] border-white/[0.04]'
              : 'bg-black/[0.02] border-black/[0.06]'
          }`}>
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 ${
        isDark
          ? 'bg-white/[0.03] border-white/[0.05]'
          : 'bg-black/[0.03] border-black/[0.06]'
      }`}>
        <Icon className={`w-7 h-7 ${isDark ? 'text-white/15' : 'text-black/40'}`} strokeWidth={1.5} />
      </div>
      <h3 className={`font-serif text-xl font-semibold mb-2 ${
        isDark ? 'text-white/70' : 'text-kartel-black-700'
      }`}>
        {title}
      </h3>
      <p className={`text-body-sm max-w-sm ${
        isDark ? 'text-white/35' : 'text-black/40'
      }`}>{description}</p>
    </motion.div>
  )
}
