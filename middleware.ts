import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Extract hostname from standard host or Hostinger's proxy header
  const hostname = request.headers.get('host') || request.headers.get('x-forwarded-host') || ''

  // If the request is for the payment portal, rewrite to the /pay folder
  if (hostname.includes('pay.tajwater.ca')) {
    if (!url.pathname.startsWith('/pay')) {
      // e.g., pay.tajwater.ca/TW-A3X9 -> tajwater.ca/pay/TW-A3X9
      url.pathname = `/pay${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Return early with a plain response to see if the server stabilizes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
