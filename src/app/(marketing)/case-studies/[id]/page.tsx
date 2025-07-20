import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CaseStudy } from "@/components/shared/work/CaseStudy"
import { Layout } from "@/components/layout/Layout"
import { StructuredData } from "@/components/shared/seo/StructuredData"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  generateCaseStudyMetadata,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData
} from "@/lib/utils/seo"
import { caseStudies, getCaseStudyById, getAllCaseStudyIds } from "@/lib/data/case-studies"
import type { CaseStudy as CaseStudyType } from "@/lib/types/work"

// Loading skeleton for case study
function CaseStudySkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Skeleton */}
      <Skeleton className="h-[50vh] w-full rounded-xl" />
      
      <div className="container px-4">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Background Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Challenge Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-40" />
            <div className="rounded-lg border p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          
          {/* More sections */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-6">
              <Skeleton className="h-8 w-56" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Generate static params for case studies - optimized for performance
export function generateStaticParams() {
  return getAllCaseStudyIds().map((id) => ({
    id,
  }))
}

// Enhanced metadata generation for case study pages
export async function generateMetadata({ params }: { params: { id: string } }) {
  const caseStudy = getCaseStudyById(params.id)
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found - MIDAS Agency',
      description: 'The requested case study could not be found.',
      robots: { index: false, follow: false }
    }
  }
  
  return {
    ...generateCaseStudyMetadata(params.id, caseStudy.title, caseStudy.description),
    openGraph: {
      title: `${caseStudy.title} - MIDAS Agency Case Study`,
      description: caseStudy.description,
      type: 'article',
      url: `https://midas-agency.com/case-studies/${params.id}`,
      images: [{
        url: caseStudy.thumbnail,
        width: 1200,
        height: 630,
        alt: caseStudy.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.title} - MIDAS Agency`,
      description: caseStudy.description,
      images: [caseStudy.thumbnail]
    }
  }
}

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const caseStudy = getCaseStudyById(params.id)

  if (!caseStudy) {
    notFound()
  }

  // Enhanced structured data for this case study
  const organizationData = generateOrganizationStructuredData()
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://midas-agency.com' },
    { name: 'Case Studies', url: 'https://midas-agency.com/case-studies' },
    { name: caseStudy.title, url: `https://midas-agency.com/case-studies/${params.id}` }
  ])

  // Generate Article structured data
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.description,
    image: caseStudy.thumbnail,
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: '2024-12-01T00:00:00Z',
    author: {
      '@type': 'Organization',
      name: 'MIDAS Agency',
      url: 'https://midas-agency.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MIDAS Agency',
      logo: {
        '@type': 'ImageObject',
        url: 'https://midas-agency.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://midas-agency.com/case-studies/${params.id}`
    }
  }

  return (
    <Layout>
      <StructuredData data={[organizationData, breadcrumbData, articleData]} />
      
      <Suspense fallback={<CaseStudySkeleton />}>
        <CaseStudy caseStudy={caseStudy} />
      </Suspense>
    </Layout>
  )
} 