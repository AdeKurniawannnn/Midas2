// Performance-optimized animations with reduced motion support
import { Variants } from 'framer-motion'

// Detect user's motion preferences
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false

// Performance-optimized base configurations
const performanceConfig = {
  reduced: {
    duration: 0.2,
    ease: "easeOut",
    staggerChildren: 0.05
  },
  normal: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
    staggerChildren: 0.1
  }
}

const config = prefersReducedMotion ? performanceConfig.reduced : performanceConfig.normal

// Optimized card animations with GPU acceleration
export const optimizedCardAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion ? 10 : 30,
    scale: prefersReducedMotion ? 1 : 0.95,
    transition: {
      duration: config.duration,
      ease: config.ease as any
    }
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: config.duration,
      delay: prefersReducedMotion ? 0 : index * 0.05,
      ease: config.ease as any
    }
  }),
  hover: prefersReducedMotion ? {} : {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: prefersReducedMotion ? {} : {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeOut" as any
    }
  }
}

// Lightweight container animations
export const optimizedContainerAnimations: Variants = {
  hidden: {
    opacity: prefersReducedMotion ? 1 : 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: config.duration,
      staggerChildren: config.staggerChildren,
      delayChildren: prefersReducedMotion ? 0 : 0.1
    }
  }
}

// Minimal filter animations
export const optimizedFilterAnimations: Variants = {
  hidden: {
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: config.duration,
      ease: config.ease as any
    }
  }
}

// Performance-focused button animations
export const optimizedButtonAnimations: Variants = {
  hover: prefersReducedMotion ? {} : {
    scale: 1.05,
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  },
  tap: prefersReducedMotion ? {} : {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeOut" as any
    }
  }
}

// Optimized loading animations
export const optimizedLoadingAnimations: Variants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: prefersReducedMotion ? 0.5 : 1.5,
      repeat: Infinity,
      ease: "easeInOut" as any
    }
  }
}

// Performance-optimized modal animations
export const optimizedModalAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.9,
    y: prefersReducedMotion ? 0 : 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: config.duration,
      ease: config.ease as any
    }
  },
  exit: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.9,
    y: prefersReducedMotion ? 0 : 20,
    transition: {
      duration: config.duration * 0.7,
      ease: "easeIn"
    }
  }
}

// Scroll-triggered animations with performance optimization
export const optimizedScrollAnimations: Variants = {
  offscreen: {
    opacity: prefersReducedMotion ? 1 : 0,
    y: prefersReducedMotion ? 0 : 50
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: config.duration,
      ease: config.ease as any
    }
  }
}

// Gesture-based animations with performance considerations
export const optimizedGestureAnimations: Variants = {
  swipeLeft: prefersReducedMotion ? {} : {
    x: -100,
    opacity: 0.5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  swipeRight: prefersReducedMotion ? {} : {
    x: 100,
    opacity: 0.5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

// Utility function for creating performance-optimized transitions
export const createOptimizedTransition = (
  duration: number = config.duration,
  delay: number = 0
) => ({
  duration: prefersReducedMotion ? duration * 0.5 : duration,
  delay: prefersReducedMotion ? 0 : delay,
  ease: config.ease,
  force3d: true
})

// Utility for staggered animations
export const createStaggeredAnimation = (
  baseAnimation: any,
  staggerDelay: number = 0.1
) => ({
  ...baseAnimation,
  transition: {
    ...baseAnimation.transition,
    staggerChildren: prefersReducedMotion ? staggerDelay * 0.3 : staggerDelay
  }
})

// Performance monitoring utilities
export const animationPerformanceConfig = {
  // Reduce animation complexity on slower devices
  reduceMotionOnSlowDevice: () => {
    if (typeof window !== 'undefined') {
      const connection = (navigator as any).connection
      if (connection) {
        // Reduce animations on slow connections
        return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      }
      
      // Reduce animations on devices with limited memory
      const memory = (navigator as any).deviceMemory
      return memory && memory <= 2
    }
    return false
  },
  
  // Check if device supports hardware acceleration
  supportsHardwareAcceleration: () => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    }
    return true
  }
}

// Adaptive animation configuration based on device capabilities
const deviceCapabilities = {
  reduceMotion: prefersReducedMotion || animationPerformanceConfig.reduceMotionOnSlowDevice(),
  hardwareAcceleration: animationPerformanceConfig.supportsHardwareAcceleration()
}

// Export adaptive configurations
export const adaptiveAnimationConfig = {
  ...config,
  deviceCapabilities,
  shouldUseReducedMotion: deviceCapabilities.reduceMotion,
  shouldUseHardwareAcceleration: deviceCapabilities.hardwareAcceleration
}

// Default export with all optimized animations
const PerformanceAnimations = {
  optimizedCardAnimations,
  optimizedContainerAnimations,
  optimizedFilterAnimations,
  optimizedButtonAnimations,
  optimizedLoadingAnimations,
  optimizedModalAnimations,
  optimizedScrollAnimations,
  optimizedGestureAnimations,
  createOptimizedTransition,
  createStaggeredAnimation,
  adaptiveAnimationConfig,
  animationPerformanceConfig
}

export default PerformanceAnimations