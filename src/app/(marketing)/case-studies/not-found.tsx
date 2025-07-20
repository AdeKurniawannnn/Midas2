import Link from 'next/link'
import Image from 'next/image'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, FileX, Home } from 'lucide-react'
import { caseStudies } from '@/lib/data/case-studies'

export default function CaseStudyNotFound() {
  // Get random case studies for suggestions
  const suggestedCases = caseStudies.slice(0, 3)

  return (
    <Layout>
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-4">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The case study you&apos;re looking for doesn&apos;t exist or may have been moved. 
              Don&apos;t worry, we have plenty of other success stories to explore.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="gap-2">
              <Link href="/case-studies">
                <ArrowLeft className="h-4 w-4" /> All Case Studies
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" /> Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/contact">
                <Search className="h-4 w-4" /> Get Help
              </Link>
            </Button>
          </div>

          {/* Suggested Case Studies */}
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-8 text-center">You Might Be Interested In</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {suggestedCases.map((study) => {
                const displayCategory = study.category
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')

                return (
                  <Card key={study.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={study.thumbnail}
                        alt={study.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-xs bg-primary/80 px-2 py-1 rounded mb-2">
                          {displayCategory}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {study.description}
                      </p>
                      <Button asChild variant="ghost" size="sm" className="gap-2 p-0">
                        <Link href={`/case-studies/${study.id}`}>
                          Read Case Study →
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 