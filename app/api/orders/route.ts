import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import InventoryLog from '@/models/InventoryLog'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const body = await req.json()
    const { items, shippingAddress, totalAmount } = body

    let userId = null
    let guestEmail = null
    let userName = shippingAddress?.name || 'Customer'

    if (session?.user?.id) {
      userId = session.user.id
      const user = await User.findById(userId)
      if (user) {
        userName = user.name
        guestEmail = user.email
      }
    } else if (shippingAddress?.email) {
      guestEmail = shippingAddress.email
      const existingUser = await User.findOne({ email: shippingAddress.email })
      if (existingUser) {
        userId = existingUser._id
        userName = existingUser.name
      }
    }

    if (!userId && !guestEmail) {
      return NextResponse.json({ error: 'Please provide email or login to place order' }, { status: 400 })
    }

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ error: `Product not found` }, { status: 400 })
      }
      if (product.quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
      
      product.quantity -= item.quantity
      if (product.quantity === 0) product.inStock = false
      await product.save()

      if (userId) {
        await InventoryLog.create({
          product: product._id,
          type: 'removal',
          quantity: item.quantity,
          previousQuantity: product.quantity + item.quantity,
          newQuantity: product.quantity,
          reason: 'Order',
          user: userId,
        })
      }
    }

    const orderNumber = `KRT-${Date.now().toString(36).toUpperCase()}`

    const orderData: any = {
      orderNumber,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    }
    
    if (userId) {
      orderData.user = userId
    }

    const order = await Order.create(orderData)

    const populatedOrder = await Order.findById(order._id).populate('items.product', 'name price')

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
      ...order.toObject(),
      guestEmail: guestEmail || (session?.user?.email)
    }, { status: 201 })
  } catch (error: any) {
    console.error('Order error:', error)
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
