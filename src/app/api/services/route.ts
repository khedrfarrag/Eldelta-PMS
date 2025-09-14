import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { translateService } from '@/lib/translationService'

// GET - Get all services (public) with language support
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const lang = searchParams.get('lang') || 'ar' // Default to Arabic
    
    // Validate language
    if (!['ar', 'en'].includes(lang)) {
      return NextResponse.json(
        { error: 'Invalid language. Use ar or en' },
        { status: 400 }
      )
    }
    
    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    
    // Get services
    const services = await db.collection('services')
      .find(filter)
      .sort({ order: 1 })
      .toArray()
    
    // Translate services to requested language
    const translatedServices = services.map(service => 
      translateService(service, lang as 'ar' | 'en')
    )
    
    return NextResponse.json({
      success: true,
      services: translatedServices,
      language: lang
    })
    
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
