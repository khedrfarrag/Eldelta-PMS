import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { error, success } from '@/lib/http'
import { changePasswordSchema } from '@/schemas/password'
import { verifyPassword, hashPassword } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = changePasswordSchema.safeParse(body)
    if (!parsed.success) return error('Invalid payload', 400, { details: parsed.error.flatten() })

    const role = request.headers.get('x-user-role') || ''
    const email = request.headers.get('x-user-email') || ''
    if (!email) return error('Unauthorized', 401)
    if (role !== 'admin' && role !== 'super_admin') return error('Forbidden', 403)

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const collection = role === 'super_admin' ? 'super_admin' : 'admins'
    const user = await db.collection(collection).findOne({ email })
    if (!user) return error('User not found', 404)

    const valid = await verifyPassword(parsed.data.currentPassword, user.password)
    if (!valid) return error('Current password is incorrect', 400)

    const newHashed = await hashPassword(parsed.data.newPassword)
    await db.collection(collection).updateOne({ email }, { $set: { password: newHashed, updatedAt: new Date() } })

    return success({ message: 'Password changed successfully' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


