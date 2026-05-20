import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { verifyTransaction } from '@/lib/paystack'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')
    const orderId = searchParams.get('orderId')

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    const verification = await verifyTransaction(reference)

    if (verification.status !== 'success') {
      return NextResponse.json({
        success: false,
        status: verification.status,
        message: 'Payment was not successful',
      }, { status: 200 })
    }

    let order: Record<string, any> | null = null

    if (orderId) {
      order = await Order.findById(orderId)
    }

    if (!order) {
      order = await Order.findOne({ paystackReference: reference })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.paymentStatus === 'completed') {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
        },
      }, { status: 200 })
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, paymentStatus: 'pending' },
      { paymentStatus: 'completed', status: 'processing', paystackReference: reference },
      { new: true }
    )

    if (!updatedOrder) {
      console.error(`Race condition: Order ${order._id} already processed by webhook`)
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: 'processing',
          paymentStatus: 'completed',
        },
      }, { status: 200 })
    }

    for (const item of updatedOrder.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      )

      if (!updated) {
        console.error(`Stock insufficient for product ${item.product} during payment verification`)
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
      ).catch(err => console.error('Confirmation email failed:', err))
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        totalAmount: updatedOrder.totalAmount,
      },
    }, { status: 200 })
  } catch (error: any) {
    console.error('Paystack verify error:', error)
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 })
  }
}
