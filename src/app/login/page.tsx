import { signInWithGoogle } from '../auth/actions'
import { Button } from '@/components/ui/button' // You'll need to install shadcn button
import { Car, UserCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      
      {/* Left: The Vibe (Visuals) */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-900 text-white relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tighter">NGANYA.</h1>
          <p className="opacity-70 mt-2">The culture is moving.</p>
        </div>
        <div className="z-10 space-y-2">
          <p className="text-lg">"The best way to experience Nairobi is in a loud, colorful Matatu. This app makes it safe and easy."</p>
        </div>
        {/* Abstract design element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full" />
      </div>

      {/* Right: The Logic (Form) */}
      <div className="flex flex-col justify-center p-8 lg:p-24">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Enter your details to access your dashboard.</p>
          </div>

          {/* Client Sign In */}
          <div className="space-y-4">
            <form action={signInWithGoogle}>
              <Button variant="outline" className="w-full h-12 text-base" type="submit">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Continue with Google
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Manual Email Form (Placeholders for now) */}
            <div className="grid gap-2">
               {/* Inputs would go here */}
            </div>
          </div>

          {/* The Supply Side Link */}
          <div className="pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">Own a Nganya or Tour Van?</p>
            <Link 
              href="/become-partner" 
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-colors border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Car className="w-4 h-4 mr-2" />
              Create Partner Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}