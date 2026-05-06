import { NextRequest, NextResponse } from 'next/server';
import Product from '@/app/models/Product';
import { connectDB } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const category = searchParams.get('category') ?? '';
  const brand = searchParams.get('brand') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const inStock = searchParams.get('inStock') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const status = searchParams.get('status') ?? '';

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice) query.price = { $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (inStock) query.quantity = { $gt: 0 };
  if (featured) query.featured = true;
  if (status) query.status = status;

  const products = await Product.find(query).limit(100);
  return NextResponse.json(products);
}