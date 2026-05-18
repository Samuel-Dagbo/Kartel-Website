'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Star, Trash2, Search, User, Package, MessageSquare, ThumbsUp } from 'lucide-react'

interface ReviewItem {
  _id: string
  user: { _id: string; name: string; email: string }
  product: { _id: string; name: string; images: string[] }
  rating: number
  comment: string
  createdAt: string
}

export default function ReviewsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = reviews.filter(
    (r) =>
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>Reviews</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Customer feedback and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Reviews', value: reviews.length, icon: MessageSquare },
          { label: 'Average Rating', value: avgRating, icon: Star },
          { label: '5-Star Reviews', value: reviews.filter((r) => r.rating === 5).length, icon: ThumbsUp },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl border transition-colors ${
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stat.label}</span>
              <stat.icon className="w-4 h-4 text-kartel-gold" strokeWidth={1.5} />
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/20' : 'text-black/40'}`} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 ${
            isDark ? 'bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/20' : 'bg-black/[0.03] border border-black/[0.08] text-kartel-black-900 placeholder:text-black/25'
          }`}
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-5 rounded-2xl border transition-colors duration-300 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kartel-gold/20 to-kartel-gold/5 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-kartel-gold/50" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-kartel-black-900'}`}>{review.user?.name || 'Anonymous'}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'text-kartel-gold fill-kartel-gold' : isDark ? 'text-white/10' : 'text-black/10'}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3 h-3 text-kartel-gold/50" strokeWidth={1.5} />
                    <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>{review.product?.name || 'Deleted Product'}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-kartel-black-600'}`}>{review.comment}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className={`text-center py-16 text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>
            No reviews found
          </p>
        )}
      </div>
    </div>
  )
}
