import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Building2, Map } from 'lucide-react'

export default function BecomePartnerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Monetize your <span className="text-purple-500">Movement.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Join Kenya's first digital fleet network. Whether you are a massive Sacco or a private car owner, we have a dashboard for you.
          </p>
        </div>

        {/* The Three Gates */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* 1. Private Owner */}
          <div className="group relative p-6 border border-zinc-800 rounded-2xl hover:border-purple-500/50 transition-colors bg-zinc-900/50">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-purple-400">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Private Owner</h3>
            <p className="text-sm text-zinc-400 mb-6">
              For individuals renting out personal cars, vans, or nganyas.
            </p>
            <ul className="text-xs text-zinc-500 space-y-2 mb-6">
              <li>• Instant Payouts via M-Pesa</li>
              <li>• ID & Logbook Verification</li>
              <li>• Calendar Blocking</li>
            </ul>
            <Link href="/become-partner/register?type=PRIVATE">
              <Button className="w-full bg-white text-black hover:bg-zinc-200">
                Start Earning
              </Button>
            </Link>
          </div>

          {/* 2. Sacco / Fleet */}
          <div className="group relative p-6 border border-zinc-800 rounded-2xl hover:border-blue-500/50 transition-colors bg-zinc-900/50">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sacco / Fleet</h3>
            <p className="text-sm text-zinc-400 mb-6">
              For registered Saccos managing 10+ vehicles and drivers.
            </p>
            <ul className="text-xs text-zinc-500 space-y-2 mb-6">
              <li>• Fleet Management Dashboard</li>
              <li>• Route & Driver Assignment</li>
              <li>• Bulk Verification</li>
            </ul>
            <Link href="/become-partner/register?type=SACCO">
              <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-white">
                Register Sacco
              </Button>
            </Link>
          </div>

          {/* 3. Tour Company (TSV) */}
          <div className="group relative p-6 border border-zinc-800 rounded-2xl hover:border-orange-500/50 transition-colors bg-zinc-900/50">
            <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-orange-400">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tour Operator</h3>
            <p className="text-sm text-zinc-400 mb-6">
              For TSV licensed companies offering safari vans and cruisers.
            </p>
            <ul className="text-xs text-zinc-500 space-y-2 mb-6">
              <li>• Multi-day Safari Bookings</li>
              <li>• Package Management</li>
              <li>• TRA Compliance</li>
            </ul>
            <Link href="/become-partner/register?type=TSV">
              <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-white">
                Register Company
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}