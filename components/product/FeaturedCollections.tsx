'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const featuredCollections = [
  {
    id: '1',
    name: 'Signature Collection',
    description: 'Timeless elegance, redefined for the modern connoisseur. Each fragrance in this collection represents the pinnacle of olfactory artistry.',
    image: 'https://images.unsplash.com/photo-1541108253-1f8d38466b04?q=80&w=1974&auto=format&fit=crop',
    link: '/shop?collection=signature',
    productCount: 42,
  },
  {
    id: '2',
    name: 'Seasonal Allure',
    description: 'Embrace the spirit of the season with curated fragrances that capture the essence of every moment.',
    image: 'https://images.unsplash.com/photo-1550927958-857e101f375f?q=80&w=1974&auto=format&fit=crop',
    link: '/shop?collection=seasonal',
    productCount: 28,
  },
  {
    id: '3',
    name: 'Niche & Exclusive',
    description: 'Rare finds and limited editions for the true perfume connoisseur who seeks the extraordinary.',
    image: 'https://images.unsplash.com/photo-1621217032731-137a28e99e90?q=80&w=1974&auto=format&fit=crop',
    link: '/shop?collection=niche',
    productCount: 16,
  },
]

export function FeaturedCollections() {
  return (
    <section className="section-padding bg-kartel-black relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[60%] bg-kartel-gold/[0.025] blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[50%] bg-kartel-gold/[0.015] blur-[180px] rounded-full pointer-events-none" />

      {/* Subtle top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/15 to-transparent" />

      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
            Curated For You
          </span>
          <h2 className="font-serif text-display-md font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Our <span className="text-gradient">Collections</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/35 max-w-lg mx-auto leading-relaxed">
            Handpicked selections to guide your olfactory journey through luxury.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {featuredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={collection.link} className="group block h-full">
                <div className="relative h-full bg-gradient-to-b from-kartel-black-900/40 to-transparent rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/[0.04] hover:border-kartel-gold/[0.12] transition-all duration-700">
                  {/* Image container */}
                  <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[1.2s] ease-out brightness-90 group-hover:brightness-100"
                    />
                    {/* Multi-layer gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-kartel-black via-kartel-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kartel-black/70" />

                    {/* Product count badge */}
                    <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-kartel-black/50 backdrop-blur-xl border border-white/[0.06]">
                      <span className="text-xs font-medium text-white/80">
                        {collection.productCount} scents
                      </span>
                    </div>

                    {/* Hover arrow */}
                    <div className="absolute top-6 right-6 p-3 rounded-full bg-kartel-gold/15 backdrop-blur-xl opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 border border-kartel-gold/[0.15]">
                      <ArrowUpRight className="w-4 h-4 text-kartel-gold" strokeWidth={1.5} />
                    </div>

                    {/* Decorative element */}
                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-kartel-gold/[0.1] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-kartel-gold/30" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7 sm:p-8 space-y-3">
                    <h3 className="font-serif text-xl lg:text-[1.4rem] font-semibold text-white/90 group-hover:text-kartel-gold transition-colors duration-500">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-white/35 leading-relaxed line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="pt-3 flex items-center gap-2 text-kartel-gold/70 text-sm font-medium tracking-wide group-hover:text-kartel-gold transition-colors duration-300">
                      <span>Explore Collection</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowUpRight
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
