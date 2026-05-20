export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-kartel-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-kartel-gold/20 border-t-kartel-gold rounded-full animate-spin" />
        <span className="text-muted text-sm">Loading...</span>
      </div>
    </div>
  )
}
