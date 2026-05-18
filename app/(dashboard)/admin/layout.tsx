'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Menu, Bell, Search, Sun, Moon, User } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/login')
    } else if (session.user?.role !== 'admin') {
      router.replace('/customer')
    }
  }, [session, status, router])

  if (status === 'loading' || !session || session.user?.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-kartel-black' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-kartel-black' : 'bg-white'}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top navigation bar */}
      <header
        className={`sticky top-[4.5rem] lg:top-24 z-30 transition-all duration-300 border-b backdrop-blur-xl ${
          isDark
            ? 'bg-kartel-black-950/80 border-white/[0.08]'
            : 'bg-white/80 border-black/[0.08]'
        } ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  : 'text-black/60 hover:text-black-900 hover:bg-black/[0.04]'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-white/35' : 'text-black/35'
              }`} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-9 pr-4 py-2 rounded-xl text-sm w-64 transition-colors focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 ${
                  isDark
                    ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/35'
                    : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/35'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                  : 'text-black/50 hover:text-black-900 hover:bg-black/[0.04]'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className={`p-2 rounded-lg transition-colors relative ${
                isDark
                  ? 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                  : 'text-black/40 hover:text-kartel-black-900 hover:bg-black/[0.05]'
              }`}
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-kartel-gold" />
            </button>
            <div className={`flex items-center gap-2 ml-2 pl-2 border-l transition-colors ${
              isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kartel-gold to-kartel-gold-dark flex items-center justify-center">
                <User className="w-4 h-4 text-kartel-black" strokeWidth={2} />
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                  {session.user?.name || 'Admin'}
                </p>
                <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
