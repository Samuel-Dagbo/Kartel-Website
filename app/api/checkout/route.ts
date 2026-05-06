import { NextRequest, NextResponse } from 'next/server';
import Order from '@/app/models/Order';
import { connectDB } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const { items, customerName, paymentMethod } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }

  const session = await Order.startSession();
  session.startTransaction();
  try {
    const newOrder = await Order.create({
      userId: user.id,
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: items.reduce((sum, i) => sum + i.subtotal, 0),
      status: 'pending',
      items,
    });

    for (const i of items) {
      const prod = await Order.populate('items', { productId: i.productId });
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  } finally {
    await session.endSession();
  }
}