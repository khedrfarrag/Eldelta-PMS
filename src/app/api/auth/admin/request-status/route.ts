import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    if (!email) return error('Email is required', 400)

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const admin = await db.collection('admins').findOne({ email })
    if (!admin) return error('Admin not found', 404)

    const { status, rejectionReason } = admin
    return success({ email, status, rejectionReason: rejectionReason || null })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


