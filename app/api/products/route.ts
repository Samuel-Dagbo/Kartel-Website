import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')

    let query: any = {}

    if (category && category !== 'all') {
      query.category = category
    }

    if (brand) {
      query.brand = brand
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (search) {
      query.$text = { $search: search }
    }

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 }
    if (sort === 'price-asc') sortQuery = { price: 1 }
    else if (sort === 'price-desc') sortQuery = { price: -1 }
    else if (sort === 'rating') sortQuery = { rating: -1, createdAt: -1 }
    else if (sort === 'newest') sortQuery = { createdAt: -1 }

    const products = await Product.find(query).sort(sortQuery)

    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
