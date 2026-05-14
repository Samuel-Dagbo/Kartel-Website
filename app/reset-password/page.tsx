'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useSearchParams } from 'next/navigation'

function ResetPasswordContent() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new one.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`min-h-[100dvh] relative overflow-hidden flex ${
        isDark 
          ? 'bg-kartel-black' 
          : 'bg-gradient-to-br from-kartel-cream via-white to-kartel-cream'
      }`}>
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-kartel-gold/[0.03] blur-[250px] rounded-full pointer-events-none" />
        
        <div className="flex-1 flex items-start justify-center px-5 sm:px-8 pt-[5.5rem] lg:pt-[6.5rem] pb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            <div className={`relative rounded-2xl p-8 ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/[0.05] shadow-luxury'
                : 'bg-white/90 backdrop-blur-xl border border-black/[0.08] shadow-luxury-lg'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className={`font-serif text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>
                  Password Reset Complete
                </h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-white/50' : 'text-kartel-black-400'}`}>
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold text-sm rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-[100dvh] relative overflow-hidden flex ${
      isDark 
        ? 'bg-kartel-black' 
        : 'bg-gradient-to-br from-kartel-cream via-white to-kartel-cream'
    }`}>
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-kartel-gold/[0.03] blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-kartel-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />

      <div className="flex-1 flex items-start justify-center px-5 sm:px-8 pt-[5.5rem] lg:pt-[6.5rem] pb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <Link href="/" className={`inline-flex items-center gap-1.5 transition-colors text-xs mb-4 group ${
            isDark ? 'text-white/25 hover:text-kartel-gold' : 'text-kartel-black-500 hover:text-kartel-gold'
          }`}>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
            Back to home
          </Link>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <Link href="/" className="inline-block mb-3">
                <span className={`text-xl font-serif font-bold tracking-[0.3em] ${
                  isDark ? 'text-gradient-shine' : 'text-kartel-black'
                }`}>CARL JONES</span>
              </Link>
              <h1 className={`font-serif text-xl sm:text-2xl font-bold tracking-[-0.01em] ${
                isDark ? 'text-white' : 'text-kartel-black-900'
              }`}>Set New Password</h1>
              <p className={`mt-1 text-xs ${isDark ? 'text-white/35' : 'text-kartel-black-400'}`}>
                Create a new secure password for your account.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'text-white/25 hover:text-kartel-gold hover:bg-white/[0.05]' 
                  : 'text-kartel-black-400 hover:text-kartel-gold hover:bg-kartel-gold/10'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              )}
            </button>
          </div>

          <div className={`relative rounded-2xl p-5 ${
            isDark 
              ? 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/[0.05] shadow-luxury'
              : 'bg-white/90 backdrop-blur-xl border border-black/[0.08] shadow-luxury-lg'
          }`}>
            {error && !token && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-center">
                {error}
              </div>
            )}

            {token && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-2.5 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/90 text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                    isDark ? 'text-white/45' : 'text-kartel-black-400'
                  }`}>New Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                      isDark ? 'text-white/15 group-focus-within:text-kartel-gold/50' : 'text-kartel-black-300 group-focus-within:text-kartel-gold/70'
                    }`} strokeWidth={1.5} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-lg pl-9 pr-9 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 ${
                        isDark 
                          ? 'bg-white/[0.02] border-white/[0.05] text-white placeholder:text-white/15 focus:bg-white/[0.05]'
                          : 'bg-black/[0.03] border-black/[0.08] text-kartel-black-900 placeholder:text-kartel-black-300 focus:bg-black/[0.05]'
                      }`}
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                        isDark ? 'text-white/15 hover:text-white/40' : 'text-kartel-black-300 hover:text-kartel-black-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                    isDark ? 'text-white/45' : 'text-kartel-black-400'
                  }`}>Confirm Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                      isDark ? 'text-white/15 group-focus-within:text-kartel-gold/50' : 'text-kartel-black-300 group-focus-within:text-kartel-gold/70'
                    }`} strokeWidth={1.5} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 ${
                        isDark 
                          ? 'bg-white/[0.02] border-white/[0.05] text-white placeholder:text-white/15 focus:bg-white/[0.05]'
                          : 'bg-black/[0.03] border-black/[0.08] text-kartel-black-900 placeholder:text-kartel-black-300 focus:bg-black/[0.05]'
                      }`}
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold text-sm rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className={`mt-5 text-center text-xs ${isDark ? 'text-white/25' : 'text-kartel-black-400'}`}>
            Remember your password?{' '}
            <Link href="/login" className={`font-medium transition-colors ${isDark ? 'text-kartel-gold/60 hover:text-kartel-gold' : 'text-kartel-gold hover:text-kartel-gold/80'}`}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-kartel-black">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}