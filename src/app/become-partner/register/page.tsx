'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { registerPartner } from '../actions' // Import the Server Action

export default function PartnerRegisterPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'PRIVATE'
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Dynamic labels based on what they clicked
  const labels = {
    PRIVATE: {
      title: "Private Partner Registration",
      idLabel: "National ID Number",
      docLabel: "Upload ID Copy (Front/Back)",
      businessNameLabel: "Display Name (e.g. John's Rides)"
    },
    SACCO: {
      title: "Sacco Registration",
      idLabel: "Sacco Registration Number",
      docLabel: "Upload Sacco Certificate",
      businessNameLabel: "Sacco Name (e.g. Super Metro)"
    },
    TSV: {
      title: "Tour Operator Registration",
      idLabel: "TRA License Number",
      docLabel: "Upload TRA License",
      businessNameLabel: "Company Name (e.g. Bonfire Adventures)"
    }
  }[type as 'PRIVATE' | 'SACCO' | 'TSV']

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    const formData = new FormData(event.currentTarget)
    // We must manually append the 'type' because it comes from the URL, not an input field
    formData.append('type', type)

    // Call the Server Action
    const result = await registerPartner(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      setIsLoading(false)
    }
    // If successful, the action redirects us automatically.
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border rounded-xl p-8 shadow-sm">
        
        <div className="mb-8">
            <h1 className="text-2xl font-bold">{labels?.title}</h1>
            <p className="text-muted-foreground text-sm mt-2">
                We just need a few details to verify your eligibility.
            </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">{labels?.businessNameLabel}</label>
                <Input name="businessName" required placeholder="Enter name" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Official Phone Number (M-Pesa)</label>
                <Input name="phone" type="tel" required placeholder="07..." />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{labels?.idLabel}</label>
                <Input name="regNumber" required />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{labels?.docLabel}</label>
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition cursor-pointer relative">
                    <span className="text-xs text-muted-foreground pointer-events-none">Click to upload Document (PDF/Image)</span>
                    <Input 
                      type="file" 
                      name="doc" 
                      required 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Submit Application"}
            </Button>
        </form>

      </div>
    </div>
  )
}