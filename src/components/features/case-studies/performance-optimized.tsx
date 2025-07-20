'use client'

// Performance-optimized case studies components with lazy loading and memoization
import React, { 
  useState, 
  useCallback, 
  useMemo, 
  memo, 
  lazy, 
  Suspense,
  useRef,
  useEffect
} from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Heart, 
  Share2, 
  Eye,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useFavorites, useViewportAnimation, usePerformanceMetrics } from './hooks'

// Lazy load heavy components
const AdvancedInteractiveCard = lazy(() => 
  import('./touch-interactive-elements').then(module => ({
    default: module.TouchInteractiveCaseCard
  }))
)

const EnhancedGrid = lazy(() => 
  import('./enhanced-grid-fixed').then(module => ({
    default: module.EnhancedCaseStudiesGrid
  }))
)

// Performance monitoring wrapper
const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const metrics = usePerformanceMetrics()
  
  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics)
    }
  }, [metrics])
  
  return <>{children}</>
}

// Optimized image component with progressive loading
const OptimizedImage = memo<{
  src: string
  alt: string
  className?: string
  priority?: boolean
  onLoad?: () => void
}>(({ src, alt, className = '', priority = false, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(imgRef, { once: true, margin: "50px" })
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])
  
  const handleError = useCallback(() => {
    setIsError(true)
  }, [])
  
  // Only load image when in viewport or priority
  const shouldLoad = priority || isInView
  
  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad && (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${src})` }}
            role="img"
            aria-label={alt}
            onLoad={handleLoad}
            onError={handleError}
          />
          {!isLoaded && !isError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          {isError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Failed to load</span>
            </div>
          )}
        </>
      )}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-muted" />
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

// Virtualized case study card with performance optimizations
const VirtualizedCaseCard = memo<{
  caseStudy: any
  index: number
  isVisible: boolean
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onView?: (id: string) => void
}>(({ caseStudy, index, isVisible, onFavorite, onShare, onView }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "100px" })
  
  // Memoized handlers to prevent re-renders
  const handleFavorite = useCallback(() => {
    toggleFavorite(caseStudy.id)
    onFavorite?.(caseStudy.id)
  }, [caseStudy.id, toggleFavorite, onFavorite])
  
  const handleShare = useCallback(() => {
    onShare?.(caseStudy.id)
  }, [caseStudy.id, onShare])
  
  const handleView = useCallback(() => {
    onView?.(caseStudy.id)
  }, [caseStudy.id, onView])
  
  // Memoized category formatting
  const displayCategory = useMemo(() => 
    caseStudy.category
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    [caseStudy.category]
  )
  
  // Memoized results display
  const displayResults = useMemo(() => 
    caseStudy.results.slice(0, 2),
    [caseStudy.results]
  )
  
  // Don't render if not visible and not in view
  if (!isVisible && !isInView) {
    return (
      <div ref={cardRef} className="h-96">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }
  
  return (
    <div ref={cardRef}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-60 w-full overflow-hidden">
          <OptimizedImage
            src={caseStudy.thumbnail}
            alt={caseStudy.title}
            className="w-full h-full"
            priority={index < 3}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <Badge className="absolute left-4 top-4 bg-primary/90 backdrop-blur-sm">
            {displayCategory}
          </Badge>
          
          {/* Optimized action buttons - only render when hovered */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(caseStudy.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <CardContent className="p-6">
          <h3 
            className="mb-2 text-xl font-bold group-hover:text-primary transition-colors line-clamp-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {caseStudy.title}
          </h3>
          <p className="mb-4 text-muted-foreground line-clamp-2">
            {caseStudy.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              {displayResults.map((result: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-primary">{result.value}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{result.metric}</div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2 w-full group-hover:bg-primary group-hover:text-white transition-all"
            onClick={handleView}
          >
            View Case Study <Eye className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
})

VirtualizedCaseCard.displayName = 'VirtualizedCaseCard'

// Infinite scroll container with performance optimizations
const InfiniteScrollContainer = memo<{
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  hasMore: boolean
  onLoadMore: () => void
  className?: string
}>(({ items, renderItem, hasMore, onLoadMore, className = '' }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef, { margin: "100px" })
  const [isLoading, setIsLoading] = useState(false)
  
  // Auto-load more when sentinel comes into view
  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      setIsLoading(true)
      onLoadMore()
      // Simulate loading delay
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [isInView, hasMore, isLoading, onLoadMore])
  
  return (
    <div className={className}>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.id || index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {/* Load more sentinel */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

InfiniteScrollContainer.displayName = 'InfiniteScrollContainer'

// Optimized case studies grid with virtual scrolling
const PerformanceOptimizedGrid: React.FC<{
  caseStudies: any[]
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onView?: (id: string) => void
}> = ({ caseStudies, onFavorite, onShare, onView }) => {
  const [displayedItems, setDisplayedItems] = useState(() => caseStudies.slice(0, 9))
  const [hasMore, setHasMore] = useState(caseStudies.length > 9)
  
  const loadMore = useCallback(() => {
    const currentLength = displayedItems.length
    const nextItems = caseStudies.slice(0, currentLength + 6)
    setDisplayedItems(nextItems)
    setHasMore(nextItems.length < caseStudies.length)
  }, [caseStudies, displayedItems.length])
  
  const renderItem = useCallback((item: any, index: number) => (
    <VirtualizedCaseCard
      caseStudy={item}
      index={index}
      isVisible={index < 9} // Only first 9 are immediately visible
      onFavorite={onFavorite}
      onShare={onShare}
      onView={onView}
    />
  ), [onFavorite, onShare, onView])
  
  return (
    <PerformanceMonitor>
      <InfiniteScrollContainer
        items={displayedItems}
        renderItem={renderItem}
        hasMore={hasMore}
        onLoadMore={loadMore}
        className="space-y-8"
      />
    </PerformanceMonitor>
  )
}

// Bundle splitting for different view modes
const LazyGridView = lazy(() => 
  Promise.resolve({ default: PerformanceOptimizedGrid })
)

const LazyListView = lazy(() => 
  import('./enhanced-grid-fixed').then(module => ({
    default: memo(function LazyListView(props: any) {
      return <module.default {...props} initialView="list" />
    })
  }))
)

// Main performance-optimized component
const PerformanceOptimizedCaseStudies: React.FC<{
  caseStudies: any[]
  initialView?: 'grid' | 'list'
  enableLazyLoading?: boolean
}> = ({ 
  caseStudies, 
  initialView = 'grid',
  enableLazyLoading = true 
}) => {
  const [viewMode, setViewMode] = useState(initialView)
  
  // Memoized handlers
  const handleFavorite = useCallback((id: string) => {
    console.log('Favorited:', id)
  }, [])
  
  const handleShare = useCallback((id: string) => {
    console.log('Shared:', id)
  }, [])
  
  const handleView = useCallback((id: string) => {
    console.log('Viewed:', id)
  }, [])
  
  // Loading fallback component
  const LoadingFallback = memo(function LoadingFallback() {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  })
  
  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
      </div>
      
      {/* Conditional rendering with lazy loading */}
      {enableLazyLoading ? (
        <Suspense fallback={<LoadingFallback />}>
          {viewMode === 'grid' ? (
            <LazyGridView
              caseStudies={caseStudies}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onView={handleView}
            />
          ) : (
            <LazyListView
              caseStudies={caseStudies}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onView={handleView}
            />
          )}
        </Suspense>
      ) : (
        <PerformanceOptimizedGrid
          caseStudies={caseStudies}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onView={handleView}
        />
      )}
    </div>
  )
}

const PerformanceOptimizedComponents = {
  PerformanceMonitor,
  OptimizedImage,
  VirtualizedCaseCard,
  InfiniteScrollContainer,
  PerformanceOptimizedGrid,
  PerformanceOptimizedCaseStudies
}

export default PerformanceOptimizedComponents