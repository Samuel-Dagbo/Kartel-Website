'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
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
    if (session?.user && status === 'authenticated') {
      if (session.user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/customer')
      }
    }
  }, [session, status, router])

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
        setError('Registration successful but login failed. Please try logging in.')
      } else {
        router.push('/customer')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark'

  if (status === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-kartel-black' : 'bg-white'}`}>
        <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session?.user && status === 'authenticated') {
    return null
  }

  return (
    <div className={`min-h-[100dvh] relative overflow-hidden flex ${
      isDark 
        ? 'bg-kartel-black' 
        : 'bg-gradient-to-br from-white via-kartel-white-50 to-white'
    }`}>
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-kartel-gold/[0.03] blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-kartel-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[42%] relative items-center justify-center p-8"
      >
        <div className={`relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden ${
          isDark ? 'border border-white/[0.06] shadow-luxury-xl' : 'border border-black/[0.06] shadow-luxury-lg'
        }`}>
          <Image
            src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&auto=format&fit=crop&q=60"
            alt="Luxury Perfume Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

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

      <div className="flex-1 flex items-start justify-center px-5 sm:px-8 pt-[5.5rem] lg:pt-[6.5rem] pb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 transition-colors text-xs mb-4 group ${
              isDark ? 'text-white/35 hover:text-kartel-gold' : 'text-black/50 hover:text-kartel-gold'
            }`}
          >
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
              }`}>Create Account</h1>
              <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Join the CARL JONES family today.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'text-white/35 hover:text-kartel-gold hover:bg-white/[0.06]' 
                  : 'text-black/40 hover:text-kartel-gold hover:bg-kartel-gold/10'
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
              ? 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-luxury'
              : 'bg-white border border-black/[0.08] shadow-lg'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/90 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1">
              <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                isDark ? 'text-white/55' : 'text-black/50'
              }`}>Full Name</label>
              <div className="relative group">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  isDark ? 'text-white/25 group-focus-within:text-kartel-gold/60' : 'text-black/25 group-focus-within:text-kartel-gold/70'
                }`} strokeWidth={1.5} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:bg-white/[0.06]'
                      : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/30 focus:bg-black/[0.04]'
                  }`}
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
              <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                isDark ? 'text-white/55' : 'text-black/50'
              }`}>Email</label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  isDark ? 'text-white/25 group-focus-within:text-kartel-gold/60' : 'text-black/25 group-focus-within:text-kartel-gold/70'
                }`} strokeWidth={1.5} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:bg-white/[0.06]'
                      : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/30 focus:bg-black/[0.04]'
                  }`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
              <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                isDark ? 'text-white/55' : 'text-black/50'
              }`}>Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  isDark ? 'text-white/25 group-focus-within:text-kartel-gold/60' : 'text-black/25 group-focus-within:text-kartel-gold/70'
                }`} strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg pl-9 pr-9 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:bg-white/[0.06]'
                      : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/30 focus:bg-black/[0.04]'
                  }`}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? 'text-white/15 hover:text-white/40' : 'text-black/30 hover:text-black/60'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
              <label className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                isDark ? 'text-white/55' : 'text-black/50'
              }`}>Confirm Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  isDark ? 'text-white/25 group-focus-within:text-kartel-gold/60' : 'text-black/25 group-focus-within:text-kartel-gold/70'
                }`} strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:bg-white/[0.06]'
                      : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/30 focus:bg-black/[0.04]'
                  }`}
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 bg-kartel-black text-white font-semibold text-sm rounded-lg shadow-lg hover:bg-kartel-black-900 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 relative group overflow-hidden"
              >
                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-transparent via-white/[0.08] to-transparent' : 'bg-gradient-to-r from-transparent via-black/[0.08] to-transparent'}`} />
              <span className={`text-[9px] uppercase tracking-[0.15em] ${isDark ? 'text-white/50' : 'text-black/55'}`}>or</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-transparent via-white/[0.08] to-transparent' : 'bg-gradient-to-r from-transparent via-black/[0.08] to-transparent'}`} />
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/customer' })}
              className={`w-full py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs font-medium ${
                isDark 
                  ? 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white/80 hover:border-white/[0.12] hover:bg-white/[0.06]'
                  : 'bg-black/[0.02] border border-black/[0.08] text-black/60 hover:text-black/80 hover:border-kartel-gold/30 hover:bg-kartel-gold/5'
              }`}
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

          <p className={`mt-5 text-center text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            Already have an account?{' '}
            <Link href="/login" className={`font-medium transition-colors ${isDark ? 'text-kartel-gold/70 hover:text-kartel-gold' : 'text-kartel-gold hover:text-kartel-gold/80'}`}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}