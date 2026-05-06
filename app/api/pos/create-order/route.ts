import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/Product";
import Order from "@/app/models/Order";
import { connectDB } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const { items, customerName, paymentMethod, total } = body;

  if (!items || items.length === 0 || !total) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await Product.startSession();
  session.startTransaction();

  try {
    // Create order
    const newOrder = new Order({
      userId: "placeholder_user_id", // Should be replaced with actual auth userId
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: total,
      status: "confirmed",
      items: items.map((i: any) => ({
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.quantity * i.price,
      })),
    });
    await newOrder.save();

    // Deduct inventory
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.quantity < i.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      product.quantity -= i.quantity;
      await product.save();
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  } finally {
    await session.endSession();
  }
}