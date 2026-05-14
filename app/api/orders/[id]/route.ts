import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await req.json()
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const customerEmail = order.user?.email || order.shippingAddress?.email
    const customerName = order.user?.name || order.shippingAddress?.name || 'Customer'

    if (customerEmail) {
      sendOrderStatusUpdateEmail(customerEmail, customerName, order.orderNumber || `KRT-${order._id.toString().slice(-6).toUpperCase()}`, status)
        .catch(err => console.error('Status update email failed:', err))
    }

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}