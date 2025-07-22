import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database/supabase'
import { Keyword, KeywordFormData, KeywordFilters } from '@/lib/types/keywords'

// Get authenticated user from request body or use fallback
async function getAuthenticatedUser(request: NextRequest, requestBody?: any) {
  try {
    // If request body contains currentUser, use that (from client-side auth)
    if (requestBody?.currentUser?.email && requestBody?.currentUser?.id) {
      return {
        id: requestBody.currentUser.id,
        email: requestBody.currentUser.email
      }
    }
    
    // Fallback to development user for testing
    return {
      id: 'ed3c9095-7ba1-40db-9e38-c30f80151fa5',
      email: 'test@gmail.com'
    }
  } catch (err) {
    console.error('getAuthenticatedUser error:', err)
    throw new Error('Authentication required')
  }
}

// GET /api/keywords - Get all keywords for user
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status') as 'active' | 'inactive' | 'archived'
    const priority = searchParams.get('priority')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Build query - use email_user for filtering instead of user_id
    let query = supabase
      .from('keywords')
      .select('*')
      .eq('email_user', user.email)
    
    // Apply filters
    if (search) {
      query = query.or(`keyword.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data: keywords, error, count } = await query
    
    if (error) {
      console.error('Error fetching keywords:', error)
      return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 })
    }
    
    return NextResponse.json({
      keywords: keywords || [],
      total: count || 0,
      page,
      limit
    })
    
  } catch (error) {
    console.error('Error in GET /api/keywords:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/keywords - Create new keyword
export async function POST(request: NextRequest) {
  try {
    const body: KeywordFormData = await request.json()
    const user = await getAuthenticatedUser(request, body)
    
    // Validate required fields
    if (!body.keyword || !body.category) {
      return NextResponse.json({ error: 'Keyword and category are required' }, { status: 400 })
    }
    
    // Prepare data for insertion
    const insertData = {
      keyword: body.keyword.trim(),
      description: body.description?.trim() || null,
      category: body.category,
      priority: body.priority || '1',
      status: body.status || 'active',
      email_user: user.email
    }
    
    // Insert to Supabase
    const { data, error } = await supabase
      .from('keywords')
      .insert([insertData])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ 
        error: 'Failed to create keyword',
        details: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('POST /api/keywords error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/keywords - Update keyword
export async function PUT(request: NextRequest) {
  try {
    const body: KeywordFormData & { id: number } = await request.json()
    const user = await getAuthenticatedUser(request, body)
    
    // Validate required fields
    if (!body.id || !body.keyword || !body.category) {
      return NextResponse.json({ error: 'ID, keyword and category are required' }, { status: 400 })
    }
    
    // Update keyword
    const { data, error } = await supabase
      .from('keywords')
      .update({
        keyword: body.keyword.trim(),
        description: body.description?.trim(),
        category: body.category,
        priority: body.priority || '1',
        status: body.status || 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .eq('email_user', user.email)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating keyword:', error)
      return NextResponse.json({ error: 'Failed to update keyword' }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error in PUT /api/keywords:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/keywords - Delete keyword
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Delete keyword (cascading delete will handle assignments)
    const { error } = await supabase
      .from('keywords')
      .delete()
      .eq('id', parseInt(id))
      .eq('email_user', user.email)
    
    if (error) {
      console.error('Error deleting keyword:', error)
      return NextResponse.json({ error: 'Failed to delete keyword' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error in DELETE /api/keywords:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}