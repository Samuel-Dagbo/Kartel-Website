'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

const footerLinks = {
  explore: [
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Best Sellers', href: '/shop?sort=popular' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track-order' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
  ],
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

export function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer
      className={`relative border-t overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#161616] border-white/[0.03]'
          : 'bg-[#faf7f2] border-black/[0.06]'
      }`}
    >
      {/* Main glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-kartel-gold/30 to-transparent" />
      </div>

      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-kartel-gold/[0.01] blur-[180px] rounded-full pointer-events-none" />

      <div className="container-luxury pt-20 lg:pt-28 pb-10 relative">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 pb-16 border-b transition-colors duration-300"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
        >
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-7">
            <Link href="/" className="inline-block group relative">
              <span className="text-2xl font-serif font-bold tracking-[0.3em] text-gradient transition-all duration-300">
                KARTEL
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-kartel-gold to-transparent group-hover:w-full transition-all duration-500 ease-luxury" />
            </Link>
            <p className={`text-sm leading-[1.85] max-w-sm transition-colors duration-300 ${
              isDark ? 'text-white/70' : 'text-kartel-black-700'
            }`}>
              Curating the world&apos;s finest collection of luxury perfumes. Each
              fragrance tells a story of artistry, passion, and timeless elegance.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`group p-3 rounded-full border transition-all duration-300 ${
                    isDark
                      ? 'border-white/[0.05] text-white/50 hover:text-kartel-gold hover:border-kartel-gold/25'
                      : 'border-black/[0.06] text-kartel-black-500 hover:text-kartel-gold hover:border-kartel-gold/25'
                  }`}
                  aria-label={label}
                >
                  <Icon
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-14">
              {/* Explore */}
              <div>
                <h3 className={`text-overline font-semibold mb-6 tracking-[0.12em] transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-kartel-black-900'
                }`}>
                  EXPLORE
                </h3>
                <ul className="space-y-3.5">
                  {footerLinks.explore.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`group inline-flex items-center gap-1.5 text-sm transition-colors duration-300 ${
                          isDark
                            ? 'text-white/50 hover:text-kartel-gold'
                            : 'text-kartel-black-500 hover:text-kartel-gold'
                        }`}
                      >
                        {item.label}
                        <ArrowUpRight
                          className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className={`text-overline font-semibold mb-6 tracking-[0.12em] transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-kartel-black-900'
                }`}>
                  SUPPORT
                </h3>
                <ul className="space-y-3.5">
                  {footerLinks.support.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`group inline-flex items-center gap-1.5 text-sm transition-colors duration-300 ${
                          isDark
                            ? 'text-white/50 hover:text-kartel-gold'
                            : 'text-kartel-black-500 hover:text-kartel-gold'
                        }`}
                      >
                        {item.label}
                        <ArrowUpRight
                          className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className={`text-overline font-semibold mb-6 tracking-[0.12em] transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-kartel-black-900'
                }`}>
                  COMPANY
                </h3>
                <ul className="space-y-3.5">
                  {footerLinks.company.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`group inline-flex items-center gap-1.5 text-sm transition-colors duration-300 ${
                          isDark
                            ? 'text-white/50 hover:text-kartel-gold'
                            : 'text-kartel-black-500 hover:text-kartel-gold'
                        }`}
                      >
                        {item.label}
                        <ArrowUpRight
                          className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div
          className="py-12 border-b transition-colors duration-300"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <h3 className={`text-overline font-semibold tracking-[0.12em] transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-kartel-black-900'
              }`}>
                GET IN TOUCH
              </h3>
              <div className="flex flex-wrap gap-8">
                <a
                  href="mailto:contact@kartel.com"
                  className={`flex items-center gap-2.5 text-sm transition-colors ${
                    isDark
                      ? 'text-white/50 hover:text-kartel-gold'
                      : 'text-kartel-black-500 hover:text-kartel-gold'
                  }`}
                >
                  <Mail
                    className="w-4 h-4 text-kartel-gold/50"
                    strokeWidth={1.5}
                  />
                  contact@kartel.com
                </a>
                <a
                  href="tel:+15551234567"
                  className={`flex items-center gap-2.5 text-sm transition-colors ${
                    isDark
                      ? 'text-white/50 hover:text-kartel-gold'
                      : 'text-kartel-black-500 hover:text-kartel-gold'
                  }`}
                >
                  <Phone
                    className="w-4 h-4 text-kartel-gold/50"
                    strokeWidth={1.5}
                  />
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
            <div className="lg:text-right">
              <p className={`text-sm transition-colors ${
                isDark ? 'text-white/35' : 'text-kartel-black-400'
              }`}>
                <MapPin
                  className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-kartel-gold/40"
                  strokeWidth={1.5}
                />
                123 Luxury Lane, New York, NY 10001
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`text-xs tracking-wide transition-colors ${
            isDark ? 'text-white/20' : 'text-kartel-black-400'
          }`}>
            &copy; {new Date().getFullYear()} KARTEL. All rights reserved.
          </p>
          <p className={`text-xs tracking-wide transition-colors ${
            isDark ? 'text-white/20' : 'text-kartel-black-400'
          }`}>
            Built by{' '}
            <a
              href="https://samtechlabs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                isDark
                  ? 'text-white/40 hover:text-kartel-gold'
                  : 'text-kartel-black-500 hover:text-kartel-gold'
              }`}
            >
              Samtech Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
