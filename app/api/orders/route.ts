import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const query = session.user.role === 'admin' ? {} : { user: session.user.id }
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
    
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const body = await req.json()
    const { items, shippingAddress, totalAmount, paymentMethod } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    if (!shippingAddress || !shippingAddress.email) {
      return NextResponse.json({ error: 'Shipping address with email is required' }, { status: 400 })
    }

    let userId: string | null = null
    let guestEmail = shippingAddress.email
    let userName = shippingAddress.name || 'Guest'

    if (session?.user?.id) {
      userId = session.user.id
      const user = await User.findById(userId)
      if (user) {
        userName = user.name
        guestEmail = user.email
      }
    } else {
      const existingUser = await User.findOne({ email: guestEmail })
      if (existingUser) {
        userId = existingUser._id.toString()
        userName = existingUser.name
      }
    }

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product}` }, { status: 400 })
      }
      if (product.quantity < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        }, { status: 400 })
      }
      
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      )
      
      if (!updated) {
        return NextResponse.json({
          error: `Insufficient stock for product ${item.product}`
        }, { status: 409 })
      }
      
      if (updated.quantity === 0) {
        await Product.findByIdAndUpdate(item.product, { inStock: false })
      }
    }

    const orderNumber = `CJ-${Date.now().toString(36).toUpperCase()}`

    const orderData: any = {
      orderNumber,
      items: items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      totalAmount,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      paymentMethod: paymentMethod || 'cod',
    }
    
    if (userId) {
      orderData.user = userId
    }

    const order = await Order.create(orderData)

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price')

    if (guestEmail) {
      const itemDetails = populatedOrder.items.map((item: any) => ({
        name: item.product?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
      }))

      sendOrderConfirmationEmail(guestEmail, userName, orderNumber, totalAmount, itemDetails)
        .catch(err => console.error('Order confirmation email failed:', err))
    }

    return NextResponse.json({ 
      success: true,
      order: populatedOrder,
      orderNumber,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Order creation failed: ' + error.message }, { status: 500 })
  }
}