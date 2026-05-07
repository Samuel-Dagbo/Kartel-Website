'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  User,
  Search,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export function Navbar() {
  const { data: session } = useSession()
  const { totalItems, toggleCart } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isAdmin = session?.user?.role === 'admin'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-b ${
          isScrolled
            ? 'bg-kartel-black/95 backdrop-blur-2xl border-white/[0.06] shadow-2xl shadow-black/40'
            : 'bg-kartel-black/60 backdrop-blur-xl border-transparent'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-[4.5rem] lg:h-24">
            {/* Logo */}
            <Link href="/" className="shrink-0 group relative">
              <motion.span
                className="text-xl md:text-2xl lg:text-[1.85rem] font-serif font-bold tracking-[0.3em] text-gradient-shine animate-gradient-shift inline-block"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                KARTEL
              </motion.span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-kartel-gold to-transparent group-hover:w-full transition-all duration-500 ease-luxury" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-full px-1.5 py-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-5 py-2.5 text-[13px] font-medium tracking-wide text-white/50 hover:text-white transition-colors duration-300 group"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-kartel-gold rounded-full transition-all duration-500 ease-luxury group-hover:w-1/2" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full text-white/50 hover:text-kartel-gold hover:bg-white/[0.05] transition-all duration-300"
                aria-label="Search"
              >
                <Search
                  className="w-[18px] h-[18px]"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2.5 rounded-full text-white/50 hover:text-kartel-gold hover:bg-white/[0.05] transition-all duration-300"
                aria-label="Wishlist"
              >
                <Heart
                  className="w-[18px] h-[18px]"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-full text-white/50 hover:text-kartel-gold hover:bg-white/[0.05] transition-all duration-300"
                aria-label="Cart"
              >
                <ShoppingBag
                  className="w-[18px] h-[18px]"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-kartel-gold text-kartel-black rounded-full px-1 shadow-gold-glow"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="hidden sm:flex items-center gap-1 ml-1">
                  <Link
                    href={isAdmin ? '/admin' : '/customer'}
                    className="p-2.5 rounded-full text-white/50 hover:text-kartel-gold hover:bg-white/[0.05] transition-all duration-300"
                    aria-label="Account"
                  >
                    <User
                      className="w-[18px] h-[18px]"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex ml-2 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] border border-kartel-gold/30 text-kartel-gold hover:bg-kartel-gold/10 hover:border-kartel-gold/50 transition-all duration-300 rounded-full"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300 ml-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-white/[0.03] overflow-hidden bg-kartel-black/98 backdrop-blur-2xl"
            >
              <div className="container-luxury py-6">
                <div className="max-w-2xl mx-auto relative">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    placeholder="Search for perfumes, brands, notes..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-full pl-12 pr-6 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 transition-all duration-300"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t border-white/[0.03] overflow-hidden bg-kartel-black/98 backdrop-blur-2xl"
            >
              <div className="container-luxury py-8 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 text-lg text-white/70 hover:text-kartel-gold transition-colors group"
                    >
                      {link.label}
                      <ChevronRight
                        className="w-4 h-4 text-white/20 group-hover:text-kartel-gold/60 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-6 mt-4 border-t border-white/[0.04]">
                  {session ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        signOut()
                      }}
                      className="w-full py-3 text-left text-white/50 hover:text-kartel-gold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex px-6 py-3 text-sm font-semibold tracking-wider border border-kartel-gold/40 text-kartel-gold hover:bg-kartel-gold/10 transition-all rounded-full"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
