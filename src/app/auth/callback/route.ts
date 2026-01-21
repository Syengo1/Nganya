import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation' // Ensure this import is used!

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocal = origin.includes('localhost')
      
      if (isLocal) {
        redirect(`${origin}/onboarding`)
      } else if (forwardedHost) {
        redirect(`https://${forwardedHost}/onboarding`)
      } else {
        redirect(`${origin}/onboarding`)
      }
    }
    console.error('🔥 Auth Exchange Error:', error)
  }

  redirect(`${origin}/login?error=auth_failed`)
}