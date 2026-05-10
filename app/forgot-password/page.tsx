'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-primary">
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
              <h1 className="font-serif text-3xl font-bold text-heading mb-3">
                Forgot Password
              </h1>
              <p className="text-muted">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <div className="glass-card p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-muted mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="input-luxury w-full px-4 py-3 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full px-6 py-3.5"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-500 text-2xl">✓</span>
                  </div>
                  <h3 className="text-heading font-semibold mb-2">Check your email</h3>
                  <p className="text-muted text-sm mb-6">
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

            <p className="text-center text-muted text-sm mt-6">
              Remember your password?{' '}
              <Link href="/login" className="text-kartel-gold hover:text-kartel-gold/80">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}