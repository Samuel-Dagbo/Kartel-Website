import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { verifyWebhookSignature } from '@/lib/paystack'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature') || ''

    if (!verifyWebhookSignature(signature, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const data = event.data
      const reference = data.reference
      const metadata = data.metadata || {}

      await connectDB()

      const orderId = metadata.orderId
      let order = null

      if (orderId) {
        order = await Order.findById(orderId)
      }

      if (!order) {
        order = await Order.findOne({ paystackReference: reference })
      }

      if (!order) {
        console.error(`Webhook: Order not found for reference ${reference}`)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, paymentStatus: 'pending' },
        { paymentStatus: 'completed', status: 'processing', paystackReference: reference },
        { new: true }
      )

      if (!updatedOrder) {
        console.error(`Webhook race condition: Order ${order._id} already processed by verify`)
        return NextResponse.json({ message: 'Already processed' }, { status: 200 })
      }

      for (const item of updatedOrder.items) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, quantity: { $gte: item.quantity } },
          { $inc: { quantity: -item.quantity } },
          { new: true }
        )

        if (!updated) {
          console.error(`Webhook: Stock insufficient for product ${item.product}`)
          continue
        }

        if (updated.quantity === 0) {
          await Product.findByIdAndUpdate(item.product, { inStock: false })
        }
      }

      const populatedOrder = await Order.findById(updatedOrder._id)
        .populate('items.product', 'name price')

      const itemDetails = (populatedOrder?.items || []).map((item: any) => ({
        name: item.product?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
      }))

      if (updatedOrder.shippingAddress?.email) {
        sendOrderConfirmationEmail(
          updatedOrder.shippingAddress.email,
          updatedOrder.shippingAddress.name || 'Customer',
          updatedOrder.orderNumber,
          updatedOrder.totalAmount,
          itemDetails,
        ).catch(err => console.error('Webhook email failed:', err))
      }
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error: any) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
