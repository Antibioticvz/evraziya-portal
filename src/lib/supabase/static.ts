import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for public data queries (no cookies required).
 * Use this in marketing/static pages that don't need user authentication.
 * For authenticated routes (dashboard), use the server client from ./server.ts.
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
