import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Setting from "@/app/models/Setting";
import { connectDB } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner", "Manager"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const settings = await Setting.find({});
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner", "Manager"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { key, value } = await req.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
  }
  await connectDB();
  await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
  return NextResponse.json({ success: true });
}