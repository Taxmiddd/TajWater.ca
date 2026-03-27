import { createBrowserClient } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy browser client — only instantiated on first access, not at module load time.
// Uses @supabase/ssr so the session is stored in cookies (not localStorage),
// allowing proxy.ts to read it server-side and keep the user logged in.
let _supabase: SupabaseClient | undefined

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (typeof window === 'undefined') return undefined
    if (!_supabase) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!url || !key) return undefined
      _supabase = createBrowserClient(url, key)
    }
    return (_supabase as any)?.[prop]
  },
})

// Server client — uses service role key, bypasses RLS. Only call inside API routes.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}
