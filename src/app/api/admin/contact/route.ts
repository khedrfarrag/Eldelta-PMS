import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET - Get all contact messages (admin only)
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
    const db = client.db(process.env.MONGODB_DB)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    // Get contact messages with pagination
    const contacts = await db.collection('contacts')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const total = await db.collection('contacts').countDocuments(filter)

    return NextResponse.json({
      success: true,
      contacts,
      pagination: {
        CurrentPage: page,
        PageSize: limit,
        TotalCount: total,
        TotalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update contact message status (super admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, status, notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    // Update contact message
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          notes: notes || '',
          updatedAt: new Date(),
          updatedBy: authResult.user.email
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message status updated successfully'
    })

  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a contact message (super admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email, message, phone } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const contactMessage = {
      name,
      email,
      phone: phone || '',
      message,
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: authResult.user.email
    }

    const result = await db.collection('contacts').insertOne(contactMessage)

    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
      message: 'Contact message created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create contact (admin) error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
