import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { completeOnboarding } from '../auth/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Security Check: No user? Go login.
  if (!user) redirect('/login')

  // Smart Check: Already has username? Go to dash.
  // We check the Metadata we set in the action
  if (user.user_metadata?.username) {
    redirect(`/dashboard/user/@${user.user_metadata.username}`)
  }

  // If we are here, they need to pick a username
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">One last thing.</h1>
          <p className="text-muted-foreground">
            Pick a unique username to identify yourself in the Nganya verse.
          </p>
        </div>

        <form action={completeOnboarding} className="space-y-4 text-left">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
              <Input 
                name="username" 
                id="username" 
                placeholder="antonysyengo" 
                className="pl-8" 
                required 
                minLength={3}
              />
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              This will be your public profile: nganya.com/user/@antonysyengo
            </p>
          </div>

          <Button type="submit" className="w-full">
            Complete Setup
          </Button>
        </form>

      </div>
    </div>
  )
}