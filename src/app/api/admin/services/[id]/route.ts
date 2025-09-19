import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { env } from '@/config/env'
// Removed translate-on-update. We accept multilingual objects directly.

// GET - Get single service by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

    const service = await db.collection('services').findOne({ 
      _id: new ObjectId(id) 
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      service
    })

  } catch (error) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update service (super admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      )
    }

    const { name, description, features, status, order } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      )
    }

    // Basic validation
    if (!name || !description || !features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Name, description and features array are required' },
        { status: 400 }
      )
    }

    if (name.length < 3) {
      return NextResponse.json(
        { error: 'Service name must be at least 3 characters long' },
        { status: 400 }
      )
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (features.length === 0) {
      return NextResponse.json(
        { error: 'At least one feature is required' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

    // Check if service exists
    const existingService = await db.collection('services').findOne({ 
      _id: new ObjectId(id) 
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if new name conflicts with other services
    const nameConflict = await db.collection('services').findOne({
      name,
      _id: { $ne: new ObjectId(id) }
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Service with this name already exists' },
        { status: 409 }
      )
    }

    // Accept multilingual objects (e.g., { ar, en }) or strings as-is
    const updateData: any = {
      name,
      description,
      features,
      status: status || existingService.status,
      order: order || existingService.order,
      updatedAt: new Date()
    }

    const result = await db.collection('services').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service: {
        _id: id,
        ...updateData
      }
    })

  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service (super admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

    // Check if service exists
    const existingService = await db.collection('services').findOne({ 
      _id: new ObjectId(id) 
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if service is linked to any requests
    const linkedRequests = await db.collection('requests').countDocuments({
      serviceId: id
    })

    if (linkedRequests > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service that has linked requests' },
        { status: 400 }
      )
    }

    // Delete service
    const result = await db.collection('services').deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })

  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
