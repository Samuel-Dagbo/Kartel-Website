'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      key={theme} // re-render on theme change to apply correct bg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen transition-colors duration-300"
      style={{
        paddingTop: '4.5rem',
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-kartel-black' : 'bg-kartel-cream'
        }`}
      >
        {children}
      </div>
    </motion.div>
  )
}
