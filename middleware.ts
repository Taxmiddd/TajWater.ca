import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Initialize response
  let response = NextResponse.next({
    request,
  })

  try {
    // 1. Initialize Supabase SSR Client
    // We use a try-catch and check for env vars to prevent the entire site from crashing if they are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Middleware: Supabase URL or Anon Key is missing.')
      return response
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
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
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user

      if (error || !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }

      // 3. Verify Admin Status
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', user.email)
        .single()

      if (!adminRow) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
  } catch (e) {
    console.error('Middleware error:', e)
    // Fallback to continuing the request instead of crashing with 503
    return response
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
