import { HeroSection } from '@/components/hero/HeroSection'
import { FeaturedCollections } from '@/components/product/FeaturedCollections'
import BestSellersCarousel from '@/components/product/BestSellersCarousel'
import { BrandStory } from '@/components/common/BrandStory'
import { Testimonials } from '@/components/common/Testimonials'
import { NewsletterSignup } from '@/components/common/NewsletterSignup'
import connectDB from '@/lib/db'
import ProductModel from '@/models/Product'
import { Product } from '@/types'

export default async function HomePage() {
  await connectDB()
  const products = await ProductModel.find({ featured: true }).limit(5).lean()
  const serializedProducts: Product[] = products.map((p: Record<string, unknown>) => ({
    name: (p.name as string) || '',
    slug: (p.slug as string) || '',
    description: (p.description as string) || '',
    price: (p.price as number) || 0,
    comparePrice: (p.comparePrice as number) || 0,
    images: (p.images as string[]) || [],
    category: (p.category as 'mens' | 'womens' | 'unisex' | 'niche') || 'unisex',
    brand: (p.brand as string) || 'KARTEL',
    notes: (p.notes as { top: string[]; middle: string[]; base: string[] }) || { top: [], middle: [], base: [] },
    size: (p.size as string) || '50ml',
    concentration: (p.concentration as 'EDT' | 'EDP' | 'Parfum') || 'EDP',
    quantity: (p.quantity as number) || 0,
    inStock: (p.inStock as boolean) || true,
    featured: (p.featured as boolean) || false,
    rating: (p.rating as number) || 0,
    reviewCount: (p.reviewCount as number) || 0,
    tags: (p.tags as string[]) || [],
    createdAt: ((p.createdAt as Date)?.toISOString()) || new Date().toISOString(),
    updatedAt: ((p.updatedAt as Date)?.toISOString()) || new Date().toISOString(),
    _id: (p._id as { toString: () => string }).toString(),
  })) as Product[]

  return (
    <div className="bg-kartel-black">
      <HeroSection featuredProduct={serializedProducts[0] || null} />
      <FeaturedCollections products={serializedProducts} />
      <BestSellersCarousel products={serializedProducts} />
      <BrandStory />
      <Testimonials />
      <NewsletterSignup />
    </div>
  )
}
