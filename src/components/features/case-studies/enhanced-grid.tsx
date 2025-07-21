'use client'

// Enhanced case studies grid with advanced frontend features
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { CaseStudy } from '@/components/shared/work/CaseStudy'
import { caseStudies } from '@/lib/data/case-studies'
import { 
  containerAnimations, 
  cardAnimations, 
  filterAnimations 
} from './animations'
import { 
  useCaseStudyFilters, 
  useAdvancedSearch, 
  useSortedCaseStudies,
  useFavorites 
} from './hooks'

interface EnhancedGridProps {
  initialView?: 'grid' | 'list'
  showSearch?: boolean
  showFilters?: boolean
  showSort?: boolean
  itemsPerPage?: number
}

export const EnhancedCaseStudiesGrid: React.FC<EnhancedGridProps> = ({
  initialView = 'grid',
  showSearch = true,
  showFilters = true,
  showSort = true,
  itemsPerPage = 9
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView)
  const [selectedCases, setSelectedCases] = useState<string[]>([])
  
  // Custom hooks for functionality
  const { activeFilter, isTransitioning, handleFilterChange } = useCaseStudyFilters()
  const { query, setQuery, filteredItems, isSearching } = useAdvancedSearch(caseStudies)
  const { sortedItems, sortBy, sortOrder, handleSort } = useSortedCaseStudies(filteredItems)
  const { favorites, toggleFavorite } = useFavorites()

  // Get unique categories
  const categories = useMemo(() => 
    Array.from(new Set(caseStudies.map(study => study.category))),
    []
  )

  // Filter by active category
  const displayedItems = useMemo(() => {
    if (activeFilter === 'all') return sortedItems
    return sortedItems.filter(study => study.category === activeFilter)
  }, [sortedItems, activeFilter])

  // Format category name
  const formatCategory = (category: string) => 
    category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

  return (
    <div className="space-y-8">
      {/* Enhanced controls bar */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-gradient-to-r from-background to-muted/50 rounded-xl border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search case studies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort controls */}
          {showSort && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('title')}
                className="gap-2"
              >
                Title
                {sortBy === 'title' && (
                  sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('category')}
                className="gap-2"
              >
                Category
                {sortBy === 'category' && (
                  sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {displayedItems.length} of {caseStudies.length} cases
          </div>
        </div>
      </motion.div>

      {/* Enhanced filters */}
      {showFilters && (
        <motion.div 
          className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg"
          variants={containerAnimations}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={filterAnimations}>
            <Badge 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
              onClick={() => handleFilterChange('all')}
            >
              All ({caseStudies.length})
            </Badge>
          </motion.div>
          
          {categories.map(category => {
            const count = caseStudies.filter(study => study.category === category).length
            return (
              <motion.div key={category} variants={filterAnimations}>
                <Badge 
                  variant={activeFilter === category ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                  onClick={() => handleFilterChange(category)}
                >
                  {formatCategory(category)} ({count})
                </Badge>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Enhanced grid/list view */}
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Filtering cases...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`${viewMode}-${activeFilter}`}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
            variants={containerAnimations}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {displayedItems.map((study, index) => (
              <motion.div
                key={study.id}
                variants={cardAnimations}
                custom={index}
                className="group"
              >
                {viewMode === 'grid' ? (
                  <CaseStudy 
                    caseStudy={study} 
                    isPreview 
                    priority={index < 3}
                  />
                ) : (
                  // List view layout
                  <div className="flex gap-6 p-6 bg-background border rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image 
                        src={study.thumbnail} 
                        alt={study.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {formatCategory(study.category)}
                          </Badge>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {study.title}
                          </h3>
                          <p className="text-muted-foreground mt-2">
                            {study.description}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          {study.results.slice(0, 2).map((result: { metric: string; value: string }, idx: number) => (
                            <div key={idx} className="text-center">
                              <div className="text-lg font-bold text-primary">{result.value}</div>
                              <div className="text-xs text-muted-foreground">{result.metric}</div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="gap-2">
                          View Study <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced empty state */}
      {displayedItems.length === 0 && !isTransitioning && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {query ? 'No matching case studies' : 'No case studies found'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {query 
              ? `Try adjusting your search terms or filters`
              : 'There are no case studies in this category yet.'
            }
          </p>
          {query && (
            <Button onClick={() => setQuery('')} variant="outline">
              Clear search
            </Button>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default EnhancedCaseStudiesGrid