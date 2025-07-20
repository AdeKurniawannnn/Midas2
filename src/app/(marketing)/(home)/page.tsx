import { Layout } from "@/components/layout/Layout"
import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Portfolio } from "@/components/sections/Portfolio"
import { Testimonials } from "@/components/sections/Testimonials"
import { CTA } from "@/components/sections/CTA"
import { ParallaxSection } from "@/components/sections/ParallaxSection"
import { FeaturesTab } from "@/components/sections/FeaturesTab"
import { ClientShowcase } from "@/components/sections/ClientShowcase"
import { StructuredData } from "@/components/shared/seo/StructuredData"
import { ErrorBoundary } from "@/components/sections/ErrorBoundary"
import { 
  generateHomeMetadata,
  generateOrganizationStructuredData,
  generateReviewStructuredData,
  generateFAQStructuredData
} from "@/lib/utils/seo"

// Force dynamic rendering untuk mengatasi masalah environment variables
export const dynamic = 'force-dynamic'

// Generate metadata for SEO
export async function generateMetadata() {
  return generateHomeMetadata()
}

export default function Home() {
  // Generate structured data for the home page
  const organizationData = generateOrganizationStructuredData()
  const reviewData = generateReviewStructuredData()
  const faqData = generateFAQStructuredData()

  return (
    <Layout>
      <StructuredData data={[organizationData, reviewData, faqData]} />
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <ClientShowcase />
      </ErrorBoundary>
      <ErrorBoundary>
        <Services />
      </ErrorBoundary>
      <ErrorBoundary>
        <ParallaxSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <FeaturesTab />
      </ErrorBoundary>
      <ErrorBoundary>
        <Portfolio />
      </ErrorBoundary>
      <ErrorBoundary>
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary>
        <CTA />
      </ErrorBoundary>
    </Layout>
  )
}
