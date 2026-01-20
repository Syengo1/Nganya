import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          // THE FIX: Override secure setting on localhost
          if (process.env.NODE_ENV === 'development') {
            options.secure = false
          }

          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
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

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected Routes
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

  // Auth Routes
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