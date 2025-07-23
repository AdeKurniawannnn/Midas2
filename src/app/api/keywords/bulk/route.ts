import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database/supabase'
import { BulkKeywordOperation } from '@/lib/types/keywords'

// Get authenticated user from request (same as main keywords endpoint)
async function getAuthenticatedUser(request: NextRequest) {
  try {
    console.log('Bulk: Getting authenticated user...')
    
    // Get user email from request headers (set by client)
    const userEmail = request.headers.get('x-user-email')
    const userId = request.headers.get('x-user-id')
    
    console.log('Bulk: Headers:', { userEmail, userId })
    
    if (userEmail && userId) {
      console.log('Bulk: Using user from headers:', userEmail)
      return {
        id: userId,
        email: userEmail
      }
    }
    
    // Fallback to development user for testing
    console.log('Bulk: Using fallback development user')
    return {
      id: 'ed3c9095-7ba1-40db-9e38-c30f80151fa5',
      email: 'test@gmail.com'
    }
  } catch (err) {
    console.error('getAuthenticatedUser error:', err)
    throw new Error('Authentication required')
  }
}

// POST /api/keywords/bulk - Bulk operations on keywords
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    const body: BulkKeywordOperation = await request.json()
    
    // Validate required fields
    if (!body.keywordIds || body.keywordIds.length === 0 || !body.operation) {
      return NextResponse.json({ error: 'Keyword IDs and operation are required' }, { status: 400 })
    }
    
    let result: any = null
    
    switch (body.operation) {
      case 'activate':
        result = await supabase
          .from('keywords')
          .update({ status: 'active' })
          .in('id', body.keywordIds)
          .eq('email_user', user.email)
        break
        
      case 'deactivate':
        result = await supabase
          .from('keywords')
          .update({ status: 'inactive' })
          .in('id', body.keywordIds)
          .eq('email_user', user.email)
        break
        
      case 'archive':
        result = await supabase
          .from('keywords')
          .update({ status: 'archived' })
          .in('id', body.keywordIds)
          .eq('email_user', user.email)
        break
        
      case 'delete':
        result = await supabase
          .from('keywords')
          .delete()
          .in('id', body.keywordIds)
          .eq('email_user', user.email)
        break
        
      case 'scrape':
        if (!body.scrapingType) {
          return NextResponse.json({ error: 'Scraping type is required for scrape operation' }, { status: 400 })
        }
        
        // For now, just return success without actually creating scraping jobs
        // TODO: Implement proper scraping job creation when tables are properly setup
        result = { data: null, error: null }
        
        break
        
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }
    
    if (result.error) {
      console.error(`Error in bulk ${body.operation}:`, result.error)
      return NextResponse.json({ error: `Failed to ${body.operation} keywords` }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      operation: body.operation,
      affected: body.keywordIds.length 
    })
    
  } catch (error) {
    console.error('Error in POST /api/keywords/bulk:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/keywords/bulk - Get bulk operation status
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // For now, return empty results since scraping jobs table is not properly setup
    return NextResponse.json({ 
      jobs: [],
      message: 'Bulk operation status tracking not yet implemented'
    })
    
  } catch (error) {
    console.error('Error in GET /api/keywords/bulk:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}