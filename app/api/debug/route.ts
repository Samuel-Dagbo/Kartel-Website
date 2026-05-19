import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const uri = process.env.MONGODB_URI || ''
  const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
  const nextauthUrl = process.env.NEXTAUTH_URL || ''

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

  const cleanUrl = nextauthUrl.replace(/\/+$/, '')
  const callbackUrl = `${cleanUrl}/api/auth/callback/google`

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    nextauth_url: {
      raw: nextauthUrl,
      has_trailing_slash: nextauthUrl.endsWith('/'),
      clean: cleanUrl,
    },
    mongodb: { status: dbStatus },
    auth: {
      google_client_id_set: !!process.env.GOOGLE_CLIENT_ID,
      google_client_secret_set: !!process.env.GOOGLE_CLIENT_SECRET,
      nextauth_secret_set: !!process.env.NEXTAUTH_SECRET,
      callback_url_used: callbackUrl,
    },
    actions: {
      fix_trailing_slash: 'Remove the trailing slash from NEXTAUTH_URL in Vercel env vars',
      google_console: `Add this exact URL to Google Cloud Console → Authorized redirect URIs: ${callbackUrl}`,
    },
  })
}
