import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'
import { verifyAdmin } from '@/lib/auth'

// GET - Get admin profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized', 401)
    }

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const collection = authResult.user.role === 'super_admin' ? 'super_admin' : 'admins'
    const user = await db.collection(collection).findOne(
      { email: authResult.user.email },
      { projection: { password: 0 } }
    )

    if (!user) {
      return error('User not found', 404)
    }

    return success({ user })
  } catch (e) {
    return error('Internal server error', 500)
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.isValid) {
      return error('Unauthorized', 401)
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return error('Name and email are required', 400)
    }

    if (!email.includes('@')) {
      return error('Invalid email format', 400)
    }

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const collection = authResult.user.role === 'super_admin' ? 'super_admin' : 'admins'

    // Check if email already exists (excluding current user)
    const existingUser = await db.collection(collection).findOne({
      email,
      _id: { $ne: authResult.user.id }
    })

    if (existingUser) {
      return error('Email already exists', 409)
    }

    // Update profile
    const result = await db.collection(collection).updateOne(
      { email: authResult.user.email },
      { 
        $set: { 
          name, 
          email, 
          updatedAt: new Date() 
        } 
      }
    )

    if (result.matchedCount === 0) {
      return error('User not found', 404)
    }

    return success({ message: 'Profile updated successfully' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}
