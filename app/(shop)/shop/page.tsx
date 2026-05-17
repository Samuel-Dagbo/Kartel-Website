'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Grid3X3, LayoutList, Search } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { Product as ProductType } from '@/types'

export default function ShopPage() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.append('category', category)
      if (brand) params.append('brand', brand)
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())
      if (searchQuery) params.append('search', searchQuery)
      if (sortBy) params.append('sort', sortBy)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, brand, priceRange, searchQuery, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const categories = ['mens', 'womens', 'unisex', 'niche']
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  )

  const hasActiveFilters =
    category !== 'all' || brand || searchQuery || priceRange[1] < 1000

  const clearFilters = () => {
    setCategory('all')
    setBrand('')
    setPriceRange([0, 1000])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen pt-28 lg:pt-32 pb-24 lg:pb-32 relative">
      {/* Ambient lighting */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-kartel-gold/[0.02] blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[35%] h-[35%] bg-kartel-gold/[0.015] blur-[180px] rounded-full pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 lg:mb-16 space-y-5"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-kartel-gold/80 mb-5 px-4 py-1.5 border border-kartel-gold/[0.15] rounded-full">
            The Collection
          </span>
          <h1 className="font-serif text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-heading leading-[1.1] tracking-[-0.02em]">
            Fragrance <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-base sm:text-lg text-body max-w-2xl leading-relaxed">
            Explore our curated collection of the finest perfumes. From timeless
            classics to modern avant-garde scents.
          </p>
        </motion.div>

        {/* Top bar with search & filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 pb-6 border-b border-black/[0.08] dark:border-white/[0.08]"
        >
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border text-sm navbar-text hover:text-kartel-gold hover:border-kartel-gold/30 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-kartel-gold" />
              )}
            </button>

            {/* Quick search */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 search-icon" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass rounded-full text-sm placeholder:text-muted focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View mode toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-black/[0.03] border border-black/[0.08] dark:bg-white/[0.04] dark:border-white/[0.08]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-kartel-gold/10 text-kartel-gold'
                    : 'text-muted hover:text-body'
                }`}
              >
                <Grid3X3 className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-kartel-gold/10 text-kartel-gold'
                    : 'text-muted hover:text-body'
                }`}
              >
                <LayoutList className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted tracking-wide">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-luxury rounded-full px-4 py-2.5 text-sm cursor-pointer appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 flex flex-wrap gap-2.5"
            >
              {category !== 'all' && (
                <button
                  onClick={() => setCategory('all')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kartel-gold/10 border border-kartel-gold/20 text-xs text-kartel-gold hover:bg-kartel-gold/20 transition-colors"
                >
                  {category}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              {brand && (
                <button
                  onClick={() => setBrand('')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kartel-gold/10 border border-kartel-gold/20 text-xs text-kartel-gold hover:bg-kartel-gold/20 transition-colors"
                >
                  {brand}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              {priceRange[1] < 1000 && (
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kartel-gold/10 border border-kartel-gold/20 text-xs text-kartel-gold hover:bg-kartel-gold/20 transition-colors"
                >
                  Under GHS {priceRange[1]}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-black/50 hover:text-kartel-gold dark:text-white/50 transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className={`w-full lg:w-72 xl:w-80 shrink-0 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="lg:sticky lg:top-32">
              <div className="bg-gradient-to-b from-black/[0.02] to-transparent dark:from-kartel-black-900/50 rounded-2xl p-6 lg:p-7 border border-black/[0.08] dark:border-white/[0.08]">
                <ProductFilters
                  categories={categories}
                  brands={brands}
                  selectedCategory={category}
                  setSelectedCategory={setCategory}
                  selectedBrand={brand}
                  setSelectedBrand={setBrand}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  clearFilters={clearFilters}
                />
              </div>
            </div>
          </motion.aside>

          {/* Product Listing */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-[11px] text-muted tracking-wide">
                {isLoading
                  ? 'Loading fragrances...'
                  : `${products.length} products found`}
              </p>
            </div>

            {isLoading ? (
              <div className={`grid gap-6 lg:gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
