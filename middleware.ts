import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  // Extract hostname prioritizing proxy headers
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  // Subdomain rewrite: pay.tajwater.ca/TW-A3X9 -> tajwater.ca/pay/TW-A3X9
  if (hostname.includes('pay.tajwater.ca')) {
    if (!url.pathname.startsWith('/pay')) {
      url.pathname = `/pay${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Auth protection: check for Supabase session cookie
  const hasSession =
    request.cookies.has('sb-access-token') ||
    request.cookies.has('sb-refresh-token') ||
    [...request.cookies.getAll()].some((c) => c.name.includes('-auth-token'))

  if (pathname.startsWith('/dashboard') && !hasSession) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
