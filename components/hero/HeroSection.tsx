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
      className="relative min-h-[100dvh] lg:min-h-[100dvh] flex items-center overflow-hidden bg-gradient-to-b from-[#0a0908] via-[#0d0b09] to-[#0a0908]"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/8 via-amber-500/3 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-500/[0.03] to-transparent rounded-full pointer-events-none" />

      {/* Main container */}
      <div className="container-luxury w-full relative z-10 py-16 lg:py-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16 w-full">
      
          {/* LEFT: Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="flex flex-col justify-center space-y-6 lg:space-y-7 flex-1 lg:flex-none lg:w-[52%] order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-600/5 border border-amber-500/20 backdrop-blur-sm w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400">
                Haute Parfumerie
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Define Your{' '}
                <span className="italic font-light bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                  Invisible
                </span>
              </h1>
              <h1 className="font-serif text-2.5xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-bold text-white/85 leading-[1.15] tracking-[-0.02em]">
                Signature
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-white/50 max-w-xl leading-[1.75]"
            >
              KARTEL blends rare botanicals with avant-garde chemistry. Each scent
              transcends time—a symphony of luxury for the discerning few.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2.5 text-sm px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-black font-semibold rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center text-sm px-6 py-3.5 border border-amber-500/20 text-amber-300/80 rounded-full hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300"
              >
                Our Heritage
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-center gap-6 pt-4"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.08]" />
              <div className="flex gap-10 lg:gap-12">
                {[
                  { value: '200+', label: 'Scents' },
                  { value: '50K+', label: 'Clients' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-serif font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/35 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
            </motion.div>
          </motion.div>

          {/* RIGHT: Hero Image */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end items-center order-2 mt-10 lg:mt-0"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-400/10 to-amber-600/20 blur-[80px] rounded-full" />

            {/* Main perfume bottle */}
            <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[340px]">
              {/* Bottle container with glow */}
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-amber-500/10 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170%] h-[170%] border border-amber-500/5 rounded-full pointer-events-none" />
                
                {/* Main image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/[0.1]"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&auto=format&fit=crop&q=80"
                    alt="KARTEL Signature Perfume"
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 340px"
                    className="object-cover"
                    priority
                  />

                  {/* Gradient overlays for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
                  
                  {/* Premium badge */}
                  <div className="absolute top-5 left-5 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/[0.1]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-amber-300 font-semibold">Signature</p>
                    <p className="font-serif text-white text-xs mt-0.5">Collection</p>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" strokeWidth={0} />
                    <span className="text-sm font-bold text-white">4.9</span>
                    <span className="text-[10px] text-white/50">(250+)</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/80 to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-amber-400/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}