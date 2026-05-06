import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Setting from "@/app/models/Setting";

export async function GET(req: NextRequest) {
  await connectDB();
  const settings = await Setting.find({});
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { key, value } = await req.json();
  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "Missing key or value" },
      { status: 400 }
    );
  }
  await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
  return NextResponse.json({ success: true });
}