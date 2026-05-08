'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-kartel-black">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kartel-gold/10 mb-6">
                <Lock className="w-8 h-8 text-kartel-gold" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-white mb-3">
                Forgot Password
              </h1>
              <p className="text-white/50">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold hover:brightness-110 transition-all"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-2xl">✓</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Check your email</h3>
                  <p className="text-white/40 text-sm mb-6">
                    We&apos;ve sent a password reset link to {email}
                  </p>
                  <Link
                    href="/login"
                    className="text-kartel-gold hover:text-kartel-gold/80 text-sm"
                  >
                    Return to Sign In
                  </Link>
                </div>
              )}
            </div>

            <p className="text-center text-white/40 text-sm mt-6">
              Remember your password?{' '}
              <Link href="/login" className="text-kartel-gold hover:text-kartel-gold/80">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}