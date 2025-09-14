import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { pagination, error } from '@/lib/http'
import { verifySuperAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized - Super Admin access required', 403)
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const status = searchParams.get('status')
    const email = searchParams.get('email')
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const filter: Record<string, unknown> = {}
    if (status && status !== 'all') filter.status = status
    if (email) filter.email = email

    const cursor = db.collection('admins').find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    const [items, total] = await Promise.all([
      cursor.toArray(),
      db.collection('admins').countDocuments(filter),
    ])

    return pagination({ admins: items }, total, page, limit)
  } catch (e) {
    return error('Internal server error', 500)
  }
}


