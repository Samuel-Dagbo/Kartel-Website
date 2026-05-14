'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/login')
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-kartel-black' : 'bg-kartel-cream'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-kartel-black-400'}`}>Loading...</span>
        </div>
      </div>
    )
  }

  if (session.user.role === 'admin') {
    router.replace('/admin')
    return null
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
          isDark ? 'bg-kartel-black' : 'bg-kartel-cream'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </motion.div>
  )
}