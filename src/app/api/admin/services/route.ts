import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { createServiceWithTranslations, translateService } from '@/lib/translationService'

// GET - Get all services (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'all'
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const lang = url.searchParams.get('lang') || 'ar'
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    
    // Add search filter
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get services with pagination
    const services = await db.collection('services')
      .find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const total = await db.collection('services').countDocuments(filter)

    // Translate services to requested language
    const translatedServices = services.map((service: any) => 
      translateService(service, lang as 'ar' | 'en')
    )

    return NextResponse.json({
      success: true,
      services: translatedServices,
      pagination: {
        CurrentPage: page,
        PageSize: limit,
        TotalCount: total,
        TotalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new service (super admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      )
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const body = await request.json()
    const { name, description, features, status, order } = body

    // Validate required fields
    if (!name || !description || !features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, features' },
        { status: 400 }
      )
    }

    // Get next order number if not provided
    let serviceOrder = order
    if (!serviceOrder) {
      const lastService = await db.collection('services')
        .findOne({}, { sort: { order: -1 } })
      serviceOrder = lastService ? lastService.order + 1 : 1
    }

    // Create service with translations using hybrid approach
    const newService = await createServiceWithTranslations({
      name,
      description,
      features,
      status: status || 'active',
      order: serviceOrder
    })

    const result = await db.collection('services').insertOne({
      ...newService,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (result.insertedId) {
      return NextResponse.json({
        success: true,
        message: 'Service created successfully',
        serviceId: result.insertedId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}