'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
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

  const imageY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 30]), { stiffness: 50, damping: 20 })
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 10]), { stiffness: 50, damping: 20 })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] lg:h-[100dvh] flex items-center overflow-hidden bg-kartel-black-950"
    >
      {/* Dramatic ambient lighting */}
      <div className="absolute -top-[10%] right-[5%] w-[60%] h-[60%] bg-kartel-gold/[0.04] blur-[300px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-kartel-gold/[0.025] blur-[250px] rounded-full pointer-events-none" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.1) 0%, transparent 50%)'
        }} />
      </div>

      {/* Subtle premium texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Main grid layout */}
      <div className="container-luxury w-full relative z-10 pt-16 lg:pt-24 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center w-full">
      
          {/* LEFT: Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="flex flex-col justify-center space-y-4 lg:space-y-5 order-1 lg:order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-kartel-gold/[0.1] via-kartel-gold/[0.04] to-transparent border border-kartel-gold/[0.15] backdrop-blur-sm w-fit"
            >
              <Sparkles className="w-3 h-3 text-kartel-gold" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-kartel-gold">
                Haute Parfumerie
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-0"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-white leading-[1.05] tracking-[-0.03em]">
                Define Your{' '}
                <span className="italic font-light bg-gradient-to-r from-kartel-gold via-kartel-gold-light to-kartel-champagne bg-clip-text text-transparent">
                  Invisible
                </span>
              </h1>
              <h1 className="font-serif text-2.5xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-bold text-white/90 leading-[1.1] tracking-[-0.02em]">
                Signature
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-white/50 max-w-sm sm:max-w-md leading-[1.7]"
            >
              KARTEL blends rare botanicals with avant-garde chemistry. Each scent
              transcends time—a symphony of luxury for the discerning few.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2.5 text-sm px-6 py-3 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold rounded-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10"
                  strokeWidth={2}
                />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center text-sm px-6 py-3 border border-kartel-gold/20 text-kartel-gold/80 rounded-full hover:bg-kartel-gold/[0.06] hover:border-kartel-gold/35 transition-all duration-300"
              >
                Our Heritage
              </Link>
            </motion.div>

            {/* Elegant stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:flex items-center gap-6 pt-2"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
              <div className="flex gap-8 sm:gap-10">
                {[
                  { value: '200+', label: 'Scents' },
                  { value: '50K+', label: 'Clients' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-serif font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero Image */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end items-center order-2 lg:order-2"
          >
            {/* Atmospheric glow */}
            <div className="absolute inset-0 -m-16 bg-kartel-gold/[0.035] blur-[120px] rounded-full" />

            {/* Image container */}
            <div className="relative z-10 w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] mt-8 lg:mt-0">
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-kartel-gold/[0.04] rounded-full pointer-events-none animate-spin-slow" />

              {/* Main image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-luxury-xl border border-white/[0.06] bg-gradient-to-b from-kartel-black-900/20 to-transparent"
              >
                 <Image
                   src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0"
                   alt="KARTEL Signature Perfume"
                   fill
                   sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 380px"
                   className="object-cover brightness-[0.92] contrast-105 saturate-110"
                   priority
                 />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-kartel-black-950/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-kartel-black-950/15 via-transparent to-transparent" />

                {/* Floating labels */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-4 bg-kartel-black/50 backdrop-blur-2xl px-3.5 py-2 rounded-xl border border-kartel-gold/[0.12] shadow-luxury"
                >
                  <p className="text-[9px] uppercase tracking-[0.15em] text-kartel-gold font-semibold">Pure Essence</p>
                  <p className="font-serif text-white text-xs mt-0.5">Oud & Amber</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-20 left-4 bg-kartel-black/50 backdrop-blur-2xl px-3.5 py-2 rounded-xl border border-kartel-gold/[0.12] shadow-luxury"
                >
                  <p className="text-[9px] uppercase tracking-[0.15em] text-kartel-gold font-semibold">Concentration</p>
                  <p className="font-serif text-white text-xs mt-0.5">Extrait de Parfum</p>
                </motion.div>

                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kartel-black/60 backdrop-blur-md border border-kartel-gold/[0.15]">
                  <Star className="w-3 h-3 text-kartel-gold fill-kartel-gold" strokeWidth={0} />
                  <span className="text-xs font-bold text-kartel-gold">4.9</span>
                  <span className="text-[10px] text-white/35">(250+)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-kartel-black via-kartel-black/50 to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/15">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-kartel-gold/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
