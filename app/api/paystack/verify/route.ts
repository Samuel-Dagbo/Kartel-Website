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

    for (const item of order.items) {
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

    order.status = 'processing'
    order.paymentStatus = 'completed'
    order.paystackReference = reference
    await order.save()

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price')

    const itemDetails = (populatedOrder?.items || []).map((item: any) => ({
      name: item.product?.name || 'Product',
      quantity: item.quantity,
      price: item.price,
    }))

    if (order.shippingAddress?.email) {
      sendOrderConfirmationEmail(
        order.shippingAddress.email,
        order.shippingAddress.name || 'Customer',
        order.orderNumber,
        order.totalAmount,
        itemDetails,
      ).catch(err => console.error('Confirmation email failed:', err))
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
      },
    }, { status: 200 })
  } catch (error: any) {
    console.error('Paystack verify error:', error)
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 })
  }
}
