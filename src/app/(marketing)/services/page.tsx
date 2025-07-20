import Link from "next/link"
import { services } from "@/lib/data/services"
import { LucideIcon } from "lucide-react"
import { getIconComponent } from "@/lib/utils/icons"
import { Layout } from "@/components/layout/Layout"
import { StructuredData } from "@/components/shared/seo/StructuredData"
import { 
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData
} from "@/lib/utils/seo"
import { Metadata } from 'next'

// Generate metadata for services page
export const metadata: Metadata = {
  title: 'Our Services - MIDAS Digital Marketing & Technology Agency',
  description: 'Explore MIDAS comprehensive digital marketing and technology services including automation, branding, video production, IT systems, and performance marketing.',
  keywords: [
    'digital marketing services',
    'technology solutions',
    'digital automation',
    'branding services',
    'video production',
    'IT systems',
    'performance marketing',
    'KOL endorsement',
    'marketing strategy'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Our Services - MIDAS Agency',
    description: 'Comprehensive digital marketing and technology services to transform your business.',
    type: 'website',
    url: 'https://midas-agency.com/services',
  },
  alternates: {
    canonical: 'https://midas-agency.com/services',
  },
}

export default function ServicesPage() {
  // Generate structured data for services page
  const organizationData = generateOrganizationStructuredData()
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://midas-agency.com' },
    { name: 'Services', url: 'https://midas-agency.com/services' }
  ])

  // Generate service catalog structured data
  const serviceCatalogData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MIDAS Agency Services',
    description: 'Comprehensive digital marketing and technology services',
    itemListElement: Object.entries(services).map(([slug, service], index) => ({
      '@type': 'Service',
      position: index + 1,
      name: service.title,
      description: service.description,
      url: `https://midas-agency.com/services/${slug}`,
      provider: {
        '@type': 'Organization',
        name: 'MIDAS Agency'
      }
    }))
  }

  return (
    <Layout>
      <StructuredData data={[organizationData, breadcrumbData, serviceCatalogData]} />
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Explore our comprehensive range of digital marketing and technology services
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(services).map(([slug, service]) => {
            const Icon = getIconComponent(service.iconName);
            return (
              <Link href={`/services/${slug}`} key={slug} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                  {Icon && (
                    <div className="mb-4 text-primary">
                      <Icon size={24} />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {service.description}
                  </p>
                  <span className="text-primary">Learn more →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
} 