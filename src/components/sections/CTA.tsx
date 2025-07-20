"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import { useContactForm, type ContactFormData } from "@/hooks/useContactForm"
import { useViewportSizing } from "@/hooks/useViewportSizing"

export function CTA() {
  const { loading, submitForm } = useContactForm()
  const viewport = useViewportSizing()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await submitForm(formData)
    if (success) {
      // Reset form on successful submission
      setFormData({ name: '', email: '', company: '', message: '' })
    }
  }

  return (
    <section 
      id="contact" 
      className={`${viewport.sectionSpacing} bg-background border-t border-border relative overflow-hidden`}
      aria-label="Contact form section"
    >
      <div className="absolute inset-0 bg-grid-foreground/[0.02] pointer-events-none" aria-hidden="true"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-3">
            <span className="bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full">
              Get Started
            </span>
          </div>
          <h2 
            id="contact-heading"
            className={`${viewport.width >= 1600 ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-bold mb-6 text-foreground px-4 sm:px-0`}
          >
            Ready to Transform Your Digital Presence?
          </h2>
          <p className={`${viewport.width >= 1600 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} mb-8 text-muted-foreground px-4 sm:px-0`}>
            Let&apos;s discuss how MIDAS can help you achieve your business goals.
            Fill out the form below and we&apos;ll get back to you shortly.
          </p>
          
          <form 
            onSubmit={handleSubmit} 
            className={`max-w-2xl mx-auto px-4 sm:px-0 ${viewport.height < 700 ? 'space-y-3' : 'space-y-4'}`}
            aria-labelledby="contact-heading"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                required
                type="text"
                id="contact-name"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Your full name (required)"
                aria-required="true"
                aria-invalid={formData.name.trim() === '' ? 'true' : 'false'}
                autoComplete="name"
              />
              <Input
                required
                type="email"
                id="contact-email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Your email address (required)"
                aria-required="true"
                aria-invalid={!formData.email.includes('@') && formData.email !== '' ? 'true' : 'false'}
                autoComplete="email"
              />
            </div>
            <div>
              <Input
                type="text"
                id="contact-company"
                name="company"
                placeholder="Company Name (Optional)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Your company name (optional)"
                autoComplete="organization"
              />
            </div>
            <div>
              <Textarea
                required
                id="contact-message"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary ${viewport.height < 700 ? 'min-h-20' : 'min-h-28'}`}
                aria-label="Your message (required)"
                aria-required="true"
                aria-invalid={formData.message.trim() === '' ? 'true' : 'false'}
                aria-describedby="message-help"
              />
              <p id="message-help" className="sr-only">
                Please describe how we can help you with your digital marketing needs
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className={`${viewport.width >= 1600 ? 'text-lg sm:text-xl px-8 py-4' : 'text-base sm:text-lg'} bg-primary text-primary-foreground hover:bg-primary/90 border-none w-full sm:w-auto min-w-44 sm:min-w-48`}
                aria-label="Send your message to MIDAS"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    <span aria-live="polite">Sending...</span>
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
} 