import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, email } = await req.json()

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 })
    }

    await connectDB()

    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
      'shippingAddress.email': email.toLowerCase(),
    })
      .populate('items.product', 'name price images')
      .lean()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json({ error: 'Failed to find order' }, { status: 500 })
  }
}
