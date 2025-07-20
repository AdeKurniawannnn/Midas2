"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Separator } from "@/components/ui/separator"
import { Award, BarChart, Building, Globe, Users } from "lucide-react"
import { useState, useEffect } from "react"

// Mock client data
const clients = [
  { id: 1, name: "Acme Corp", logo: "A" },
  { id: 2, name: "Globex", logo: "G" },
  { id: 3, name: "Soylent", logo: "S" },
  { id: 4, name: "Initech", logo: "I" },
  { id: 5, name: "Umbrella", logo: "U" },
  { id: 6, name: "Stark Industries", logo: "S" },
  { id: 7, name: "Cyberdyne", logo: "C" },
  { id: 8, name: "Wayne Enterprises", logo: "W" },
]

// Stats with animated counters
const stats = [
  { 
    icon: Globe, 
    value: 50, 
    label: "Countries Reached", 
    prefix: "", 
    suffix: "+" 
  },
  { 
    icon: Users, 
    value: 200, 
    label: "Happy Clients", 
    prefix: "", 
    suffix: "+" 
  },
  { 
    icon: Award, 
    value: 15, 
    label: "Industry Awards", 
    prefix: "", 
    suffix: "" 
  },
  { 
    icon: BarChart, 
    value: 300, 
    label: "ROI Average", 
    prefix: "", 
    suffix: "%" 
  },
]

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    if (inView) {
      const duration = 1500 // Reduced from 2000ms for better performance
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Use easeOutCubic for smoother animation
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeProgress * value))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(value)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [inView, value])

  return (
    <div ref={ref} className="text-3xl font-bold text-primary">
      {prefix}{count}{suffix}
    </div>
  )
}

export function ClientShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  }

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&apos;ve helped companies of all sizes transform their digital presence and achieve remarkable results.
          </p>
        </motion.div>

        {/* Client logo carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden w-full">
            <div className="flex animate-scroll hover:[animation-play-state:paused] will-change-transform">
              {/* Optimized client logos with reduced DOM */}
              {[...clients, ...clients].map((client, index) => (
                <motion.div 
                  key={`${client.id}-${index}`}
                  className="h-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mx-2 flex-shrink-0 w-36 sm:w-40 md:w-44"
                  whileHover={{ 
                    y: -3, 
                    boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.15)",
                    borderColor: "var(--primary)"
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="text-2xl font-bold text-primary">{client.logo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 ml-1.5 truncate">{client.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <Separator className="my-12" />

        {/* Stats with animated counters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
              whileHover={{ y: -5 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 100
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="h-12 w-12 text-primary mb-4" />
              </motion.div>
              <AnimatedCounter 
                value={stat.value} 
                prefix={stat.prefix} 
                suffix={stat.suffix} 
              />
              <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 