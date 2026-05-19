import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import { initializeTransaction } from '@/lib/paystack'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const body = await req.json()
    const { items, shippingAddress, totalAmount, callbackUrl } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    if (!shippingAddress?.email) {
      return NextResponse.json({ error: 'Shipping address with email is required' }, { status: 400 })
    }

    let userId: string | null = null
    let customerEmail = shippingAddress.email
    let customerName = shippingAddress.name || 'Guest'

    if (session?.user?.id) {
      userId = session.user.id
      const user = await User.findById(userId)
      if (user) {
        customerName = user.name
        customerEmail = user.email
      }
    } else {
      const existingUser = await User.findOne({ email: customerEmail })
      if (existingUser) {
        userId = existingUser._id.toString()
        customerName = existingUser.name
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
    }

    const orderNumber = `CJ-${Date.now().toString(36).toUpperCase()}`

    const orderData: Record<string, unknown> = {
      orderNumber,
      items: items.map((item: { product: string; quantity: number; price: number }) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
    }

    if (userId) {
      orderData.user = userId
    }

    const order = await Order.create(orderData)

    const paystackCallbackUrl = callbackUrl ||
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/paystack/callback`

    const result = await initializeTransaction({
      email: customerEmail,
      amount: totalAmount,
      metadata: {
        orderId: order._id.toString(),
        orderNumber,
        customerName,
        custom_fields: [
          {
            display_name: 'Order Number',
            variable_name: 'order_number',
            value: orderNumber,
          },
        ],
      },
      callbackUrl: paystackCallbackUrl,
    })

    await Order.findByIdAndUpdate(order._id, {
      paystackReference: result.reference,
      paystackAccessCode: result.accessCode,
    })

    return NextResponse.json({
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference,
      orderId: order._id,
      orderNumber,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Paystack initialize error:', error)
    return NextResponse.json({ error: error.message || 'Payment initialization failed' }, { status: 500 })
  }
}
