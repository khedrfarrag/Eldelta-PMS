import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET /api/admin/contact/:id - get single contact (admin & super_admin)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) })
    if (!contact) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error('Get contact by id error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/contact/:id - update contact (super_admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()

    const allowed: Record<string, boolean> = {
      name: true,
      email: true,
      phone: true,
      message: true,
      status: true,
      notes: true,
    }
    const $set: Record<string, unknown> = { updatedAt: new Date(), updatedBy: authResult.user.email }
    for (const key of Object.keys(payload)) {
      if (allowed[key]) {
        $set[key] = payload[key]
      }
    }

    if (Object.keys($set).length <= 2) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Contact updated successfully' })
  } catch (error) {
    console.error('Update contact by id error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/contact/:id - delete contact (super_admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Delete contact by id error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


