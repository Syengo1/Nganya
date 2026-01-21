import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // FIX: Aggressively handle localhost cookie issues
            if (process.env.NODE_ENV === 'development') {
              // 1. Force HTTP (not secure)
              options.secure = false
              // 2. Force SameSite=Lax (Strict often fails on redirects)
              options.sameSite = 'lax'
              // 3. Remove domain so it defaults to localhost
              delete options.domain
            }
            
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            if (process.env.NODE_ENV === 'development') {
              options.secure = false
              options.sameSite = 'lax'
              delete options.domain
            }
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}