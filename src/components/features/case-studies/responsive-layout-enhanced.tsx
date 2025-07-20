'use client'

// Enhanced responsive layout components with advanced touch interactions
import React, { useState, useEffect } from 'react'
import { motion, useViewportScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  X,
  ChevronUp,
  Filter,
  Search,
  Grid,
  List,
  Settings,
  Smartphone,
  Monitor,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { useTouchGestures } from './hooks'

// Enhanced mobile filter drawer with swipe gestures
export const EnhancedMobileFilterDrawer: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}> = ({ children, isOpen, onOpenChange }) => {
  const [dragY, setDragY] = useState(0)
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] touch-manipulation"
        onInteractOutside={(e) => {
          // Allow closing by tapping outside
          onOpenChange(false)
        }}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 200 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onOpenChange(false)
            }
          }}
          className="relative h-full"
        >
          {/* Drag handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters & Sort</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[60vh] overscroll-contain">
            {children}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}

// Adaptive responsive grid with touch-optimized spacing
export const AdaptiveResponsiveGrid: React.FC<{
  children: React.ReactNode
  minItemWidth?: number
  gap?: number
  className?: string
  touchOptimized?: boolean
}> = ({ 
  children, 
  minItemWidth = 300, 
  gap = 24, 
  className = '',
  touchOptimized = true
}) => {
  const [columns, setColumns] = useState(1)
  const [touchSpacing, setTouchSpacing] = useState(gap)
  
  useEffect(() => {
    const calculateLayout = () => {
      const width = window.innerWidth - 32 // Account for padding
      const isMobile = width < 768
      
      // Adjust spacing for touch devices
      const adjustedGap = touchOptimized && isMobile ? Math.max(gap, 16) : gap
      const adjustedMinWidth = touchOptimized && isMobile ? Math.max(minItemWidth, 280) : minItemWidth
      
      const cols = Math.floor((width + adjustedGap) / (adjustedMinWidth + adjustedGap))
      setColumns(Math.max(1, cols))
      setTouchSpacing(adjustedGap)
    }
    
    calculateLayout()
    window.addEventListener('resize', calculateLayout)
    return () => window.removeEventListener('resize', calculateLayout)
  }, [minItemWidth, gap, touchOptimized])
  
  return (
    <div 
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${touchSpacing}px`,
        // Optimize for touch scrolling
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {children}
    </div>
  )
}

// Advanced touch navigation bar with gesture support
export const AdvancedTouchNavigationBar: React.FC<{
  onFilterToggle: () => void
  onSearchToggle: () => void
  onViewModeToggle: () => void
  viewMode: 'grid' | 'list'
  hasActiveFilters: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  hapticFeedback?: boolean
}> = ({ 
  onFilterToggle, 
  onSearchToggle, 
  onViewModeToggle, 
  viewMode,
  hasActiveFilters,
  onSwipeLeft,
  onSwipeRight,
  hapticFeedback = true
}) => {
  const { gestureState, touchHandlers } = useTouchGestures()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [longPressActive, setLongPressActive] = useState(false)
  
  // Enhanced scroll behavior with momentum and device optimization
  useEffect(() => {
    let ticking = false
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollVelocity = Math.abs(currentScrollY - lastScrollY)
          const isScrollingDown = currentScrollY > lastScrollY
          
          // Dynamic threshold based on scroll velocity
          const threshold = scrollVelocity > 10 ? 50 : 100
          
          if (currentScrollY > threshold) {
            setIsVisible(!isScrollingDown || scrollVelocity < 5)
          } else {
            setIsVisible(true)
          }
          
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
      
      // Hide nav on continuous scroll, show when stopped
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
          setIsVisible(true)
        }
      }, 150)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [lastScrollY])
  
  // Enhanced gesture handling
  useEffect(() => {
    if (gestureState.isSwipeLeft && onSwipeLeft) {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50)
      }
      onSwipeLeft()
    }
    if (gestureState.isSwipeRight && onSwipeRight) {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50)
      }
      onSwipeRight()
    }
  }, [gestureState.isSwipeLeft, gestureState.isSwipeRight, onSwipeLeft, onSwipeRight, hapticFeedback])
  
  // Long press detection for settings
  const handleLongPress = (callback: () => void) => {
    let pressTimer: NodeJS.Timeout
    
    const start = () => {
      pressTimer = setTimeout(() => {
        setLongPressActive(true)
        if (hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate([50, 50, 50])
        }
        callback()
      }, 500)
    }
    
    const cancel = () => {
      clearTimeout(pressTimer)
      setLongPressActive(false)
    }
    
    return { onTouchStart: start, onTouchEnd: cancel, onTouchCancel: cancel }
  }
  
  return (
    <motion.div
      className="md:hidden fixed bottom-4 left-4 right-4 z-40 select-none"
      initial={{ y: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100,
        scale: isDragging ? 0.95 : longPressActive ? 1.05 : 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: isDragging ? 100 : 300, 
        damping: isDragging ? 15 : 30,
        mass: 0.8
      }}
      drag="x"
      dragConstraints={{ left: -50, right: 50 }}
      dragElastic={0.3}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false)
        
        // Trigger swipe actions based on drag velocity
        if (Math.abs(info.velocity.x) > 500) {
          if (info.velocity.x > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (info.velocity.x < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      }}
      whileDrag={{ 
        scale: 0.95,
        rotate: isDragging ? 2 : 0,
        transition: { duration: 0.1 }
      }}
      style={{ touchAction: 'none' }}
      {...touchHandlers}
    >
      <div className="flex items-center justify-between bg-background/95 backdrop-blur-md border rounded-full shadow-lg px-4 py-3 relative overflow-hidden">
        {/* Drag indicator */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-muted-foreground/30 rounded-full" />
        
        {/* Enhanced gesture feedback */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        )}
        
        {longPressActive && (
          <motion.div
            className="absolute inset-0 bg-secondary/20 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        )}
        
        {/* Search - Enhanced with haptic feedback */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (hapticFeedback && 'vibrate' in navigator) {
              navigator.vibrate(30)
            }
            onSearchToggle()
          }}
          className="h-10 w-10 p-0 rounded-full touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }} // iOS touch target size
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {/* Filter - Enhanced with indicator animation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (hapticFeedback && 'vibrate' in navigator) {
              navigator.vibrate(30)
            }
            onFilterToggle()
          }}
          className="h-10 w-10 p-0 rounded-full relative touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Filter className="h-5 w-5" />
          {hasActiveFilters && (
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </Button>
        
        {/* View Mode - Enhanced transition */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (hapticFeedback && 'vibrate' in navigator) {
              navigator.vibrate(30)
            }
            onViewModeToggle()
          }}
          className="h-10 w-10 p-0 rounded-full touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <motion.div
            key={viewMode}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </motion.div>
        </Button>
        
        {/* Settings - Long press for advanced options */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
          {...handleLongPress(() => {
            // Could open advanced settings modal
            console.log('Long press detected - show advanced settings')
          })}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Enhanced swipe indicators with directional hints */}
      <AnimatePresence>
        {gestureState.isSwipeLeft && (
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground bg-background/90 px-3 py-1 rounded-full border shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ChevronUp className="h-3 w-3 rotate-[-90deg]" />
            Next view
          </motion.div>
        )}
        {gestureState.isSwipeRight && (
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground bg-background/90 px-3 py-1 rounded-full border shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ChevronUp className="h-3 w-3 rotate-90" />
            Previous view
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Enhanced parallax header with touch-optimized performance
export const TouchOptimizedParallaxHeader: React.FC<{
  title: string
  subtitle?: string
  backgroundImage?: string
  height?: string
  enableParallax?: boolean
}> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '60vh',
  enableParallax = true
}) => {
  const { scrollY } = useViewportScroll()
  const [isMobile, setIsMobile] = useState(false)
  
  // Disable parallax on mobile for better performance
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const y = useTransform(scrollY, [0, 500], [0, enableParallax && !isMobile ? 150 : 0])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])
  
  return (
    <motion.div 
      className="relative overflow-hidden flex items-center justify-center"
      style={{ 
        height, 
        y: enableParallax && !isMobile ? y : 0,
        willChange: enableParallax && !isMobile ? 'transform' : 'auto'
      }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            transform: isMobile ? 'none' : undefined
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      
      <motion.div 
        className="relative z-10 text-center text-white px-4"
        style={{ opacity }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            className="text-xl md:text-2xl text-white/90"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

// Enhanced back to top with gesture support
export const GestureBackToTopButton: React.FC<{
  scrollThreshold?: number
  hapticFeedback?: boolean
}> = ({ 
  scrollThreshold = 500,
  hapticFeedback = true
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > scrollThreshold)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold])
  
  const scrollToTop = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }
  
  return (
    <motion.button
      className="fixed bottom-20 right-4 md:bottom-4 z-30 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow touch-manipulation"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? (isPressed ? 0.9 : 1) : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{ 
        minHeight: '44px', 
        minWidth: '44px',
        touchAction: 'manipulation'
      }}
    >
      <ChevronUp className="h-6 w-6" />
    </motion.button>
  )
}

