'use client'

// Responsive layout components with mobile-first design
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
  Settings
} from 'lucide-react'
import { useTouchGestures } from './hooks'

// Mobile-optimized filter drawer
export const MobileFilterDrawer: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}> = ({ children, isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
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
        <div className="overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Responsive grid with adaptive columns
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode
  minItemWidth?: number
  gap?: number
  className?: string
}> = ({ 
  children, 
  minItemWidth = 300, 
  gap = 24, 
  className = '' 
}) => {
  const [columns, setColumns] = useState(1)
  
  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth - 32 // Account for padding
      const cols = Math.floor((width + gap) / (minItemWidth + gap))
      setColumns(Math.max(1, cols))
    }
    
    calculateColumns()
    window.addEventListener('resize', calculateColumns)
    return () => window.removeEventListener('resize', calculateColumns)
  }, [minItemWidth, gap])
  
  return (
    <div 
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {children}
    </div>
  )
}

// Touch-friendly navigation bar
export const TouchNavigationBar: React.FC<{
  onFilterToggle: () => void
  onSearchToggle: () => void
  onViewModeToggle: () => void
  viewMode: 'grid' | 'list'
  hasActiveFilters: boolean
}> = ({ 
  onFilterToggle, 
  onSearchToggle, 
  onViewModeToggle, 
  viewMode,
  hasActiveFilters 
}) => {
  const { gestureState, touchHandlers } = useTouchGestures()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Hide/show nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY
      
      if (currentScrollY > 100) {
        setIsVisible(!isScrollingDown)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  
  return (
    <motion.div
      className="md:hidden fixed bottom-4 left-4 right-4 z-40"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...touchHandlers}
    >
      <div className="flex items-center justify-between bg-background/95 backdrop-blur-md border rounded-full shadow-lg px-4 py-3">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearchToggle}
          className="h-10 w-10 p-0 rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {/* Filter */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFilterToggle}
          className="h-10 w-10 p-0 rounded-full relative"
        >
          <Filter className="h-5 w-5" />
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
          )}
        </Button>
        
        {/* View Mode */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewModeToggle}
          className="h-10 w-10 p-0 rounded-full"
        >
          {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
        </Button>
        
        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Swipe indicator */}
      {gestureState.isSwipeLeft && (
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Swipe left
        </motion.div>
      )}
    </motion.div>
  )
}

// Parallax header component
export const ParallaxHeader: React.FC<{
  title: string
  subtitle?: string
  backgroundImage?: string
  height?: string
}> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '60vh' 
}) => {
  const { scrollY } = useViewportScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  return (
    <motion.div 
      className="relative overflow-hidden flex items-center justify-center"
      style={{ height, y }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
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

// Sticky scroll progress indicator
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useViewportScroll()
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// Back to top button with scroll threshold
export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <motion.button
      className="fixed bottom-20 right-4 md:bottom-4 z-30 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </motion.button>
  )
}

// Responsive masonry layout
export const MasonryLayout: React.FC<{
  children: React.ReactNode
  columns?: { mobile: number; tablet: number; desktop: number }
  gap?: number
}> = ({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16 
}) => {
  const [currentColumns, setCurrentColumns] = useState(columns.mobile)
  
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setCurrentColumns(columns.desktop)
      } else if (width >= 768) {
        setCurrentColumns(columns.tablet)
      } else {
        setCurrentColumns(columns.mobile)
      }
    }
    
    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [columns])
  
  const childrenArray = React.Children.toArray(children)
  const columnArrays = Array.from({ length: currentColumns }, () => [] as React.ReactNode[])
  
  childrenArray.forEach((child, index) => {
    const columnIndex = index % currentColumns
    columnArrays[columnIndex].push(child)
  })
  
  return (
    <div 
      className="flex"
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((column, index) => (
        <div 
          key={index}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column}
        </div>
      ))}
    </div>
  )
}

// Mobile search overlay
export const MobileSearchOverlay: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  placeholder?: string
}> = ({ isOpen, onClose, onSearch, placeholder = "Search case studies..." }) => {
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    if (isOpen) {
      // Focus search input when overlay opens
      setTimeout(() => {
        const input = document.querySelector('#mobile-search-input') as HTMLInputElement
        input?.focus()
      }, 100)
    }
  }, [isOpen])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
    onClose()
  }
  
  return (
    <motion.div
      className={`md:hidden fixed inset-0 z-50 bg-background ${isOpen ? 'block' : 'hidden'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 w-10 p-0"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            id="mobile-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-lg bg-transparent border-none outline-none"
          />
        </form>
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="h-10 w-10 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Search through {/* case studies count */} case studies
        </p>
        
        {/* Recent searches or suggestions could go here */}
        <div className="space-y-2">
          {['Digital transformation', 'E-commerce', 'Marketing automation'].map((suggestion) => (
            <button
              key={suggestion}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
              onClick={() => {
                setQuery(suggestion)
                onSearch(suggestion)
                onClose()
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const responsiveLayout = {
  MobileFilterDrawer,
  ResponsiveGrid,
  TouchNavigationBar,
  ParallaxHeader,
  ScrollProgress,
  BackToTopButton,
  MasonryLayout,
  MobileSearchOverlay
}

export default responsiveLayout