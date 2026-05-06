import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { Cloudinary } from "cloudinary";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import { IUser } from "@/app/models/User";

const upload = multer({
  limits: { fileSize: 10_000_000 }, // 10 MB
});

const cloudinary = new Cloudinary({
  cloudName: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectDB();

  const { user } = await (await import("@/app/lib/verifyAuth")).getSessionUserRole();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file: File | null = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      "perfume_products",
      { folder: "perfume_products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.stream);
  });

  const imageUrl = result?.secure_url;

  const { name, sku, brand, category, description, notes, fragranceNotes, longevity,
          sillage, price, discountPrice, costPrice, sizes, quantity, featured, status } =
    await req.json();

  const images = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

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