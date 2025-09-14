import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { translateService } from '@/lib/translationService'

// GET - Get service by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    // Get query parameters for language
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ar' // Default to Arabic
    
    // Validate language
    if (!['ar', 'en'].includes(lang)) {
      return NextResponse.json(
        { error: 'Invalid language. Use ar or en' },
        { status: 400 }
      )
    }
    
    // Get service by ID
    const service = await db.collection('services').findOne({ 
      _id: new ObjectId(id),
      status: 'active' // Only return active services
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    // Translate service to requested language
    const translatedService = translateService(service, lang as 'ar' | 'en')
    
    return NextResponse.json({
      success: true,
      service: {
        _id: service._id,
        name: translatedService.name,
        description: translatedService.description,
        features: translatedService.features,
        status: service.status,
        order: service.order,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Get service by ID error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
