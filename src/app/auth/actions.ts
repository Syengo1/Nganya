'use server'

import { createClient } from '@/utils/supabase/server' // The file we just fixed
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// 1. Google OAuth Logic
export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // FIX: await headers()
  const headersList = await headers()
  const origin = headersList.get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

// 2. The "Smart" Username Setter (Onboarding)
export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const username = formData.get('username') as string
  
  if (!username || username.length < 3) {
    // FIX: Don't return an object, redirect to an error state or throw
    // For now, we redirect to the same page with an error query param
    redirect('/onboarding?error=invalid_username')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // A. Check if username is taken (Database check)
  // We use the Prisma logic here via Supabase or Direct Prisma call
  // For simplicity/speed, let's assume we use Prisma:
  /* const existing = await prisma.user.findFirst({ where: { username } })
   if (existing) return { error: 'Username taken' }
  */
  
  // B. Update the User Profile
  // We insert into our 'User' table (the one defined in Prisma)
  // NOT the auth.users table.
  const { error } = await supabase.from('User').insert({
    id: user.id, // Link to Auth ID
    email: user.email,
    username: username, // Save the custom username
    role: 'GUEST', // Default role
    fullName: user.user_metadata.full_name,
    avatarUrl: user.user_metadata.avatar_url
  })

  if (error) {
    // FIX: Redirect with error instead of returning object
    console.error(error)
    redirect('/onboarding?error=username_taken')
  }
  // C. Update Auth Metadata so we don't ask again
  await supabase.auth.updateUser({
    data: { username: username, onboarding_complete: true }
  })

  // D. The Grand Redirect
  redirect(`/dashboard/user/@${username}`)
}