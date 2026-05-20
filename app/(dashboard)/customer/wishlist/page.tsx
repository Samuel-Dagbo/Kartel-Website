'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product as ProductType } from '@/types'
import { useCart } from '@/components/providers/CartProvider'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const MOCK_WISHLIST: ProductType[] = [
  {
    _id: 'w1',
    name: 'Royal Oud',
    slug: 'royal-oud',
    description: 'Scent of power - A luxurious blend of rare oud wood with exotic spices.',
    price: 350,
    comparePrice: 420,
    images: ['https://images.unsplash.com/photo-1592914610358-2f1e15b4c9b7?q=80&w=2000&auto=format&fit=crop'],
    category: 'unisex',
    brand: 'Royal Scents',
    notes: { top: ['saffron', 'rose'], middle: ['oud', 'sandalwood'], base: ['amber', 'musk'] },
    size: '50ml',
    concentration: 'Parfum',
    quantity: 15,
    inStock: true,
    featured: true,
    new: false,
    rating: 5.0,
    reviewCount: 45,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'w2',
    name: 'Celestial Mist',
    slug: 'celestial-mist',
    description: 'Ethereal scent - A delicate fusion of moonflowers and soft musks.',
    price: 195,
    images: ['https://images.unsplash.com/photo-1626090710777-628f52281a44?q=80&w=1974&auto=format&fit=crop'],
    category: 'unisex',
    brand: 'Starlight Fragrances',
    notes: { top: ['bergamot', 'pear'], middle: ['jasmine', 'violet'], base: ['sandalwood', 'vanilla'] },
    size: '50ml',
    concentration: 'EDT',
    quantity: 40,
    inStock: true,
    featured: false,
    new: false,
    rating: 4.7,
    reviewCount: 62,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'w3',
    name: 'Midnight Noir',
    slug: 'midnight-noir',
    description: 'Dark and mysterious - An intoxicating blend of tobacco and dark amber.',
    price: 275,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop'],
    category: 'mens',
    brand: 'Noir Collection',
    notes: { top: ['black pepper', 'cardamom'], middle: ['tobacco', 'leather'], base: ['amber', 'patchouli'] },
    size: '100ml',
    concentration: 'EDP',
    quantity: 8,
    inStock: true,
    featured: true,
    new: false,
    rating: 4.9,
    reviewCount: 38,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function WishlistPage() {
  const { addItem } = useCart()
  const [wishlist, setWishlist] = React.useState(MOCK_WISHLIST)

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p._id !== id))
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your favorites.",
    })
  }

  const moveToCart = (product: ProductType) => {
    addItem({ product, quantity: 1 })
    removeFromWishlist(product._id)
    toast({
      title: "Moved to cart",
      description: `${product.name} is now in your shopping bag.`,
    })
  }

  const totalValue = wishlist.reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading flex items-center gap-3">
            <Heart className="w-7 h-7 text-kartel-gold" />
            My Wishlist
          </h1>
          <p className="text-muted text-sm mt-1">Your saved fragrances</p>
        </div>
        {wishlist.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card">
            <Sparkles className="w-4 h-4 text-kartel-gold" />
            <span className="text-muted text-sm">{wishlist.length} fragrance{wishlist.length !== 1 ? 's' : ''}</span>
            <span className="text-muted/30">•</span>
            <span className="text-heading text-sm font-medium">{formatPrice(totalValue)}</span>
          </div>
        )}
      </motion.div>

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-2xl glass-card text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-kartel-gold/10 to-kartel-gold/5 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-kartel-gold/40" />
          </div>
          <h3 className="text-xl font-semibold text-heading mb-3">Your wishlist is empty</h3>
          <p className="text-muted mb-8 max-w-sm mx-auto">
            Save fragrances you love to easily find them later and keep track of your favorite scents.
          </p>
          <Link 
            href="/shop" 
            className="btn-primary inline-flex items-center gap-2"
          >
            Discover Fragrances
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative"
              >
                <ProductCard product={product} />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => moveToCart(product)}
                    className="p-3 rounded-full bg-kartel-gold text-kartel-black shadow-lg hover:shadow-xl hover:bg-kartel-gold-light transition-all"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-3 rounded-full bg-red-500/90 text-white shadow-lg hover:bg-red-500 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Inspiration Section */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-black/[0.06] dark:border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg font-semibold text-heading">You might also like</h2>
            <Link href="/shop" className="text-sm text-kartel-gold hover:text-kartel-gold/80 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-muted text-sm">Explore more fragrances from our collection</p>
        </motion.div>
      )}
    </div>
  )
}