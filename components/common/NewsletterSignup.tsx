'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email.includes('@') && email.includes('.')) {
      setMessage({
        type: 'success',
        text: 'Welcome to KARTEL. Expect extraordinary.',
      })
      setEmail('')
    } else {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address.',
      })
    }
    setIsSubmitting(false)
  }

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Dramatic ambient glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-kartel-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[300px] bg-kartel-gold/[0.01] blur-[180px] rounded-full pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-kartel-gold/15 to-transparent" />

      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative glass-card rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 lg:p-16 border overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-14 h-14 rounded-full border border-kartel-gold/[0.06] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-kartel-gold/15" />
            </div>
            <div className="absolute top-10 right-10 w-14 h-14 rounded-full border border-kartel-gold/[0.06] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-kartel-gold/15" />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-kartel-gold/[0.1] to-transparent" />

            {/* Content */}
            <div className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-kartel-gold/12 to-kartel-gold/4 mb-10 border border-kartel-gold/[0.1]"
              >
                <Mail
                  className="w-7 h-7 text-kartel-gold"
                  strokeWidth={1.5}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/70 mb-6 px-5 py-2 border border-kartel-gold/[0.12] rounded-full backdrop-blur-sm">
                  Stay Connected
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-display-sm font-bold text-white leading-[1.1] tracking-[-0.02em] mt-4"
              >
                Stay Connected with <br /><span className="text-gradient">KARTEL</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-6 text-base sm:text-lg text-white/35 leading-relaxed max-w-lg mx-auto"
              >
                Be the first to discover new arrivals, exclusive offers, and the
                latest from the world of luxury fragrances.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mt-12"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-7 py-4 bg-white/[0.025] border border-white/[0.05] rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 transition-all duration-300 text-sm"
                    required
                    aria-label="Email for newsletter signup"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black text-sm font-semibold px-8 py-4 rounded-full overflow-hidden whitespace-nowrap shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-kartel-black/30 border-t-kartel-black rounded-full animate-spin" />
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Subscribe
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={2}
                        />
                      </span>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                </motion.button>
              </motion.form>

              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    key={message.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className={`mt-6 inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full ${
                      message.type === 'success'
                        ? 'bg-green-500/8 text-green-400 border border-green-500/15'
                        : 'bg-red-500/8 text-red-400 border border-red-500/15'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <Check className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <AlertCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 text-[11px] text-white/20 tracking-wide"
              >
                No spam, ever. Unsubscribe at any time.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
