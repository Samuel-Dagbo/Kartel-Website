'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Star, ChevronRight, ChevronLeft, Truck, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { Product as ProductType } from '@/types'
import { useTheme } from '@/components/providers/ThemeProvider'

function ProductContent({ id }: { id: string }) {
  const [product, setProduct] = useState<ProductType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error loading product:', error)
        toast({
          title: "Error",
          description: "Could not load product details.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem({ product, quantity: 1 })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const nextImage = () => setActiveImage((prev) => (prev + 1) % (product?.images.length || 1))
  const prevImage = () => setActiveImage((prev) => (prev - 1 + (product?.images.length || 1)) % (product?.images.length || 1))

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-kartel-cream dark:bg-kartel-black transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-kartel-gold/20 border-t-kartel-gold rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading Essence</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-kartel-cream dark:bg-kartel-black transition-colors duration-300">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-black/[0.03] border border-black/[0.06]'
        }`}>
          <Sparkles className={`w-7 h-7 ${isDark ? 'text-white/15' : 'text-black/15'}`} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-heading mb-4">Fragrance Not Found</h1>
        <p className="text-muted mb-8 max-w-sm">
          The fragrance you&apos;re looking for may have been discontinued or moved.
        </p>
        <Link href="/shop" className="btn-primary px-8 py-3">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 lg:pt-32 pb-20 lg:pb-28 bg-kartel-cream dark:bg-kartel-black transition-colors duration-300">
      <div className="container-luxury">
        <nav className="flex items-center gap-2 text-sm text-muted mb-10 lg:mb-14">
          <Link href="/" className="hover:text-kartel-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-kartel-gold transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-body truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card shadow-luxury p-3">
              <div className={`relative w-full h-full rounded-2xl overflow-hidden ${
                isDark ? 'bg-kartel-black-900' : 'bg-kartel-cream-dark'
              }`}>
                <Image
                  src={product.images[activeImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700"
                  priority
                />
              </div>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full glass-dark text-muted hover:text-kartel-gold hover:border-kartel-gold/25 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full glass-dark text-muted hover:text-kartel-gold hover:border-kartel-gold/25 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeImage === idx
                        ? 'border-kartel-gold/50 ring-1 ring-kartel-gold/30'
                        : isDark ? 'border-white/[0.05] opacity-50 hover:opacity-80' : 'border-black/[0.06] opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image src={img} alt={product.name} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-kartel-gold/80">{product.brand}</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading text-balance">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < product.rating ? 'text-kartel-gold fill-kartel-gold' : isDark ? 'text-white/15' : 'text-black/10'}`}
                      />
                    ))}
                    <span className="text-sm text-muted ml-2">({product.reviewCount || 0} reviews)</span>
                  </div>
                  <span className="text-muted/50">|</span>
                  <span className="text-sm text-muted">{product.concentration} &bull; {product.size}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-heading tracking-tight">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-lg text-muted line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>

              <p className="text-base text-body leading-[1.8]">
                {product.description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/[0.06] dark:border-white/[0.04]">
                {[
                  { label: 'Top Notes', notes: product.notes?.top || [] },
                  { label: 'Heart Notes', notes: product.notes?.middle || [] },
                  { label: 'Base Notes', notes: product.notes?.base || [] },
                ].map((section) => (
                  <div key={section.label} className="text-center space-y-2">
                    <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-kartel-gold/70">{section.label}</h4>
                    <p className="text-sm text-body leading-snug">
                      {section.notes.join(', ')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-3 px-6 py-4"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  Add to Bag
                </button>
                <button className="btn-ghost p-4 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
                  <div className="p-2 rounded-full bg-kartel-gold/10">
                    <Truck className="w-4 h-4 text-kartel-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-body">Free Shipping</p>
                    <p className="text-xs text-muted">Orders over GHS 600</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
                  <div className="p-2 rounded-full bg-kartel-gold/10">
                    <ShieldCheck className="w-4 h-4 text-kartel-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-body">Authenticity</p>
                    <p className="text-xs text-muted">100% Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center bg-kartel-cream dark:bg-kartel-black transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-kartel-gold/20 border-t-kartel-gold rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading...</span>
        </div>
      </div>
    }>
      <ProductContent id={params.id} />
    </Suspense>
  )
}
