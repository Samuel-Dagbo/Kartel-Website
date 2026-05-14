'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Percent,
  Star,
  FileText,
  CreditCard,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Inventory', icon: Package },
  { href: '/admin/pos', label: 'Point of Sale', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/discounts', label: 'Discounts', icon: Percent },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const sidebarContent = (
    <div className={`flex flex-col h-full transition-colors duration-300 ${
      isDark ? 'bg-kartel-black-950 border-white/[0.05]' : 'bg-white border-black/[0.06]'
    }`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b transition-colors duration-300 ${
        isDark ? 'border-white/[0.05]' : 'border-black/[0.06]'
      }`}>
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kartel-gold to-kartel-gold-dark flex items-center justify-center flex-shrink-0">
            <span className="text-kartel-black text-xs font-bold">CJ</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`font-serif font-bold tracking-[0.15em] text-sm transition-colors ${
                isDark ? 'text-white' : 'text-kartel-black-900'
              }`}
            >
              CARL JONES
            </motion.span>
          )}
        </Link>
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className={`lg:hidden ml-auto p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-white/40 hover:text-white hover:bg-white/[0.05]' : 'text-kartel-black-400 hover:text-kartel-black-900 hover:bg-black/[0.05]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-kartel-gold/10 text-kartel-gold'
                  : isDark
                    ? 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    : 'text-kartel-black-500 hover:text-kartel-black-900 hover:bg-black/[0.04]'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                isActive ? 'text-kartel-gold' : ''
              }`} strokeWidth={1.5} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-kartel-gold"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle (desktop) + Sign Out */}
      <div className={`border-t p-3 space-y-1 transition-colors duration-300 ${
        isDark ? 'border-white/[0.05]' : 'border-black/[0.06]'
      }`}>
        <button
          onClick={onToggleCollapse}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDark
              ? 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              : 'text-kartel-black-500 hover:text-kartel-black-900 hover:bg-black/[0.04]'
          }`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDark
              ? 'text-white/50 hover:text-red-400 hover:bg-red-500/[0.06]'
              : 'text-kartel-black-500 hover:text-red-600 hover:bg-red-500/[0.06]'
          }`}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed top-[4.5rem] lg:top-24 left-0 h-[calc(100%-4.5rem)] lg:h-[calc(100%-6rem)] z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute top-[4.5rem] left-0 h-[calc(100%-4.5rem)] w-72 max-w-[80vw] shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
