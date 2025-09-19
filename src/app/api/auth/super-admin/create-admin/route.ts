import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'
import { adminCreateSchema } from '@/schemas/admin'
import { hashPassword, verifySuperAdmin } from '@/lib/auth'
import { env } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized - Super Admin access required', 403)
    }

    const body = await request.json()
    const parsed = adminCreateSchema.safeParse(body)
    if (!parsed.success) return error('Invalid payload', 400, { details: parsed.error.flatten() })
    const { name, email, password, status } = parsed.data

    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)

    const exists = await db.collection('admins').findOne({ email })
    const existsSuper = await db.collection('super_admin').findOne({ email })
    if (exists || existsSuper) return error('Email already exists', 409)

    const hashedPassword = await hashPassword(password)
    const doc = {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: status || 'approved',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const res = await db.collection('admins').insertOne(doc)
    return success({ adminId: res.insertedId, message: 'Admin created' }, { status: 201 })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


