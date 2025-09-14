import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { error, success } from '@/lib/http'
import { resetPasswordSchema } from '@/schemas/password'
import { hashResetToken } from '@/lib/reset-token'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) return error('Invalid payload', 400, { details: parsed.error.flatten() })

    const { token, newPassword } = parsed.data
    const tokenHash = hashResetToken(token)

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const rec = await db.collection('password_resets').findOne({ tokenHash })
    if (!rec || !rec.expiresAt || new Date(rec.expiresAt) < new Date()) {
      return error('Invalid or expired token', 400)
    }

    const email = rec.email
    const newHashed = await hashPassword(newPassword)

    const adminRes = await db.collection('admins').updateOne({ email }, { $set: { password: newHashed, updatedAt: new Date() } })
    const superRes = adminRes.matchedCount === 0
      ? await db.collection('super_admin').updateOne({ email }, { $set: { password: newHashed, updatedAt: new Date() } })
      : null

    if (adminRes.matchedCount === 0 && (!superRes || superRes.matchedCount === 0)) {
      return error('User not found', 404)
    }

    // Consume token
    await db.collection('password_resets').deleteOne({ tokenHash })

    return success({ message: 'Password reset successful' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


