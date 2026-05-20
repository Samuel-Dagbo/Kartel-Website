import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import Discount from '@/models/Discount'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const discounts = await Discount.find().sort({ createdAt: -1 })
    return NextResponse.json(discounts)
  } catch (error) {
    console.error('Discounts fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()
    const discount = await Discount.create(body)
    return NextResponse.json(discount, { status: 201 })
  } catch (error: unknown) {
    console.error('Discount create error:', error)
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Discount ID required' }, { status: 400 })
    }

    await connectDB()
    const body = await req.json()
    const discount = await Discount.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!discount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 })
    }
    return NextResponse.json(discount)
  } catch (error: unknown) {
    console.error('Discount update error:', error)
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Discount ID required' }, { status: 400 })
    }

    await connectDB()
    await Discount.findByIdAndDelete(id)
    return NextResponse.json({ message: 'Discount deleted' })
  } catch (error) {
    console.error('Discount delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
