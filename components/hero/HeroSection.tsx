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
    <section
      ref={sectionRef}
      className="relative min-h-[85dvh] lg:min-h-[90dvh] flex items-center overflow-hidden hero-gradient"
    >
      {/* Ambient glow - reduced to one instead of three */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/8 via-yellow-500/3 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-600/5 via-amber-500/2 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Main container */}
      <div className="container-luxury w-full relative z-10 pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16 w-full">

          {/* LEFT: Content */}
          <motion.div
            style={{ y: textY, opacity }}
            className="flex flex-col justify-center space-y-5 lg:space-y-6 flex-1 lg:flex-none lg:w-[52%] order-1"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-600/5 border border-amber-500/20 backdrop-blur-sm w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400">
                Haute Parfumerie
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h1 className="font-serif text-[clamp(1.75rem,5vw,3.5rem)] font-bold text-heading leading-[1.1] tracking-[-0.02em]">
                Define Your{' '}
                <span className="italic font-light bg-gradient-to-r from-kartel-gold via-kartel-gold-light to-kartel-champagne bg-clip-text text-transparent">
                  Invisible
                </span>
              </h1>
              <h1 className="font-serif text-[clamp(1.5rem,4vw,3rem)] font-bold text-heading/85 leading-[1.15] tracking-[-0.02em]">
                Signature
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(0.875rem,2vw,1.125rem)] text-muted max-w-xl leading-[1.75]"
            >
              KARTEL blends rare botanicals with avant-garde chemistry. Each scent
              transcends time—a symphony of luxury for the discerning few.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-center gap-6 pt-3"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="flex gap-10 lg:gap-12">
                {[
                  { value: '200+', label: 'Scents' },
                  { value: '50K+', label: 'Clients' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-serif font-bold text-heading">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted mt-1">{stat.label}</p>
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
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end items-center order-2 mt-8 lg:mt-0"
          >
            {/* Ambient glow behind image */}
            <div className="absolute inset-0 -m-20 lg:-m-32 bg-gradient-to-br from-amber-500/15 via-yellow-400/10 to-amber-600/15 blur-[100px] rounded-full" />

            {/* Main perfume bottle container */}
            <div className="relative z-10">
              {/* Image wrapper with responsive sizing */}
              <div className="relative w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=600&auto=format&fit=crop&q=60"
                    alt="KARTEL Signature Perfume"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-5 left-5 px-3.5 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/[0.15]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-amber-300 font-semibold">Signature</p>
                    <p className="font-serif text-white text-xs mt-0.5">Collection</p>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" strokeWidth={0} />
                    <span className="text-sm font-bold text-white">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 hero-bottom-gradient pointer-events-none" />

      {/* Scroll indicator - simplified */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-muted">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-kartel-gold/40 to-transparent" />
      </motion.div>
    </section>
  )
}
