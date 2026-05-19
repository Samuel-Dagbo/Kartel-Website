import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ set' : '❌ missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ set' : '❌ missing',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ set' : '❌ missing',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ set' : '❌ missing',
    MONGODB_URI: process.env.MONGODB_URI ? '✅ set' : '❌ missing',
    MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC ? '✅ set' : '❌ missing',
    MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE ? '✅ set' : '❌ missing',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ set' : '❌ missing',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  }

  const allSet = Object.values(envCheck).every(v => v === '✅ set' || v.startsWith('✅'))

  return NextResponse.json({
    status: allSet ? '✅ All environment variables are set' : '❌ Some variables are missing',
    variables: envCheck,
    tip: 'Go to https://vercel.com/ → Settings → Environment Variables to add missing ones',
  })
}
