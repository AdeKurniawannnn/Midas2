'use client'

// Comprehensive performance optimization wrapper
import React, { 
  Suspense, 
  lazy, 
  memo, 
  useEffect, 
  useState,
  useMemo,
  ErrorBoundary as ReactErrorBoundary 
} from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Zap } from 'lucide-react'

// Performance monitoring
import { PerformanceProvider, PerformanceIndicator } from './performance-monitor'
import { useOptimizedAnimation, useResourceMonitoring } from './performance-hooks'

// Lazy load components with performance considerations
const LazyPerformanceOptimizedGrid = lazy(() => 
  import('./performance-optimized').then(module => ({
    default: module.default.PerformanceOptimizedCaseStudies
  }))
)

const LazyTouchInteractiveCard = lazy(() => 
  import('./touch-interactive-elements').then(module => ({
    default: module.TouchInteractiveCaseCard
  }))
)

const LazyEnhancedGrid = lazy(() => 
  import('./enhanced-grid-fixed').then(module => ({
    default: module.EnhancedCaseStudiesGrid
  }))
)

// Performance-aware error boundary
class PerformanceErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log performance-related errors
    console.error('Performance component error:', error, errorInfo)
    
    // Report to performance monitoring if available
    if ('reportError' in window) {
      (window as any).reportError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}

// Default error fallback with performance considerations
const DefaultErrorFallback: React.FC<{ 
  error?: Error
  retry: () => void 
}> = ({ error, retry }) => (
  <Alert className="my-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>
        Component failed to load. This might be due to performance constraints.
        {error && ` Error: ${error.message}`}
      </span>
      <Button onClick={retry} size="sm" variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </AlertDescription>
  </Alert>
)

// Adaptive loading skeleton based on device performance
const AdaptiveLoadingSkeleton: React.FC<{ 
  count?: number
  variant?: 'card' | 'list' | 'grid'
}> = memo(({ count = 6, variant = 'card' }) => {
  const { shouldAnimate } = useOptimizedAnimation()
  
  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="flex gap-4 p-4 border rounded-lg"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldAnimate ? i * 0.1 : 0 }}
          >
            <Skeleton className="w-32 h-24 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="space-y-4"
          initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: shouldAnimate ? i * 0.1 : 0 }}
        >
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </motion.div>
      ))}
    </div>
  )
})

AdaptiveLoadingSkeleton.displayName = 'AdaptiveLoadingSkeleton'

// Performance-aware component selector
const PerformanceAwareComponentSelector: React.FC<{
  caseStudies: any[]
  viewMode: 'optimized' | 'enhanced' | 'touch'
  devicePerformance: 'high' | 'medium' | 'low'
}> = memo(({ caseStudies, viewMode, devicePerformance }) => {
  // Select component based on performance level
  const ComponentToRender = useMemo(() => {
    if (devicePerformance === 'low') {
      // Use basic components for low-performance devices
      return lazy(() => import('./performance-optimized').then(module => ({
        default: module.default.PerformanceOptimizedCaseStudies
      })))
    }
    
    switch (viewMode) {
      case 'optimized':
        return LazyPerformanceOptimizedGrid
      case 'touch':
        return LazyTouchInteractiveCard
      case 'enhanced':
      default:
        return LazyEnhancedGrid
    }
  }, [viewMode, devicePerformance])
  
  return (
    <Suspense fallback={<AdaptiveLoadingSkeleton variant="card" />}>
      <ComponentToRender 
        caseStudies={caseStudies}
        enableLazyLoading={devicePerformance !== 'high'}
      />
    </Suspense>
  )
})

PerformanceAwareComponentSelector.displayName = 'PerformanceAwareComponentSelector'

// Device performance detector
const useDevicePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('medium')
  const resourceMetrics = useResourceMonitoring()
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const navigator = window.navigator as any
    
    // Performance indicators
    const indicators = {
      memory: navigator.deviceMemory || 4,
      cores: navigator.hardwareConcurrency || 4,
      connection: navigator.connection?.effectiveType || '4g',
      pixelRatio: window.devicePixelRatio || 1
    }
    
    // Score performance level
    let score = 0
    
    // Memory scoring
    if (indicators.memory >= 8) score += 3
    else if (indicators.memory >= 4) score += 2
    else score += 1
    
    // CPU scoring
    if (indicators.cores >= 8) score += 3
    else if (indicators.cores >= 4) score += 2
    else score += 1
    
    // Connection scoring
    if (indicators.connection === '4g') score += 2
    else if (indicators.connection === '3g') score += 1
    
    // Device pixel ratio (retina displays might need more resources)
    if (indicators.pixelRatio <= 1.5) score += 1
    
    // Determine performance level
    if (score >= 8) setPerformanceLevel('high')
    else if (score >= 5) setPerformanceLevel('medium')
    else setPerformanceLevel('low')
    
  }, [resourceMetrics])
  
  return performanceLevel
}

// Main performance wrapper component
export const PerformanceOptimizedCaseStudiesWrapper: React.FC<{
  caseStudies: any[]
  initialViewMode?: 'optimized' | 'enhanced' | 'touch'
  enablePerformanceMonitoring?: boolean
  enableAdaptiveLoading?: boolean
}> = ({
  caseStudies,
  initialViewMode = 'optimized',
  enablePerformanceMonitoring = true,
  enableAdaptiveLoading = true
}) => {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const devicePerformance = useDevicePerformance()
  const { shouldAnimate } = useOptimizedAnimation()
  
  // Auto-adjust view mode based on device performance
  useEffect(() => {
    if (enableAdaptiveLoading) {
      if (devicePerformance === 'low' && viewMode !== 'optimized') {
        setViewMode('optimized')
      }
    }
  }, [devicePerformance, enableAdaptiveLoading, viewMode])
  
  return (
    <PerformanceProvider>
      <div className="space-y-6">
        {/* Performance monitoring indicator */}
        {enablePerformanceMonitoring && <PerformanceIndicator />}
        
        {/* Performance level indicator */}
        {enablePerformanceMonitoring && (
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={shouldAnimate ? { opacity: 0, y: -10 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Zap className="h-4 w-4" />
            <span>Device Performance: </span>
            <span className={`font-medium ${
              devicePerformance === 'high' ? 'text-green-500' :
              devicePerformance === 'medium' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {devicePerformance.charAt(0).toUpperCase() + devicePerformance.slice(1)}
            </span>
          </motion.div>
        )}
        
        {/* View mode selector */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={viewMode === 'optimized' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('optimized')}
          >
            Optimized View
          </Button>
          <Button
            variant={viewMode === 'enhanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('enhanced')}
            disabled={devicePerformance === 'low'}
          >
            Enhanced View
          </Button>
          <Button
            variant={viewMode === 'touch' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('touch')}
            disabled={devicePerformance === 'low'}
          >
            Touch Interactive
          </Button>
        </div>
        
        {/* Main content with error boundary */}
        <PerformanceErrorBoundary>
          <PerformanceAwareComponentSelector
            caseStudies={caseStudies}
            viewMode={viewMode}
            devicePerformance={devicePerformance}
          />
        </PerformanceErrorBoundary>
      </div>
    </PerformanceProvider>
  )
}

// Export individual components for flexible usage
export {
  PerformanceErrorBoundary,
  AdaptiveLoadingSkeleton,
  PerformanceAwareComponentSelector
}

const PerformanceWrapperComponents = {
  PerformanceOptimizedCaseStudiesWrapper,
  PerformanceErrorBoundary,
  AdaptiveLoadingSkeleton,
  PerformanceAwareComponentSelector
}

export default PerformanceWrapperComponents