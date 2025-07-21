// Frontend animation utilities for case studies
// Enhanced micro-interactions and visual feedback systems

import { Variants } from 'framer-motion'

// Card animations with staggered entrance
export const cardAnimations: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

// Container animations for staggered children
export const containerAnimations: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Hero section animations
export const heroAnimations: Variants = {
  hidden: { 
    opacity: 0,
    y: 40
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Statistics counter animations
export const statsAnimations: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
}

// Filter animations
export const filterAnimations: Variants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

// Image reveal animations
export const imageAnimations: Variants = {
  hidden: { 
    opacity: 0,
    scale: 1.1
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Modal/overlay animations
export const modalAnimations: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

// Loading skeleton animations
export const skeletonAnimations: Variants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Page transition animations
export const pageAnimations: Variants = {
  initial: { 
    opacity: 0,
    x: 300
  },
  enter: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    x: -300,
    transition: {
      duration: 0.3
    }
  }
}

// Button interaction animations
export const buttonAnimations: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  loading: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Badge/tag animations
export const badgeAnimations: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: -10
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "backOut"
    }
  }
}

// Advanced hover effects for cards
export const cardHoverEffects = {
  shadowLift: {
    boxShadow: [
      "0 4px 8px rgba(0, 0, 0, 0.1)",
      "0 20px 40px rgba(0, 0, 0, 0.15)"
    ],
    transition: { duration: 0.3 }
  },
  borderGlow: {
    borderColor: ["transparent", "rgba(59, 130, 246, 0.5)"],
    transition: { duration: 0.3 }
  }
}

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" }
    }
  }
}

// Performance optimized animations (respects prefers-reduced-motion)
export const getOptimizedAnimation = (animation: Variants, prefersReducedMotion: boolean): Variants => {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } }
    }
  }
  return animation
}

// Animation presets for different viewport sizes
export const responsiveAnimations = {
  mobile: {
    // Reduced motion for mobile performance
    duration: 0.3,
    distance: 20
  },
  tablet: {
    duration: 0.4,
    distance: 30
  },
  desktop: {
    duration: 0.5,
    distance: 40
  }
}

// Custom spring configurations
export const springConfigs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 200, damping: 20 },
  slow: { type: "spring", stiffness: 80, damping: 14 }
}

// Utility for creating staggered animations
export const createStaggeredAnimation = (
  childAnimation: Variants,
  staggerDelay: number = 0.1,
  delayChildren: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
})

const animations = {
  cardAnimations,
  containerAnimations,
  heroAnimations,
  statsAnimations,
  filterAnimations,
  imageAnimations,
  modalAnimations,
  skeletonAnimations,
  pageAnimations,
  buttonAnimations,
  badgeAnimations,
  cardHoverEffects,
  scrollAnimations,
  getOptimizedAnimation,
  responsiveAnimations,
  springConfigs,
  createStaggeredAnimation
}

export default animations