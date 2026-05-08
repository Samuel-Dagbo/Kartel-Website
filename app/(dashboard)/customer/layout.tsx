'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, Heart, LogOut, Settings, Zap } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/customer', label: 'Overview', icon: User },
    { href: '/customer/orders', label: 'My Orders', icon: Package },
    { href: '/customer/wishlist', label: 'Wishlist', icon: Heart },
  ]

  return (
    <div className="min-h-screen flex bg-kartel-black-950">
      {/* Premium Customer Sidebar */}
      <aside className="w-72 border-r border-white/[0.06] bg-gradient-to-b from-kartel-black-900 to-kartel-black-950 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="block">
            <span className="text-2xl font-serif font-bold tracking-[0.25em] bg-gradient-to-r from-kartel-gold via-kartel-gold-light to-kartel-champagne bg-clip-text text-transparent">
              KARTEL
            </span>
            <span className="text-[10px] text-white/40 block tracking-[0.3em] mt-1 font-medium">MY ACCOUNT</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kartel-gold/20 to-kartel-gold/5 border border-kartel-gold/20 flex items-center justify-center">
              <User className="w-5 h-5 text-kartel-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Welcome Back</p>
              <p className="text-xs text-white/40">VIP Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="text-[9px] font-bold text-white/25 uppercase tracking-[0.2em] px-4 mb-3">Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-kartel-gold/15 to-kartel-gold/5 border border-kartel-gold/20 text-kartel-gold' 
                    : 'text-white/50 hover:bg-white/[0.03] hover:text-white/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-kartel-gold/20' : 'bg-white/[0.03]'}`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-kartel-gold' : 'text-white/40 group-hover:text-kartel-gold/80'}`} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="w-1.5 h-1.5 rounded-full bg-kartel-gold" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/[0.03] hover:text-white/80 transition-all"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm">Continue Shopping</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-kartel-black-950">
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}