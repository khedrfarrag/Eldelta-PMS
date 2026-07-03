import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { env } from '@/config/env'
// Removed runtime translation. Optionally keep create-on-write later.

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

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

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
    
    // Add search filter - support both string and localized object fields
    if (search && search.trim()) {
      const regex = { $regex: search, $options: 'i' }
      filter.$or = [
        // String fields
        { name: regex },
        { description: regex },
        // Localized object fields
        { 'name.ar': regex },
        { 'name.en': regex },
        { 'description.ar': regex },
        { 'description.en': regex },
        // Features array (either strings or localized objects)
        { features: regex },
        { 'features.ar': regex },
        { 'features.en': regex },
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

    // Map by stored language fields
    const mapped = services.map((s: any) => ({
      _id: s._id,
      name: typeof s.name === 'object' ? (s.name[lang] || s.name.ar || s.name.en || '') : s.name,
      description: typeof s.description === 'object' ? (s.description[lang] || s.description.ar || s.description.en || '') : s.description,
      features: Array.isArray(s.features)
        ? s.features.map((f: any) => (typeof f === 'object' ? (f[lang] || f.ar || f.en || '') : f))
        : [],
      status: s.status,
      order: s.order,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      services: mapped,
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

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

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

    // Store as provided (admin supplies localized content per policy)
    const doc = {
      name,
      description,
      features,
      status: status || 'active',
      order: serviceOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('services').insertOne(doc)

    if (result.insertedId) {
      const created = await db.collection('services').findOne({ _id: result.insertedId })
      return NextResponse.json({
        success: true,
        message: 'Service created successfully',
        service: created
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