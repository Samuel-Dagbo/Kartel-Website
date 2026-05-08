import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const cloudinary = require('cloudinary').v2
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.upload(image, {
      folder: 'kartel-products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
      ],
    })

    return NextResponse.json({ url: result.secure_url }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}