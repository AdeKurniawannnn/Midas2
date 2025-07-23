import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/database/supabase'
import { Keyword, KeywordFormData, KeywordFilters } from '@/lib/types/keywords'

// Get authenticated user from request
async function getAuthenticatedUser(request: NextRequest, requestBody?: any) {
  try {
    console.log('Getting authenticated user...')
    
    // Get user email from request headers (set by client)
    const userEmail = request.headers.get('x-user-email')
    const userId = request.headers.get('x-user-id')
    
    console.log('Headers:', { userEmail, userId })
    
    if (userEmail && userId) {
      console.log('Using user from headers:', userEmail)
      return {
        id: userId,
        email: userEmail
      }
    }
    
    // If request body contains currentUser, use that (from client-side auth)
    if (requestBody?.currentUser?.email && requestBody?.currentUser?.id) {
      console.log('Using currentUser from request body:', requestBody.currentUser.email)
      return {
        id: requestBody.currentUser.id,
        email: requestBody.currentUser.email
      }
    }
    
    // Try to get user from Supabase auth as fallback
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data, error } = await supabase.auth.getUser(token)
      
      if (data.user) {
        console.log('Using Supabase auth user:', data.user.email)
        return {
          id: data.user.id,
          email: data.user.email!
        }
      }
    }
    
    // Fallback to development user for testing only
    console.log('Using fallback development user')
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
    // Check if Supabase is configured
    if (!isSupabaseAvailable) {
      console.log('GET: Supabase not configured, returning mock data')
      return NextResponse.json({ 
        keywords: [],
        message: 'Mock data (Supabase not configured)',
        warning: 'No actual database connection - please configure Supabase environment variables'
      })
    }

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
    
    // Check if Supabase is configured
    if (!isSupabaseAvailable) {
      console.log('POST: Supabase not configured, returning mock success')
      return NextResponse.json({ 
        id: Math.floor(Math.random() * 1000),
        keyword: body.keyword,
        message: 'Mock create successful (Supabase not configured)',
        warning: 'No actual database creation occurred - please configure Supabase environment variables'
      })
    }

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
    
    // Check if Supabase is configured
    if (!isSupabaseAvailable) {
      console.log('PUT: Supabase not configured, returning mock success')
      return NextResponse.json({ 
        id: body.id,
        keyword: body.keyword,
        message: 'Mock update successful (Supabase not configured)',
        warning: 'No actual database update occurred - please configure Supabase environment variables'
      })
    }

    const user = await getAuthenticatedUser(request, body)
    
    // Validate required fields
    if (!body.id || !body.keyword || !body.category) {
      return NextResponse.json({ 
        error: 'ID, keyword and category are required'
      }, { status: 400 })
    }
    
    // Prepare update data (updated_at is handled by database trigger)
    const updateData = {
      keyword: body.keyword.trim(),
      description: body.description?.trim() || null,
      category: body.category,
      priority: body.priority || '1',
      status: body.status || 'active'
    }
    
    // Update keyword
    const { data, error } = await supabase
      .from('keywords')
      .update(updateData)
      .eq('id', body.id)
      .eq('email_user', user.email)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update keyword',
        details: error.message
      }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({ 
        error: 'Keyword not found or you do not have permission to update it'
      }, { status: 404 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error in PUT /api/keywords:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
    
    console.log('Attempting to delete keyword:', { id, user: user.email, isSupabaseAvailable })
    
    // First, check if keyword exists for this user
    const { data: existingKeyword, error: checkError } = await supabase
      .from('keywords')
      .select('*')
      .eq('id', parseInt(id))
      .eq('email_user', user.email)
      .single()
    
    console.log('Existing keyword check:', { existingKeyword, checkError })
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing keyword:', checkError)
      return NextResponse.json({ 
        error: 'Failed to check keyword existence',
        details: checkError.message 
      }, { status: 500 })
    }
    
    if (!existingKeyword) {
      console.log('Keyword not found for user:', { id, email: user.email })
      
      // Let's also check if keyword exists for any user
      const { data: anyKeyword, error: anyError } = await supabase
        .from('keywords')
        .select('id, email_user')
        .eq('id', parseInt(id))
        .single()
      
      console.log('Keyword exists for any user:', { anyKeyword, anyError })
      
      return NextResponse.json({ 
        error: 'Keyword not found or you do not have permission to delete it',
        details: {
          keywordId: id,
          userEmail: user.email,
          existsForAnyUser: !!anyKeyword
        }
      }, { status: 404 })
    }
    
    // Delete keyword from Supabase
    const { data, error } = await supabase
      .from('keywords')
      .delete()
      .eq('id', parseInt(id))
      .eq('email_user', user.email)
      .select()
    
    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ 
        error: 'Failed to delete keyword',
        details: error.message 
      }, { status: 500 })
    }
    
    if (!data || data.length === 0) {
      console.log('No rows deleted - keyword not found or not owned by user')
      return NextResponse.json({ 
        error: 'Keyword not found or you do not have permission to delete it' 
      }, { status: 404 })
    }
    
    console.log('Successfully deleted keyword from Supabase:', data[0])
    return NextResponse.json({ 
      success: true, 
      message: 'Keyword deleted successfully',
      deletedKeyword: data[0]
    })
    
  } catch (error) {
    console.error('Error in DELETE /api/keywords:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}