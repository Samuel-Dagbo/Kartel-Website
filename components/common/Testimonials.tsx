'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 't1',
    name: 'Elara Vance',
    title: 'Fragrance Enthusiast',
    quote:
      "Carl Jones perfumes are simply unparalleled. The depth and complexity of 'Midnight Bloom' captivate every time I wear it. It's truly a luxurious experience from the moment you open the exquisite packaging.",
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Julian Thorne',
    title: 'Creative Director',
    quote:
      "'Golden Oasis' is a masterpiece. Its unique blend of notes transports me to another world. Carl Jones doesn't just sell perfumes; they sell emotions and stories.",
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Seraphina Lee',
    title: 'Fashion Stylist',
    quote:
      "As a stylist, I appreciate attention to detail, and Carl Jones delivers. 'Celestial Mist' has become my signature scent—subtle yet powerful. The sleek design of the bottle itself is a work of art.",
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="section-padding bg-secondary relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-kartel-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-kartel-gold/[0.012] blur-[120px] rounded-full pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/15 to-transparent" />

      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
            Testimonials
          </span>
          <h2 className="font-serif text-display-md font-bold text-heading leading-[1.05] tracking-[-0.02em]">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-body max-w-lg mx-auto leading-relaxed">
            Real experiences from our valued customers around the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="relative glass-card rounded-[2rem] p-8 lg:p-10 h-full border hover:border-kartel-gold/[0.08] transition-all duration-700 group">
                {/* Quote icon with glow */}
                <div className="relative mb-8">
                  <div className="absolute -top-2 -left-2 w-14 h-14 bg-kartel-gold/[0.04] rounded-full blur-xl" />
                  <Quote className="w-9 h-9 text-kartel-gold/25 relative z-10" strokeWidth={1} />
                </div>

                {/* Stars */}
                <div className="flex gap-1.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < testimonial.rating
                          ? 'text-kartel-gold fill-kartel-gold'
                          : 'dark:text-white/8 text-black/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-base sm:text-lg text-body leading-[1.85] flex-1 mb-10 group-hover:text-body transition-colors duration-500">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-black/[0.03] dark:border-white/[0.03]">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-kartel-gold/[0.1] group-hover:ring-kartel-gold/[0.25] transition-all duration-500">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    {/* Avatar glow */}
                    <div className="absolute inset-0 bg-kartel-gold/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-heading group-hover:text-kartel-gold transition-colors duration-500">
                      {testimonial.name}
                    </h3>
                    <p className="text-[11px] text-muted mt-1 tracking-wide">
                      {testimonial.title}
                    </p>
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-kartel-gold/[0.06] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-kartel-gold/[0.15]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}