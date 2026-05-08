'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Leaf, Users, Sparkles } from 'lucide-react'

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'Uncompromising quality in every bottle. We source only the finest ingredients from around the world.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Eco-conscious practices from sourcing to packaging. Luxury that respects our planet.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building lasting relationships with our clients through exceptional service and products.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Pushing boundaries in fragrance creation with cutting-edge techniques and creativity.',
  },
]

const timeline = [
  {
    year: '2009',
    title: 'The Beginning',
    description: 'KARTEL was founded with a vision to create extraordinary fragrances.',
  },
  {
    year: '2014',
    title: 'Global Expansion',
    description: 'Expanded to 40+ countries, bringing luxury scents worldwide.',
  },
  {
    year: '2019',
    title: 'Sustainability Pledge',
    description: 'Launched eco-friendly packaging and sustainable sourcing initiatives.',
  },
  {
    year: '2024',
    title: '50K+ Clients',
    description: 'Reached milestone of 50,000 satisfied customers globally.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-kartel-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-kartel-black-950">
          <Image
            src="https://images.unsplash.com/photo-1626090710609-b68733cc8564?q=80&w=1974&auto=format&fit=crop"
            alt="KARTEL About"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kartel-black via-kartel-black/50 to-transparent" />
        </div>
        
        <div className="container-luxury relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
              Our Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-[-0.02em]">
              The <span className="text-gradient">Story</span> of KARTEL
            </h1>
            <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              Crafting extraordinary fragrances since 2009, blending artistry with science to create scents that define you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-kartel-black-900">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/[0.04]">
                <Image
                  src="https://images.unsplash.com/photo-1595436065982-9502799b6e58?q=80&w=1974&auto=format&fit=crop"
                  alt="KARTEL Craftsmanship"
                  fill
                  className="object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kartel-black/60 via-transparent to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1]">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-base sm:text-lg text-white/40 leading-[1.8]">
                At KARTEL, we believe that fragrance is more than a scent&mdash;it&apos;s an expression of identity, a memory in a bottle, an invisible accessory that leaves a lasting impression.
              </p>
              <p className="text-base sm:text-lg text-white/40 leading-[1.8]">
                Our mission is to create fragrances that transcend time, blending rare botanicals with avant-garde chemistry to produce scents that are both timeless and innovative.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { value: '200+', label: 'Scents' },
                  { value: '50K+', label: 'Clients' },
                  { value: '40+', label: 'Countries' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl lg:text-3xl font-serif font-bold text-kartel-gold">{stat.value}</p>
                    <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-kartel-black">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
              What Drives Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Our <span className="text-gradient">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.04] hover:border-kartel-gold/[0.15] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full bg-kartel-gold/[0.1] flex items-center justify-center mb-5">
                  <value.icon className="w-5 h-5 text-kartel-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-kartel-black-900">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
              Our Legacy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Milestones
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-kartel-gold/[0.1] border border-kartel-gold/[0.2] flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-kartel-gold">{item.year}</span>
                  </div>
                </div>
                <div className="pb-8 border-b border-white/[0.06] last:border-0">
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}