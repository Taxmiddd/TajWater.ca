import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Perform Auth Check for Admin routes
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Not logged in -> Redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      // Pass the current path as a redirect parameter if needed (optional)
      return NextResponse.redirect(url)
    }

    // 3. Verify Admin Status (check admin_users table)
    // We use a regular query here. If we need to bypass RLS, we'd need service role,
    // but usually admin_users is readable by authenticated users or specifically protected.
    // For middleware, we should use a client that can verify role.
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (!adminRow) {
      // User is logged in but NOT an admin -> Redirect to login or forbidden
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return response
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
