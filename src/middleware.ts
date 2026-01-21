import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Create the response ONCE.
  // We will modify this single object throughout the function.
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // A. Update Request cookies
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          // B. Update Response cookies
          // 🛑 CRITICAL FIX: We do NOT run NextResponse.next() here. 
          // We use the 'response' variable created at the top.
          cookiesToSet.forEach(({ name, value, options }) => {
            if (process.env.NODE_ENV === 'development') {
              options.secure = false
              options.sameSite = 'lax'
              delete options.domain
            }
            
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )

  // 2. Auth Check
  // Now that cookies are being saved correctly, this will return the User.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 3. Protected Routes
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Role-based checks
    const userRole = user.user_metadata?.role || 'GUEST'
    if (path.startsWith('/dashboard/sacco') && userRole !== 'SACCO') {
       return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }
    if (path.startsWith('/dashboard/private') && userRole !== 'PRIVATE') {
       return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }
  }

  // 4. Onboarding Redirection
  // If user is logged in, handle their onboarding status
  if (user && path === '/login') {
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