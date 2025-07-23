import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database/supabase'

// Get authenticated user from request (same as main keywords endpoint)
async function getAuthenticatedUser(request: NextRequest) {
  try {
    console.log('Stats: Getting authenticated user...')
    
    // Get user email from request headers (set by client)
    const userEmail = request.headers.get('x-user-email')
    const userId = request.headers.get('x-user-id')
    
    console.log('Stats: Headers:', { userEmail, userId })
    
    if (userEmail && userId) {
      console.log('Stats: Using user from headers:', userEmail)
      return {
        id: userId,
        email: userEmail
      }
    }
    
    // Fallback to development user for testing
    console.log('Stats: Using fallback development user')
    return {
      id: 'ed3c9095-7ba1-40db-9e38-c30f80151fa5',
      email: 'test@gmail.com'
    }
  } catch (err) {
    console.error('getAuthenticatedUser error:', err)
    throw new Error('Authentication required')
  }
}

// GET /api/keywords/stats - Get keyword statistics
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Get all keywords for the user (using email_user column like main endpoint)
    const { data: keywords, error } = await supabase
      .from('keywords')
      .select('status, category')
      .eq('email_user', user.email)
    
    if (error) {
      console.error('Error fetching keywords for stats:', error)
      return NextResponse.json({ error: 'Failed to fetch keyword stats' }, { status: 500 })
    }
    
    // Calculate stats
    const stats = {
      total: keywords?.length || 0,
      active: keywords?.filter((k: any) => k.status === 'active').length || 0,
      inactive: keywords?.filter((k: any) => k.status === 'inactive').length || 0,
      archived: keywords?.filter((k: any) => k.status === 'archived').length || 0,
      categories: {} as { [key: string]: number },
      recentJobs: 0 // Default to 0 since we don't have scraping jobs table setup properly
    }
    
    // Count by category
    keywords?.forEach((keyword: any) => {
      if (keyword.category) {
        stats.categories[keyword.category] = (stats.categories[keyword.category] || 0) + 1
      }
    })
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error in GET /api/keywords/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}