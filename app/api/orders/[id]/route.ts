import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await Order.findById(params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (session.user.role !== 'admin' && order.user?._id?.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status, trackingNumber, paymentStatus } = body

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const previousStatus = order.status

    if (status) order.status = status
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber
    if (paymentStatus) order.paymentStatus = paymentStatus

    await order.save()

    // Restore stock if order is cancelled
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity, inStock: item.quantity > 0 ? 0 : 0 }
        })
        const product = await Product.findById(item.product)
        if (product && product.quantity > 0) {
          product.inStock = true
          await product.save()
        }
      }
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name price')

    if (status && populatedOrder.shippingAddress?.email) {
      const userName = populatedOrder.user?.name || populatedOrder.shippingAddress.name || 'Customer'
      sendOrderStatusUpdateEmail(
        populatedOrder.shippingAddress.email,
        userName,
        populatedOrder.orderNumber,
        status
      ).catch(err => console.error('Order status email failed:', err))
    }

    return NextResponse.json(populatedOrder, { status: 200 })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await Order.findByIdAndDelete(params.id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Order delete error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
