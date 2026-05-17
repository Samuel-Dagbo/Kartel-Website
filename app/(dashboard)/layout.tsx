'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const pathname = usePathname()
  const isDark = theme === 'dark'
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen transition-colors duration-300"
    >
      <div
        className={`min-h-screen pt-28 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDark ? 'bg-kartel-black' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
