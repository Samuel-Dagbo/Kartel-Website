import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const uri = process.env.MONGODB_URI || ''
  const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')

  // Test MongoDB connection
  let dbStatus = 'not tested'
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
    await mongoose.connection.db?.admin().ping()
    dbStatus = '✅ connected'
    await mongoose.disconnect()
  } catch (e: any) {
    dbStatus = `❌ failed: ${e.message?.slice(0, 100) || 'unknown error'}`
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    mongodb: {
      uri: maskedUri,
      status: dbStatus,
    },
    auth: {
      nextauth_url: process.env.NEXTAUTH_URL,
      nextauth_secret_set: !!process.env.NEXTAUTH_SECRET,
      google_client_id_set: !!process.env.GOOGLE_CLIENT_ID,
      google_client_secret_set: !!process.env.GOOGLE_CLIENT_SECRET,
      expected_callback_url: `${process.env.NEXTAUTH_URL || 'NEXTAUTH_URL_NOT_SET'}/api/auth/callback/google`,
      request_url: req.url,
    },
    fix: {
      mongo: 'Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0',
      google: 'Go to https://console.cloud.google.com/apis/credentials → Add redirect URI',
    },
  })
}
