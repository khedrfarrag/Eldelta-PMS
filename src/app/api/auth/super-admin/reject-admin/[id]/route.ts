import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'
import { ObjectId } from 'mongodb'
import { verifySuperAdmin } from '@/lib/auth'
import { env } from '@/config/env'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized - Super Admin access required', 403)
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return error('Invalid id', 400)

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

    const res = await db.collection('admins').updateOne(
      { _id: new ObjectId(id), status: { $in: ['pending', 'verified'] } },
      { $set: { status: 'rejected', updatedAt: new Date() } }
    )
    if (res.matchedCount === 0) return error('Admin not found or already processed', 404)

    return success({ message: 'Admin rejected' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


