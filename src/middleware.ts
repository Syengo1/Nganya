import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create the initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // FIX: Handle Localhost Cookie Constraints
          if (process.env.NODE_ENV === 'development') {
            options.secure = false
            options.sameSite = 'lax'
            delete options.domain
          }

          // 1. Update the Request cookies (so the Server Components see the new session)
          request.cookies.set({
            name,
            value,
            ...options,
          })

          // 2. Update the Response cookies (so the Browser saves the session)
          // We must recreate the response to pass the updated request cookies downstream
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // 3. IMPORTANT: Manually copy the new cookie to the new response
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          if (process.env.NODE_ENV === 'development') {
            options.secure = false
            options.sameSite = 'lax'
            delete options.domain
          }

          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 2. Run the Auth Check
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected Routes Logic
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const userRole = user.user_metadata?.role || 'GUEST'
    
    if (path.startsWith('/dashboard/sacco') && userRole !== 'SACCO') {
       return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }
    if (path.startsWith('/dashboard/private') && userRole !== 'PRIVATE') {
       return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }
  }

  // Redirect logged-in users away from login
  if (path === '/login' && user) {
     const username = user.user_metadata?.username
     if (username) {
        return NextResponse.redirect(new URL(`/dashboard/user/@${username}`, request.url))
     } else {
        return NextResponse.redirect(new URL('/onboarding', request.url))
     }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}