'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-primary">
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kartel-gold/10 mb-6">
              <Heart className="w-8 h-8 text-kartel-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mb-4">
              My Wishlist
            </h1>
            <p className="text-muted">
              Save your favorite fragrances to easily find them later.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-12 glass-card text-center max-w-xl mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-kartel-gold/10 to-kartel-gold/5 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-kartel-gold/40" />
            </div>
            <h3 className="text-xl font-semibold text-heading mb-3">Your wishlist is empty</h3>
            <p className="text-muted mb-8 max-w-sm mx-auto">
              Save fragrances you love to easily find them later and keep track of your favorite scents.
            </p>
            <Link 
              href="/shop" 
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              Discover Fragrances
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}