'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight, Sparkles, Star } from 'lucide-react'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 25])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 8])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-[100dvh] sm:min-h-[90dvh] lg:min-h-[90dvh] flex items-center overflow-hidden hero-gradient"
    >
      {/* Mobile Background Image - full bleed with cinematic treatment */}
      <div className="absolute inset-0 lg:hidden">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=800&auto=format&fit=crop&q=80"
            alt="CARL JONES Signature Perfume"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-kartel-gold/5 mix-blend-overlay" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Ambient glow - enhanced on mobile */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-kartel-gold/10 via-kartel-gold/3 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-20%] w-[500px] h-[500px] bg-gradient-to-tr from-kartel-gold/6 via-kartel-gold/2 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative gold line - top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] lg:w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/30 to-transparent z-10" />

      {/* Main container */}
      <div className="container-luxury w-full relative z-10 pt-24 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 w-full">

          {/* LEFT: Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="flex flex-col justify-center space-y-6 lg:space-y-6 flex-1 lg:flex-none lg:w-[52%] order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-kartel-gold/12 border border-kartel-gold/25 backdrop-blur-md w-fit shadow-lg shadow-kartel-gold/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-kartel-gold" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-kartel-gold">
                Haute Parfumerie
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-bold text-white lg:text-heading leading-[1.05] tracking-[-0.02em] text-balance">
                Define Your{' '}
                <span className="italic font-light bg-gradient-to-r from-kartel-gold via-kartel-gold-light to-kartel-gold-dark bg-clip-text text-transparent">
                  Invisible
                </span>
              </h1>
              <h1 className="font-serif text-[clamp(1.75rem,5vw,3rem)] font-bold text-white/95 lg:text-heading/85 leading-[1.1] tracking-[-0.02em]">
                Signature
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(0.9375rem,2.5vw,1.125rem)] text-white/70 lg:text-muted max-w-xl leading-[1.8]"
            >
              CARL JONES blends rare botanicals with avant-garde chemistry. Each scent
              transcends time—a symphony of luxury for the discerning few.
            </motion.p>

            {/* CTAs - full width buttons on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2.5 text-sm px-8 py-4 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-full shadow-lg shadow-kartel-gold/20 hover:shadow-xl hover:shadow-kartel-gold/30 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center text-sm px-8 py-4 border border-white/20 lg:border-black/[0.12] text-white/90 lg:text-black/70 rounded-full backdrop-blur-sm hover:bg-white/10 lg:hover:bg-black/[0.05] hover:border-white/40 lg:hover:border-black/20 transition-all duration-300"
              >
                Our Heritage
              </Link>
            </motion.div>

            {/* Stats - always visible on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 lg:via-black/[0.08] to-transparent" />
              <div className="flex gap-6 lg:gap-12">
                {[
                  { value: '200+', label: 'Scents' },
                  { value: '50K+', label: 'Clients' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg lg:text-xl font-serif font-bold text-white lg:text-heading">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 lg:text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 lg:from-black/[0.08] to-transparent" />
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero Image - hidden on mobile, shown on lg+ */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center lg:justify-end items-center order-2 mt-8 lg:mt-0"
          >
            <div className="absolute inset-0 -m-32 bg-gradient-to-br from-kartel-gold/10 via-kartel-gold/6 to-kartel-gold/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <div className="relative w-[360px] h-[450px]">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=600&auto=format&fit=crop&q=60"
                    alt="CARL JONES Signature Perfume"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-kartel-gold/20">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-kartel-gold font-semibold">Signature</p>
                    <p className="font-serif text-white text-xs mt-0.5">Collection</p>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-kartel-gold/30">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" strokeWidth={0} />
                    <span className="text-sm font-bold text-white">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient - more prominent on mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-32 lg:h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent pointer-events-none" />

      {/* Decorative corner dots */}
      <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-kartel-gold/20 hidden sm:block" />
      <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-kartel-gold/20 hidden sm:block" />

      {/* Scroll indicator - more visible on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 lg:text-muted/60">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-kartel-gold/50 to-transparent"
        />
      </motion.div>

      {/* Gold shine accent */}
      <div className="absolute top-1/4 right-[15%] w-[2px] h-16 bg-gradient-to-b from-transparent via-kartel-gold/30 to-transparent hidden sm:block" />
    </motion.section>
  )
}
