'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product as ProductType } from '@/types'
import { useCart } from '@/components/providers/CartProvider'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

const MOCK_WISHLIST: ProductType[] = [
  {
    _id: 'w1',
    name: 'Royal Oud',
    slug: 'royal-oud',
    description: 'Scent of power',
    price: 350,
    images: ['https://images.unsplash.com/photo-1592914610358-2f1e15b4c9b7?q=80&w=2000&auto=format&fit=crop'],
    category: 'unisex',
    brand: 'Royal Scents',
    notes: { top: [], middle: [], base: [] },
    size: '50ml',
    concentration: 'Parfum',
    quantity: 15,
    inStock: true,
    featured: true,
    rating: 5.0,
    reviewCount: 45,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'w2',
    name: 'Celestial Mist',
    slug: 'celestial-mist',
    description: 'Ethereal scent',
    price: 195,
    images: ['https://images.unsplash.com/photo-1626090710777-628f52281a44?q=80&w=1974&auto=format&fit=crop'],
    category: 'unisex',
    brand: 'Starlight Fragrances',
    notes: { top: [], middle: [], base: [] },
    size: '50ml',
    concentration: 'EDT',
    quantity: 40,
    inStock: true,
    featured: false,
    rating: 4.7,
    reviewCount: 62,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold text-white flex items-center gap-3">
          <Heart className="w-10 h-10 text-kartel-gold" />
          My Wishlist
        </h1>
        <div className="text-white/60 text-sm">Saved Fragrances: {wishlist.length}</div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 space-y-6">
          <Heart className="w-20 h-20 text-white/10 mx-auto" />
          <h2 className="text-2xl font-serif text-white">Your wishlist is empty</h2>
          <p className="text-white/60 max-w-md mx-auto">Save fragrances you love to easily find them later and keep track of your favorite scents.</p>
          <Link href="/shop" className="btn-primary px-8 py-3">Discover Now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div key={product._id} className="group relative">
              <ProductCard product={product} />
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => moveToCart(product)}
                  className="p-3 rounded-full bg-kartel-gold text-kartel-black shadow-xl hover:scale-110 transition-transform"
                  title="Move to Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="p-3 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 transition-transform"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
