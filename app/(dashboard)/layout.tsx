'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, Heart, LogOut, Settings, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/customer', label: 'Overview', icon: User },
    { href: '/customer/orders', label: 'My Orders', icon: Package },
    { href: '/customer/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/customer/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-kartel-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-kartel-black-900 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-serif font-bold tracking-[0.2em] bg-gradient-to-r from-kartel-gold via-kartel-gold-light to-kartel-champagne bg-clip-text text-transparent">
              KARTEL
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-kartel-gold text-kartel-black font-semibold' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-kartel-black' : 'text-white/40 group-hover:text-kartel-gold'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
