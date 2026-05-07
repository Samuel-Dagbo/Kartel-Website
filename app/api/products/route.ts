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

    let products = await Product.find(query).sort({ createdAt: -1 })

    if (sort === 'price-asc') products = await Product.find(query).sort({ price: 1 })
    if (sort === 'price-desc') products = await Product.find(query).sort({ price: -1 })
    if (sort === 'rating') products = await Product.find(query).sort({ rating: -1 })

    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
