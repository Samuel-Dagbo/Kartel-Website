'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Clock, Package, RefreshCw, MapPin, Phone, Mail } from 'lucide-react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kartel-gold/10 mb-6">
              <Truck className="w-8 h-8 text-kartel-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Shipping & Returns
            </h1>
            <p className="text-white/50">
              Everything you need to know about delivering your favorite fragrances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <h2 className="font-serif text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-kartel-gold" />
                Shipping Options
              </h2>
              <div className="space-y-6">
                {[
                  { name: 'Standard Shipping', time: '3-5 Business Days', price: 'Free on orders over GHS 600' },
                  { name: 'Express Shipping', time: '1-2 Business Days', price: 'GHS 120' },
                  { name: 'Next Day Delivery', time: 'Next Business Day', price: 'GHS 250' },
                ].map((option, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-kartel-gold/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-kartel-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{option.name}</h3>
                      <p className="text-white/40 text-sm mt-1">{option.time}</p>
                      <p className="text-kartel-gold text-sm mt-1">{option.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <h2 className="font-serif text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-kartel-gold" />
                Return Policy
              </h2>
              <div className="space-y-4 text-white/50">
                <p>We want you to be completely satisfied with your purchase. If for any reason you are not, we offer:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-kartel-gold mt-2 shrink-0" />
                    <span><strong className="text-white">30-day returns</strong> for unopened items in original condition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-kartel-gold mt-2 shrink-0" />
                    <span><strong className="text-white">Free return shipping</strong> on all continental US orders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-kartel-gold mt-2 shrink-0" />
                    <span><strong className="text-white">Instant refunds</strong> processed upon receipt of returned items</span>
                  </li>
                </ul>
                <p className="text-sm text-white/30 mt-4">Sale items are final sale and cannot be returned.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] max-w-5xl mx-auto"
          >
            <h2 className="font-serif text-xl font-semibold text-white mb-6">International Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/50 mb-4">We ship to over 50 countries worldwide. International orders typically arrive within 7-14 business days.</p>
                <div className="space-y-2 text-sm text-white/40">
                  <p>Europe: from GHS 180</p>
                  <p>Asia Pacific: from GHS 220</p>
                  <p>Middle East: from GHS 280</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-kartel-gold/5 border border-kartel-gold/10">
                <p className="text-white/70 text-sm">
                  <strong className="text-kartel-gold">Customs Note:</strong> International orders may be subject to import duties and taxes. These fees are the responsibility of the recipient and are not included in shipping costs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}