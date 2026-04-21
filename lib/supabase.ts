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
    return (_supabase as unknown as Record<string | symbol, unknown>)?.[prop]
  },
})

// Server client — uses service role key, bypasses RLS. Only call inside API routes or server components.
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    console.error('Supabase server client initialized without URL or Service Role Key')
    // Return a dummy client or throw a more descriptive error
    // For now, we'll return a client that will fail gracefully on execution
    return createClient(url || '', key || '', {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
