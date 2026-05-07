'use client'

import { Search, X, SlidersHorizontal, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  categories: string[]
  brands: string[]
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery,
  clearFilters,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedCategory !== 'all' || selectedBrand || searchQuery || priceRange[1] < 1000

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="w-4 h-4 text-kartel-gold"
            strokeWidth={1.5}
          />
          <h3 className="text-sm font-semibold text-white/80">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-caption text-white/35 hover:text-kartel-gold transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative lg:hidden">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Search fragrances..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-kartel-gold/30 focus:ring-1 focus:ring-kartel-gold/10 transition-all"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-overline text-white/50">Category</h4>
        <div className="flex flex-wrap gap-2">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all duration-300',
                selectedCategory === cat
                  ? 'bg-kartel-gold text-kartel-black shadow-gold-glow'
                  : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/80 border border-white/[0.05]'
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-overline text-white/50">Brands</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setSelectedBrand(selectedBrand === brand ? '' : brand)
                }
                className={cn(
                  'flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-all duration-200',
                  selectedBrand === brand
                    ? 'bg-kartel-gold/10 text-kartel-gold'
                    : 'text-white/45 hover:bg-white/[0.03] hover:text-white/70'
                )}
              >
                <span>{brand}</span>
                {selectedBrand === brand && (
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="text-overline text-white/50">Price Range</h4>
          <span className="text-caption text-kartel-gold/80">
            ${priceRange[0]} — ${priceRange[1]}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-kartel-gold"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">
              $
            </span>
            <input
              type="number"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([
                  parseInt(e.target.value) || 0,
                  priceRange[1],
                ])
              }
              className="w-full pl-6 pr-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white/70 focus:outline-none focus:border-kartel-gold/30 transition-all"
            />
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">
              $
            </span>
            <input
              type="number"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  parseInt(e.target.value) || 1000,
                ])
              }
              className="w-full pl-6 pr-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white/70 focus:outline-none focus:border-kartel-gold/30 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
