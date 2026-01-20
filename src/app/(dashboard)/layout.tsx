import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home, User } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* 1. The Smart Sidebar (Simplified for now) */}
      <aside className="w-64 hidden md:flex flex-col border-r bg-white dark:bg-black p-4">
        <div className="h-16 flex items-center font-bold text-xl tracking-tighter px-2">
          NGANYA.
        </div>
        
        <nav className="flex-1 space-y-1 mt-4">
          <Link href={`/dashboard/user/@${user.user_metadata.username}`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-zinc-100 dark:bg-zinc-800">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/trips" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-500">
            <User className="w-4 h-4" />
            My Trips
          </Link>
        </nav>

        <div className="border-t pt-4">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 w-full rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* 2. The Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}