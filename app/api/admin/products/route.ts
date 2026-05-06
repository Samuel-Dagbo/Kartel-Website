import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import { getSessionUserRole } from "@/app/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { user } = await getSessionUserRole();
  if (user.role !== "Owner" && user.role !== "Manager") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { user } = await getSessionUserRole();
  if (user.role !== "Owner" && user.role !== "Manager") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const {
    name,
    sku,
    brand,
    category,
    description,
    notes,
    fragranceNotes,
    longevity,
    sillage,
    price,
    discountPrice,
    costPrice,
    sizes,
    quantity,
    images,
    featured,
    status,
  } = await req.json();

  await connectDB();
  const product = await Product.create({
    name,
    sku,
    brand,
    category,
    description,
    notes,
    fragranceNotes,
    longevity,
    sillage,
    price,
    discountPrice,
    costPrice,
    sizes,
    quantity,
    images,
    featured,
    status,
  });
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user } = await getSessionUserRole();
  if (user.role !== "Owner" && user.role !== "Manager") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id, ...data } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  const { user } = await getSessionUserRole();
  if (user.role !== "Owner" && user.role !== "Manager") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }
  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}