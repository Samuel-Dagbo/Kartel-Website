import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-kartel-black">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-7 h-7 text-black/50 dark:text-white/45" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-heading mb-3">
          Page not found
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
          Return Home
        </Link>
      </div>
    </div>
  )
}
