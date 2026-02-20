import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (!isAdminRoute) return NextResponse.next()

  // Check for NextAuth session token (works for both JWT strategies)
  const token =
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('authjs.session-token')?.value

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
