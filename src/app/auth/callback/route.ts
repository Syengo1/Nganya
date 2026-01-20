import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // SUCCESS: Session established.
      // We use NextResponse.redirect to ensure headers are passed correctly
      const forwardedHost = request.headers.get('x-forwarded-host') // specific for proxy environments
      const isLocal = origin.includes('localhost')
      
      if (isLocal) {
        return NextResponse.redirect(`${origin}/onboarding`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/onboarding`)
      } else {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
    
    console.error('🔥 Auth Exchange Error:', error)
  }

  // Fallback if no code or error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}