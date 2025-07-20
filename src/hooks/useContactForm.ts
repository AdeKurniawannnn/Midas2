import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
}

export interface ContactSubmissionData {
  Nama_Lengkap: string
  Email: string
  Nama_Perusahaan?: string | null
  Pesan: string
}

export function useContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const validateForm = (data: ContactFormData): boolean => {
    if (!data.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter your full name."
      })
      return false
    }

    if (!data.email.trim()) {
      toast({
        variant: "destructive", 
        title: "Validation Error",
        description: "Please enter your email address."
      })
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: "Please enter a valid email address."
      })
      return false
    }

    if (!data.message.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter your message."
      })
      return false
    }

    return true
  }

  const submitForm = async (formData: ContactFormData): Promise<boolean> => {
    if (!validateForm(formData)) {
      return false
    }

    setLoading(true)

    try {
      // Transform data to match backend schema
      const contactData: ContactSubmissionData = {
        Nama_Lengkap: formData.name,
        Email: formData.email,
        Nama_Perusahaan: formData.company || null,
        Pesan: formData.message
      }

      // Use environment variable for API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL || 'https://supabasekong-joc0wg4wkwo8o48swgswgo0g.217.15.164.63.sslip.io/rest/v1/Contact'
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0ODk0MDEyMCwiZXhwIjo0OTA0NjEzNzIwLCJyb2xlIjoiYW5vbiJ9.s0n5WLXlYRMK-Zk09DAgazMbdHzqIQAqLTHrid068mU'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(contactData)
      })

      if (response.status === 201) {
        toast({
          title: "Success!",
          description: "Your message has been sent! We'll get back to you soon."
        })
        return true
      }

      // Handle non-201 responses
      const responseData = await response.json()
      throw new Error(responseData.message || 'Failed to send message. Please try again.')
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message || 'Sorry, something went wrong. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    submitForm
  }
}