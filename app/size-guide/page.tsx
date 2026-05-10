'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'

export default function SizeGuidePage() {
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
              <Ruler className="w-8 h-8 text-kartel-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mb-4">
              Fragrance Size Guide
            </h1>
            <p className="text-muted">
              Find the perfect size for your lifestyle and fragrance needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { size: '30ml', label: 'Travel Spray', desc: 'Perfect for on-the-go', ideal: 'Travel & Touch-ups' },
                { size: '50ml', label: 'Classic', desc: 'Our most popular size', ideal: 'Personal Use' },
                { size: '100ml', label: 'Signature', desc: 'Best value for regular use', ideal: 'Daily Wear' },
                { size: '200ml', label: 'Collection', desc: 'For the true enthusiast', ideal: 'Gift & Collection' },
              ].map((item, i) => (
                <motion.div
                  key={item.size}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="p-6 glass-card rounded-2xl text-center"
                >
                  <span className="text-4xl font-serif font-bold text-kartel-gold">{item.size}</span>
                  <h3 className="text-heading font-medium mt-3">{item.label}</h3>
                  <p className="text-muted text-sm mt-1">{item.desc}</p>
                  <p className="text-muted/70 text-xs mt-3 uppercase tracking-wider">{item.ideal}</p>
                </motion.div>
              ))}
            </div>

            <div className="p-8 glass-card">
              <h2 className="font-serif text-xl font-semibold text-heading mb-6">How Long Does Each Size Last?</h2>
              <div className="space-y-4">
                {[
                  { size: '30ml', sprays: '~300', days: '30-45 days', usage: 'Light user / Travel' },
                  { size: '50ml', sprays: '~500', days: '2-3 months', usage: 'Regular user' },
                  { size: '100ml', sprays: '~1000', days: '4-6 months', usage: 'Daily wear' },
                  { size: '200ml', sprays: '~2000', days: '8-12 months', usage: 'Heavy use / Sharing' },
                ].map((item) => (
                  <div key={item.size} className="flex items-center justify-between p-4 rounded-xl glass">
                    <div className="flex items-center gap-4">
                      <span className="text-kartel-gold font-semibold w-16">{item.size}</span>
                      <span className="text-muted text-sm">{item.sprays} sprays</span>
                    </div>
                    <span className="text-body">{item.days}</span>
                    <span className="text-muted text-sm">{item.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 glass-card">
              <h3 className="text-heading font-medium mb-3">Pro Tip</h3>
              <p className="text-body text-sm">
                If you&apos;re new to a fragrance, we recommend starting with a smaller size (30-50ml) to make sure it suits you before investing in a larger bottle. Each fragrance evolves differently on your skin over time.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}