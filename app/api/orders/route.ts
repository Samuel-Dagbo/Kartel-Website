import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import InventoryLog from '@/models/InventoryLog'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, shippingAddress, totalAmount } = body

    // 1. Validate stock and update inventory
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product || product.quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product?.name || 'product'}` }, { status: 400 })
      }
      
      product.quantity -= item.quantity
      if (product.quantity === 0) product.inStock = false
      await product.save()

      // Log inventory change
      await InventoryLog.create({
        product: product._id,
        type: 'removal',
        quantity: item.quantity,
        previousQuantity: product.quantity + item.quantity,
        newQuantity: product.quantity,
        reason: `Order ${body.orderId || 'Pending'}`,
        user: session.user.id,
      })
    }

    // 2. Create order
    const order = await Order.create({
      user: session.user.id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // If admin, get all orders, otherwise get user orders
    const query = session.user.role === 'admin' ? {} : { user: session.user.id }
    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 })
    
    return NextResponse.json(orders, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
