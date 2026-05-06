import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Category from '@/app/models/Category';
import { connectDB } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !['Owner', 'Manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  await connectDB();
  const categories = await Category.find({});
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !['Owner', 'Manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { name, slug, description, parentCategory, image } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
  }
  await connectDB();
  const category = await Category.create({ name, slug, description, parentCategory, image });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !['Owner', 'Manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { _id, name, slug, description, parentCategory, image } = await req.json();
  if (!_id || !name) {
    return NextResponse.json({ error: 'Missing _id or name' }, { status: 400 });
  }
  await connectDB();
  const updated = await Category.findByIdAndUpdate(
    _id,
    { name, slug, description, parentCategory, image },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !['Owner', 'Manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  }
  await connectDB();
  await Category.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}