'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Search, Grid3X3, LayoutList, Sparkles, ArrowRight, Tag, Check } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { Product as ProductType } from '@/types'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', label: 'All Fragrances', icon: Sparkles },
  { id: 'mens', label: "Men's Collection" },
  { id: 'womens', label: "Women's Collection" },
  { id: 'unisex', label: 'Unisex' },
  { id: 'niche', label: 'Niche' },
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest' },
]

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

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  )

  const hasActiveFilters =
    category !== 'all' || brand || searchQuery || priceRange[1] < 1000

  const clearFilters = () => {
    setCategory('all')
    setBrand('')
    setPriceRange([0, 15000])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-24 lg:pb-32 relative">
      {/* Ambient lighting */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-kartel-gold/[0.02] blur-[200px] rounded-full pointer-events-none" />
      <div className="fixed top-[30%] left-[-10%] w-[35%] h-[35%] bg-kartel-gold/[0.015] blur-[180px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[20%] w-[25%] h-[25%] bg-purple-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 lg:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kartel-gold/20 bg-kartel-gold/5 mb-6"
          >
            <Tag className="w-3 h-3 text-kartel-gold" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-kartel-gold/90">
              Curated Collection
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-heading leading-[1.1] tracking-[-0.02em]">
                Fragrance
                <span className="block text-gradient mt-1">Gallery</span>
              </h1>
              <p className="text-base sm:text-lg text-body/80 max-w-2xl leading-relaxed">
                Explore our meticulously curated collection of the world&apos;s finest perfumes.
                From timeless classics to avant-garde creations.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden lg:flex items-center gap-4 shrink-0"
            >
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/[0.03] border border-black/[0.08] dark:bg-white/[0.04] dark:border-white/[0.08]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-full transition-all duration-300',
                    viewMode === 'grid'
                      ? 'bg-kartel-gold/10 text-kartel-gold shadow-sm'
                      : 'text-muted hover:text-body'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-full transition-all duration-300',
                    viewMode === 'list'
                      ? 'bg-kartel-gold/10 text-kartel-gold shadow-sm'
                      : 'text-muted hover:text-body'
                  )}
                >
                  <LayoutList className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Category Pills - Horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-8 lg:mb-10"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0">
            {categories.map((cat, index) => {
              const isActive = category === cat.id
              const Icon = cat.icon
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-500',
                    isActive
                      ? 'bg-kartel-gold text-kartel-black shadow-lg shadow-kartel-gold/20'
                      : 'bg-black/[0.03] dark:bg-white/[0.04] text-body/70 hover:text-body border border-transparent hover:border-kartel-gold/20'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  {cat.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-kartel-gold rounded-full -z-10"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Top Bar: Search, Filters, Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 pb-6 border-b border-black/[0.08] dark:border-white/[0.08]"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-body/70 hover:text-kartel-gold hover:border-kartel-gold/30 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-kartel-gold animate-pulse" />
              )}
            </button>

            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search fragrances by name, brand, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-sm text-body placeholder:text-muted/60 focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-muted tracking-wide hidden sm:inline">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full px-4 py-2.5 text-sm bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-body cursor-pointer appearance-none pr-8 focus:outline-none focus:border-kartel-gold/30 transition-all"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
              className="mb-6 flex flex-wrap gap-2"
            >
              {category !== 'all' && (
                <button
                  onClick={() => setCategory('all')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kartel-gold/8 border border-kartel-gold/15 text-xs text-kartel-gold hover:bg-kartel-gold/15 transition-all"
                >
                  {categories.find(c => c.id === category)?.label || category}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              {brand && (
                <button
                  onClick={() => setBrand('')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kartel-gold/8 border border-kartel-gold/15 text-xs text-kartel-gold hover:bg-kartel-gold/15 transition-all"
                >
                  {brand}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              {priceRange[1] < 1000 && (
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kartel-gold/8 border border-kartel-gold/15 text-xs text-kartel-gold hover:bg-kartel-gold/15 transition-all"
                >
                  Under GHS {priceRange[1]}
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs text-muted hover:text-kartel-gold transition-all"
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
            className={cn(
              'w-full lg:w-72 xl:w-80 shrink-0',
              showMobileFilters ? 'block fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'
            )}
          >
            <div className={cn(
              'h-full overflow-y-auto',
              showMobileFilters
                ? 'bg-white dark:bg-kartel-black p-5'
                : 'lg:sticky lg:top-36'
            )}>
              {showMobileFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-serif text-lg font-bold text-heading">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <div className="bg-gradient-to-b from-black/[0.02] to-transparent dark:from-kartel-black-900/50 rounded-2xl p-6 lg:p-7 border border-black/[0.08] dark:border-white/[0.08]">
                <ProductFilters
                  categories={categories.filter(c => c.id !== 'all').map(c => c.id)}
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
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-muted tracking-wide">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-kartel-gold/20 border-t-kartel-gold rounded-full animate-spin" />
                    Loading fragrances...
                  </span>
                ) : (
                  `${products.length} ${products.length === 1 ? 'fragrance' : 'fragrances'} found`
                )}
              </p>
            </div>

            {isLoading ? (
              <div className={cn(
                'grid gap-6 lg:gap-8',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
