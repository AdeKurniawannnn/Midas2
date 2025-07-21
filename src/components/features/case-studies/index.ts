// Case Studies Feature - Central Export Hub
// This file provides a single entry point for all case study related components and utilities

// Main components
export { CaseStudy, CaseStudyPreview } from '@/components/shared/work/CaseStudy'

// Data layer
import { 
  caseStudies, 
  getCaseStudyById, 
  getCaseStudiesByCategory, 
  getAllCaseStudyIds,
  automationCaseStudies 
} from '@/lib/data/case-studies'

export { 
  caseStudies, 
  getCaseStudyById, 
  getCaseStudiesByCategory, 
  getAllCaseStudyIds,
  automationCaseStudies 
}

// Types
export type { CaseStudy as CaseStudyType, Project } from '@/lib/types/work'

// SEO utilities
export {
  generateCaseStudyMetadata,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData
} from '@/lib/utils/seo'

// Accessibility utilities
export {
  generateAriaLabels,
  imageAccessibility,
  motionPreferences,
  touchAccessibility
} from '@/lib/utils/accessibility'

// Constants for case studies
export const CASE_STUDY_CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: 9,
  ITEMS_PER_ROW: 3,
  
  // Image settings
  THUMBNAIL_SIZES: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  HERO_SIZES: '100vw',
  GALLERY_SIZES: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  
  // Animation settings
  TRANSITION_DURATION: 300,
  HOVER_SCALE: 1.05,
  
  // Accessibility
  MIN_TOUCH_TARGET: 44, // pixels
  FOCUS_RING_WIDTH: 2,
  
  // SEO
  META_DESCRIPTION_LENGTH: 160,
  TITLE_LENGTH: 60,
  
  // Performance
  LAZY_LOAD_THRESHOLD: 3, // Load first 3 images eagerly
  PREFETCH_THRESHOLD: 6, // Prefetch next 6 cases on hover
} as const

// Helper functions for case studies
export const caseStudyHelpers = {
  // Format category for display
  formatCategory: (category: string): string => 
    category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
  
  // Get category color
  getCategoryColor: (category: string): string => {
    const colors: Record<string, string> = {
      'digital-automation': 'bg-blue-500',
      'it-systems': 'bg-green-500',
      'video-production': 'bg-purple-500',
      'branding': 'bg-pink-500',
      'marketing-strategy': 'bg-orange-500',
      'kol-endorsement': 'bg-indigo-500',
      'performance-marketing': 'bg-red-500'
    }
    return colors[category] || 'bg-gray-500'
  },
  
  // Calculate reading time
  calculateReadingTime: (content: string): number => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    return Math.ceil(words / wordsPerMinute)
  },
  
  // Generate social sharing URLs
  generateSocialUrls: (caseStudy: { id: string; title: string; description: string }) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://midas-agency.com'
    const url = `${baseUrl}/case-studies/${caseStudy.id}`
    const text = `Check out this success story: ${caseStudy.title}`
    
    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(caseStudy.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    }
  },
  
  // Validate case study data
  validateCaseStudy: (caseStudy: any): boolean => {
    const requiredFields = ['id', 'title', 'category', 'description', 'results']
    return requiredFields.every(field => caseStudy[field] != null)
  },
  
  // Search case studies
  searchCaseStudies: (query: string, studies?: any[]) => {
    const studiesToSearch = studies || caseStudies
    const searchTerms = query.toLowerCase().split(' ')
    return studiesToSearch.filter((study: any) => {
      const searchableText = `${study.title} ${study.description} ${study.category} ${study.clientName || ''}`.toLowerCase()
      return searchTerms.every(term => searchableText.includes(term))
    })
  },
  
  // Sort case studies
  sortCaseStudies: (studies?: any[], sortBy: 'title' | 'category' | 'client' = 'title') => {
    const studiesToSort = studies || caseStudies
    return [...studiesToSort].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'client':
          return (a.clientName || '').localeCompare(b.clientName || '')
        default:
          return 0
      }
    })
  }
}

// Performance utilities
export const caseStudyPerformance = {
  // Preload critical case study images
  preloadCriticalImages: (caseStudies: any[], count = 3) => {
    if (typeof window === 'undefined') return
    
    caseStudies.slice(0, count).forEach(study => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = study.thumbnail
      document.head.appendChild(link)
    })
  },
  
  // Lazy load observer for images
  createImageObserver: (callback: (entry: IntersectionObserverEntry) => void) => {
    if (typeof window === 'undefined') return null
    
    return new IntersectionObserver(
      (entries) => entries.forEach(callback),
      { rootMargin: '50px 0px', threshold: 0.1 }
    )
  },
  
  // Optimize image loading based on connection
  getImageQuality: (): 'high' | 'medium' | 'low' => {
    if (typeof navigator === 'undefined') return 'high'
    
    // @ts-ignore - experimental API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (!connection) return 'high'
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 'low'
    } else if (connection.effectiveType === '3g') {
      return 'medium'
    }
    
    return 'high'
  }
}

// Analytics helpers
export const caseStudyAnalytics = {
  // Track case study view
  trackView: (caseStudyId: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'case_study_view', {
        case_study_id: caseStudyId,
        event_category: 'Case Studies',
        event_label: caseStudyId
      })
    }
  },
  
  // Track case study interaction
  trackInteraction: (caseStudyId: string, action: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'case_study_interaction', {
        case_study_id: caseStudyId,
        action: action,
        event_category: 'Case Studies'
      })
    }
  },
  
  // Track filter usage
  trackFilter: (category: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'case_study_filter', {
        filter_category: category,
        event_category: 'Case Studies'
      })
    }
  }
}

// Error boundaries and fallbacks
export const caseStudyErrorHandling = {
  // Fallback case study data
  getFallbackData: () => ({
    id: 'fallback',
    title: 'Case Study Unavailable',
    category: 'general' as const,
    description: 'This case study is temporarily unavailable. Please try again later.',
    thumbnail: '/images/fallback-case-study.jpg',
    images: [],
    background: '',
    challenge: '',
    objectives: [],
    approach: '',
    process: [],
    deliverables: [],
    results: [],
    clientName: 'Confidential',
    imageId: 'fallback'
  }),
  
  // Error message templates
  getErrorMessage: (type: 'not-found' | 'loading' | 'network' | 'generic') => {
    const messages = {
      'not-found': 'The requested case study could not be found.',
      'loading': 'Loading case study information...',
      'network': 'Unable to load case study. Please check your connection.',
      'generic': 'An error occurred while loading the case study.'
    }
    return messages[type] || messages.generic
  }
}

// Default export with main utilities
const caseStudyFeature = {
  config: CASE_STUDY_CONFIG,
  helpers: caseStudyHelpers,
  performance: caseStudyPerformance,
  analytics: caseStudyAnalytics,
  errorHandling: caseStudyErrorHandling
}

export default caseStudyFeature