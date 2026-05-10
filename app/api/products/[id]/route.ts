import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Product from '@/models/Product'

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }
  
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }
  
  await mongoose.connect(MONGODB_URI)
  return mongoose.connection
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    let product = await Product.findById(params.id).lean()
    
    if (!product) {
      product = await Product.findOne({ slug: params.id }).lean()
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product, { status: 200 })
  } catch (error: any) {
    console.error('Product API Error:', error)
    if (error.message.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await req.json()
    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const product = await Product.findByIdAndDelete(params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
