import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { error, success } from '@/lib/http'
import { adminUpdateSchema } from '@/schemas/admin'
import { ObjectId } from 'mongodb'
import { verifySuperAdmin } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized - Super Admin access required', 403)
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return error('Invalid id', 400)

    const body = await request.json()
    const parsed = adminUpdateSchema.safeParse(body)
    if (!parsed.success) return error('Invalid payload', 400, { details: parsed.error.flatten() })
    const { name, email, status } = parsed.data

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const exists = await db.collection('admins').findOne({ email, _id: { $ne: new ObjectId(id) } })
    if (exists) return error('Email already exists', 409)

    const res = await db.collection('admins').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, status, updatedAt: new Date() } }
    )
    if (res.matchedCount === 0) return error('Admin not found', 404)

    return success({ message: 'Admin updated' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


