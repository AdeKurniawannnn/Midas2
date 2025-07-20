'use client'

// Touch-optimized interactive elements for case studies
import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Heart, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Copy,
  Check,
  MoreVertical,
  Eye
} from 'lucide-react'
import { useFavorites, useModal, useTouchGestures, useResponsiveDesign, useTouchOptimization } from './hooks'
import { buttonAnimations, modalAnimations } from './animations'

// Touch-optimized floating action button with enhanced haptic feedback
export const TouchFloatingActionButton: React.FC<{
  icon: React.ReactNode
  onClick?: () => void
  className?: string
  ariaLabel?: string
  hapticPattern?: number | number[]
  longPressAction?: () => void
}> = ({ 
  icon, 
  onClick, 
  className = '', 
  ariaLabel, 
  hapticPattern = 50,
  longPressAction 
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPressed, setIsLongPressed] = useState(false)
  const rippleRef = useRef<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const { triggerHaptic } = useTouchOptimization()

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPressed(true)
    
    // Start long press timer
    if (longPressAction) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true)
        triggerHaptic([50, 50, 50])
        longPressAction()
      }, 500)
    }
  }, [longPressAction, triggerHaptic])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
    setIsLongPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isLongPressed) {
      triggerHaptic(hapticPattern)
      onClick()
    }
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++rippleRef.current
    
    setRipples(prev => [...prev, { id, x, y }])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
  }, [onClick, isLongPressed, triggerHaptic, hapticPattern])

  return (
    <motion.button
      className={`relative overflow-hidden rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-shadow touch-manipulation ${className}`}
      style={{ 
        minHeight: '44px', 
        minWidth: '44px',
        touchAction: 'manipulation'
      }}
      variants={buttonAnimations}
      whileHover="hover"
      whileTap="tap"
      animate={{
        scale: isPressed ? 0.95 : isLongPressed ? 1.1 : 1,
        rotate: isLongPressed ? 5 : 0
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <div className="relative z-10 p-3">
        {icon}
      </div>
      
      {/* Enhanced visual feedback */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
      
      {isLongPressed && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  )
}

// Enhanced touch-optimized case study card with swipe actions
export const TouchInteractiveCaseCard: React.FC<{
  caseStudy: any
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onView?: (id: string) => void
  onQuickPreview?: (id: string) => void
  enableSwipeActions?: boolean
}> = ({ 
  caseStudy, 
  onFavorite, 
  onShare, 
  onView, 
  onQuickPreview,
  enableSwipeActions = true 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [swipeState, setSwipeState] = useState<'left' | 'right' | 'center'>('center')
  const { isFavorite, toggleFavorite } = useFavorites()
  const { gestureState, touchHandlers } = useTouchGestures()
  const { isMobile, isTouchDevice } = useResponsiveDesign()
  const { triggerHaptic } = useTouchOptimization()
  
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9])

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 100
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swipe right - favorite action
        setSwipeState('right')
        triggerHaptic(100)
        toggleFavorite(caseStudy.id)
        onFavorite?.(caseStudy.id)
      } else {
        // Swipe left - share action
        setSwipeState('left')
        triggerHaptic(100)
        onShare?.(caseStudy.id)
      }
      
      // Reset after action
      setTimeout(() => {
        setSwipeState('center')
        x.set(0)
      }, 300)
    } else {
      // Snap back to center
      setSwipeState('center')
    }
  }, [caseStudy.id, toggleFavorite, onFavorite, onShare, triggerHaptic, x])

  const swipeActionIcon = swipeState === 'left' ? <Share2 className="h-6 w-6" /> : 
                         swipeState === 'right' ? <Heart className="h-6 w-6" /> : null

  return (
    <motion.div
      className="group relative touch-manipulation"
      style={{ 
        x: enableSwipeActions && isTouchDevice ? x : 0,
        opacity,
        scale,
        touchAction: enableSwipeActions ? 'pan-x' : 'auto'
      }}
      drag={enableSwipeActions && isTouchDevice ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      {...(isTouchDevice ? touchHandlers : {})}
    >
      {/* Swipe action background */}
      {enableSwipeActions && isTouchDevice && swipeState !== 'center' && (
        <motion.div
          className={`absolute inset-0 rounded-xl flex items-center justify-center ${
            swipeState === 'left' ? 'bg-blue-500' : 'bg-red-500'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
        >
          {swipeActionIcon}
        </motion.div>
      )}
      
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative h-64 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${caseStudy.thumbnail})` }}
            role="img"
            aria-label={caseStudy.title}
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Touch-optimized action buttons */}
          <AnimatePresence>
            {(isHovered || isTouchDevice) && (
              <motion.div 
                className="absolute top-4 right-4 flex flex-col gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <TouchFloatingActionButton
                    icon={<Heart className={`h-4 w-4 ${isFavorite(caseStudy.id) ? 'fill-current' : ''}`} />}
                    onClick={() => {
                      toggleFavorite(caseStudy.id)
                      onFavorite?.(caseStudy.id)
                    }}
                    className="h-11 w-11"
                    ariaLabel="Add to favorites"
                    hapticPattern={isFavorite(caseStudy.id) ? [30, 30, 30] : 50}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TouchFloatingActionButton
                    icon={<Share2 className="h-4 w-4" />}
                    onClick={() => onShare?.(caseStudy.id)}
                    className="h-11 w-11"
                    ariaLabel="Share case study"
                    hapticPattern={[50, 30]}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TouchFloatingActionButton
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => onView?.(caseStudy.id)}
                    longPressAction={() => onQuickPreview?.(caseStudy.id)}
                    className="h-11 w-11"
                    ariaLabel="View details (long press for preview)"
                    hapticPattern={30}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Category badge with enhanced touch target */}
          <motion.div 
            className="absolute bottom-4 left-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge className="bg-primary/90 backdrop-blur-sm border border-white/20 px-3 py-1 text-sm">
              {caseStudy.category.replace('-', ' ')}
            </Badge>
          </motion.div>
        </div>
        
        <CardContent className="p-6">
          <motion.h3 
            className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2"
            layout
          >
            {caseStudy.title}
          </motion.h3>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {caseStudy.description}
          </p>
          
          {/* Enhanced results display for touch */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {caseStudy.results.slice(0, 2).map((result: any, idx: number) => (
                <motion.div 
                  key={idx} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-bold text-primary">{result.value}</div>
                  <div className="text-xs text-muted-foreground">{result.metric}</div>
                </motion.div>
              ))}
            </div>
            
            {isMobile && (
              <div className="text-xs text-muted-foreground">
                {enableSwipeActions ? 'Swipe for actions' : 'Tap for options'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Touch-optimized multi-action button with contextual menu
export const TouchActionMenu: React.FC<{
  caseStudy: any
  onAction: (action: string, id: string) => void
}> = ({ caseStudy, onAction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isTouchDevice } = useResponsiveDesign()
  const { triggerHaptic } = useTouchOptimization()

  const actions = [
    { id: 'view', label: 'View Details', icon: <Eye className="h-4 w-4" /> },
    { id: 'favorite', label: 'Add to Favorites', icon: <Heart className="h-4 w-4" /> },
    { id: 'share', label: 'Share', icon: <Share2 className="h-4 w-4" /> },
    { id: 'download', label: 'Download', icon: <Download className="h-4 w-4" /> },
  ]

  const handleActionClick = useCallback((actionId: string) => {
    triggerHaptic(50)
    onAction(actionId, caseStudy.id)
    setIsOpen(false)
  }, [onAction, caseStudy.id, triggerHaptic])

  return (
    <div className="relative">
      <TouchFloatingActionButton
        icon={<MoreVertical className="h-4 w-4" />}
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10"
        ariaLabel="More actions"
        hapticPattern={[30, 30]}
      />
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 z-50 bg-background border rounded-lg shadow-lg overflow-hidden min-w-[160px]"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {actions.map((action, index) => (
                <motion.button
                  key={action.id}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors touch-manipulation"
                  style={{ minHeight: isTouchDevice ? '44px' : '36px' }}
                  onClick={() => handleActionClick(action.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'var(--muted)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action.icon}
                  <span className="text-sm">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const TouchInteractiveElements = {
  TouchFloatingActionButton,
  TouchInteractiveCaseCard,
  TouchActionMenu
}

export default TouchInteractiveElements