import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner", "Manager"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const lowStock = await Product.find({ quantity: { $lte: 5 } }).select("name sku quantity images");
  return NextResponse.json(lowStock);
}