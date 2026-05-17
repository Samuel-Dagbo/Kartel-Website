'use client'

import { Search, X, SlidersHorizontal, Check } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-black/70'}`}>
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`text-caption ${isDark ? 'text-white/45' : 'text-black/45'} hover:text-kartel-gold transition-colors flex items-center gap-1`}
          >
            <X className="w-3 h-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative lg:hidden">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-white/35' : 'text-black/35'
          }`}
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Search fragrances..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-kartel-gold/40 focus:ring-1 focus:ring-kartel-gold/15 transition-all ${
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/35'
              : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/35'
          }`}
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className={`text-overline ${isDark ? 'text-white/60' : 'text-black/50'}`}>Category</h4>
        <div className="flex flex-wrap gap-2">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all duration-300',
                selectedCategory === cat
                  ? 'bg-kartel-gold text-kartel-black shadow-gold-glow'
                  : isDark
                    ? 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80 border border-white/[0.08]'
                    : 'bg-black/[0.02] text-black/60 hover:bg-black/[0.04] hover:text-black/80 border border-black/[0.08]'
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
          <h4 className={`text-overline ${isDark ? 'text-white/60' : 'text-black/50'}`}>Brands</h4>
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
                    : isDark
                      ? 'text-white/55 hover:bg-white/[0.04] hover:text-white/80'
                      : 'text-black/55 hover:bg-black/[0.03] hover:text-black/80'
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
          <h4 className={`text-overline ${isDark ? 'text-white/60' : 'text-black/50'}`}>Price Range</h4>
          <span className="text-caption text-kartel-gold/80">
            GHS {priceRange[0]} — GHS {priceRange[1]}
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
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-kartel-gold ${
              isDark ? 'bg-white/10' : 'bg-black/10'
            }`}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}>
              GHS
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
              className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-kartel-gold/40 transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white/80'
                  : 'bg-black/[0.02] border-black/[0.08] text-black/80'
              }`}
            />
          </div>
          <div className="flex-1 relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}>
              GHS
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
              className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-kartel-gold/40 transition-all ${
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white/80'
                  : 'bg-black/[0.02] border-black/[0.08] text-black/80'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
