'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-kartel-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-heading mb-3">
          Something went wrong
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2 px-8 py-3"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          Try again
        </button>
      </motion.div>
    </div>
  )
}