// Touch-optimized masonry layout
export const TouchMasonryLayout: React.FC<{
  children: React.ReactNode
  columns?: { mobile: number; tablet: number; desktop: number }
  gap?: number
  touchOptimized?: boolean
}> = ({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16,
  touchOptimized = true
}) => {
  const [currentColumns, setCurrentColumns] = useState(columns.mobile)
  const [currentGap, setCurrentGap] = useState(gap)
  
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      const isMobile = width < 768
      
      // Adjust gap for touch devices
      const adjustedGap = touchOptimized && isMobile ? Math.max(gap, 12) : gap
      setCurrentGap(adjustedGap)
      
      if (width >= 1024) {
        setCurrentColumns(columns.desktop)
      } else if (width >= 768) {
        setCurrentColumns(columns.tablet)
      } else {
        setCurrentColumns(columns.mobile)
      }
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [columns, gap, touchOptimized])
  
  const childrenArray = React.Children.toArray(children)
  const columnArrays = Array.from({ length: currentColumns }, () => [] as React.ReactNode[])
  
  childrenArray.forEach((child, index) => {
    const columnIndex = index % currentColumns
    columnArrays[columnIndex].push(child)
  })
  
  return (
    <div 
      className="flex"
      style={{ 
        gap: `${currentGap}px`,
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {columnArrays.map((column, index) => (
        <div 
          key={index}
          className="flex-1 flex flex-col"
          style={{ gap: `${currentGap}px` }}
        >
          {column}
        </div>
      ))}
    </div>
  )
}

const ResponsiveLayoutEnhanced = {
  EnhancedMobileFilterDrawer,
  AdaptiveResponsiveGrid,
  AdvancedTouchNavigationBar,
  TouchOptimizedParallaxHeader,
  GestureBackToTopButton,
  TouchMasonryLayout
}

export default ResponsiveLayoutEnhanced