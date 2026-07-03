import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'
import { ObjectId } from 'mongodb'
import { verifySuperAdmin } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized - Super Admin access required', 403)
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return error('Invalid id', 400)

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const res = await db.collection('admins').deleteOne({ _id: new ObjectId(id) })
    if (res.deletedCount === 0) return error('Admin not found', 404)

    return success({ message: 'Admin deleted' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


