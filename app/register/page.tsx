'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/customer')
      }
    }
  }, [session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Registration successful but login failed')
      }
      // Redirect will happen via useEffect
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-kartel-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session?.user) {
    return null
  }

  return (
    <div className="min-h-[100dvh] bg-kartel-black relative overflow-hidden flex">
      {/* Ambient lighting */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-kartel-gold/[0.03] blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-kartel-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />

      {/* Left Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[42%] relative items-center justify-center p-8"
      >
        <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/[0.06] shadow-luxury-xl">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea4779421f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
            alt="Luxury Perfume Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kartel-black via-kartel-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-kartel-black/60 via-transparent to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-kartel-gold" strokeWidth={1.5} />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-kartel-gold">Join Us</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-white leading-tight mb-2">
                Begin Your <span className="text-gradient">Journey</span>
              </h2>
              <p className="text-xs text-white/40 leading-relaxed">
                Create an account to unlock exclusive perks, save your favorites, and enjoy a personalized fragrance experience.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-start justify-center px-5 sm:px-8 pt-[5.5rem] lg:pt-[6.5rem] pb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/25 hover:text-kartel-gold transition-colors text-xs mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-4">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-serif font-bold tracking-[0.3em] text-gradient-shine">
                KARTEL
              </span>
            </Link>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-[-0.01em]">
              Create Account
            </h1>
            <p className="mt-1 text-white/35 text-xs">
              Join the KARTEL family today.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl rounded-2xl p-5 border border-white/[0.05] shadow-luxury">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/90 text-xs">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium tracking-[0.15em] text-white/45 uppercase">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 group-focus-within:text-kartel-gold/50 transition-colors" strokeWidth={1.5} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 focus:bg-white/[0.03] transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium tracking-[0.15em] text-white/45 uppercase">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 group-focus-within:text-kartel-gold/50 transition-colors" strokeWidth={1.5} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 focus:bg-white/[0.03] transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium tracking-[0.15em] text-white/45 uppercase">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 group-focus-within:text-kartel-gold/50 transition-colors" strokeWidth={1.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 focus:bg-white/[0.03] transition-all"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium tracking-[0.15em] text-white/45 uppercase">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 group-focus-within:text-kartel-gold/50 transition-colors" strokeWidth={1.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-kartel-gold/25 focus:ring-1 focus:ring-kartel-gold/8 focus:bg-white/[0.03] transition-all"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold text-sm rounded-lg shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 relative group overflow-hidden"
              >
                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
              <span className="text-[9px] text-white/15 uppercase tracking-[0.15em]">or</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
            </div>

            {/* Google Sign Up */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/customer' })}
              className="w-full py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg text-white/50 hover:text-white/80 hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-center gap-2 text-xs font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-5 text-center text-white/25 text-xs">
            Already have an account?{' '}
            <Link href="/login" className="text-kartel-gold/60 hover:text-kartel-gold font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
