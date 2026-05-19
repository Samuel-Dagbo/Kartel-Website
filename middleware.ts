import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow public routes
  const publicRoutes = ['/', '/login', '/register', '/shop', '/about', '/contact', '/faqs', '/forgot-password', '/reset-password', '/size-guide', '/track-order', '/shipping', '/wishlist']
  if (publicRoutes.some(r => path === r || path.startsWith(r + '/'))) {
    return NextResponse.next()
  }

  // Allow product pages
  if (path.startsWith('/product/')) {
    return NextResponse.next()
  }

  // Allow API auth routes
  if (path.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Allow public API routes
  if (path.startsWith('/api/products') || path.startsWith('/api/test-email') || path.startsWith('/api/upload')) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Admin routes - require admin role
  if (path.startsWith('/admin')) {
    if (token?.role !== 'admin') {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Customer & checkout routes - require authentication
  if (path.startsWith('/customer') || path.startsWith('/checkout') || path.startsWith('/api/orders')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/checkout/:path*', '/api/orders/:path*', '/api/admin/:path*'],
}
