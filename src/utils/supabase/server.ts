import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (process.env.NODE_ENV === 'development') {
                options.secure = false
                options.sameSite = 'lax'
                delete options.domain
              }
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignored in middleware contexts
          }
        },
      },
    }
  )
}