'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const highlights = [
  {
    icon: '01',
    title: 'Rare & Exotic Ingredients',
    description:
      'We source the finest raw materials from across the globe, ensuring each fragrance is a masterpiece of olfactory art.',
  },
  {
    icon: '02',
    title: 'Master Perfumers',
    description:
      'Each CARL JONES scent is crafted by world-renowned perfumers with decades of experience in haute parfumerie.',
  },
  {
    icon: '03',
    title: 'Sustainable Luxury',
    description:
      'Our commitment to the environment means sustainable sourcing, eco-friendly packaging, and ethical practices.',
  },
]

export function BrandStory() {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none dark:opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Ambient glow */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-kartel-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/15 to-transparent" />

      <div className="container-luxury relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-black/[0.04] dark:border-white/[0.04] shadow-luxury-xl">
              <Image
                src="https://images.unsplash.com/photo-1705338670422-01133208eab9?w=600&auto=format&fit=crop&q=60"
                alt="CARL JONES Brand Story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-kartel-black via-kartel-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-kartel-black/30 via-transparent to-transparent" />

              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute bottom-8 left-8 glass-dark p-6 rounded-2xl border border-kartel-gold/[0.1] shadow-luxury"
              >
                <p className="text-3xl font-serif font-bold text-kartel-gold">15+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-1.5">Years of Craft</p>
              </motion.div>

              {/* Decorative element */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-kartel-gold/[0.1] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-kartel-gold/25" />
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -top-8 -left-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] border border-kartel-gold/[0.025] rounded-[2.5rem] pointer-events-none" />
          </motion.div>

          {/* Content Section */}
          <div className="space-y-6 lg:space-y-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
                Our Story
              </span>
              <h2 className="font-serif text-display-md font-bold text-heading leading-[1.05] tracking-[-0.02em]">
                The <span className="text-gradient">Essence</span> of CARL JONES
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-body leading-[1.8]"
            >
              At CARL JONES, we believe that fragrance is an art form—an invisible
              accessory that speaks volumes before you utter a word. Born from a
              passion for exquisite scents and meticulous craftsmanship, our
              journey began with a singular vision.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-body leading-[1.8]"
            >
              Each CARL JONES perfume is a symphony of rare ingredients, carefully
              sourced from the far corners of the world and blended by master
              perfumers with decades of experience.
            </motion.p>

            {/* Highlight features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pt-2"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="flex gap-5"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-kartel-gold/12 to-kartel-gold/4 flex items-center justify-center mt-0.5 border border-kartel-gold/[0.08]">
                    <span className="text-kartel-gold text-sm font-bold">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-heading mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-10 sm:gap-14 pt-4"
            >
              {[
                { value: '200+', label: 'Unique Scents' },
                { value: '40+', label: 'Countries' },
                { value: '50K+', label: 'Happy Clients' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-heading">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted uppercase tracking-[0.15em]">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-2.5 glass-card hover:border-kartel-gold/25 text-heading hover:text-kartel-gold text-sm font-medium px-7 py-3.5 rounded-full transition-all duration-500"
              >
                Learn More
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowUpRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}