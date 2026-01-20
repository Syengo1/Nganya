'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid' 

export async function registerPartner(formData: FormData) {
  const supabase = await createClient()

  // 1. Auth Check: User must be logged in first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to register.' }
  }

  // 2. Extract Data
  const businessName = formData.get('businessName') as string
  const phone = formData.get('phone') as string
  const regNumber = formData.get('regNumber') as string // ID or Sacco Reg No.
  const type = formData.get('type') as 'PRIVATE' | 'SACCO' | 'TSV'
  const file = formData.get('doc') as File

  // 3. Validation
  if (!file || file.size === 0) {
    return { error: 'Document upload is required.' }
  }
  if (!businessName || !phone || !type) {
    return { error: 'All fields are required.' }
  }

  // 4. Upload to Supabase Storage (The Vault)
  // We rename the file to avoid conflicts: userID/random-id.ext
  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${uuidv4()}.${fileExt}` 

  const { error: uploadError } = await supabase.storage
    .from('private-docs')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload failed:', uploadError)
    return { error: 'Failed to upload document. Try again.' }
  }

  // 5. Database Transaction (Create VendorProfile)
  const { error: dbError } = await supabase.from('VendorProfile').insert({
    userId: user.id,
    type: type,
    businessName: businessName,
    phone: phone, // This now matches your Schema perfectly
    registrationDocUrl: filePath, 
    isVerified: 'PENDING'
  })

  if (dbError) {
    console.error('DB Error:', dbError)
    // Optional: Delete the uploaded file if DB fails to keep things clean
    return { error: 'Failed to create profile. Please try again.' }
  }

  // 6. Update User Role to VENDOR
  // We update both Auth metadata and our public User table
  await supabase.auth.updateUser({
    data: { role: 'VENDOR' }
  })
  
  await supabase.from('User').update({ role: 'VENDOR' }).eq('id', user.id)

  // 7. Success Redirect
  redirect(`/dashboard/${type.toLowerCase()}`)
}