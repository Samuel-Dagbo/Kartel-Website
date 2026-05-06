import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Order from "@/app/models/Order";
import { connectDB } from "@/app/lib/db";
import { Roles } from "@/app/constants";

export async function GET(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner", "Manager"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const { search, status } = await req.json();
  const query: any = {};
  if (search) query["$or"] = [
    { "items.productId": { $regex: search, $options: "i" } },
    { "orderNumber": { $regex: search, $options: "i" } },
  ];
  if (status) query.status = status;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const { id, status: newStatus } = await req.json();
  if (!id || !newStatus) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }
  const updated = await Order.findByIdAndUpdate(id, { status: newStatus }, { new: true });
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}