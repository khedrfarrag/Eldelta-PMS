import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { error, success } from '@/lib/http'
import { forgotPasswordSchema } from '@/schemas/password'
import { generateResetToken } from '@/lib/reset-token'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) return error('Invalid payload', 400, { details: parsed.error.flatten() })
    const { email } = parsed.data

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    // Check existence in either collection
    const admin = await db.collection('admins').findOne({ email })
    const superAdmin = admin ? null : await db.collection('super_admin').findOne({ email })
    if (!admin && !superAdmin) {
      // do not reveal existence
      return success({ message: 'If the email exists, a reset link will be sent.' })
    }

    const { token, hash, expiresAt } = generateResetToken()
    await db.collection('password_resets').updateOne(
      { email },
      { $set: { email, tokenHash: hash, expiresAt, createdAt: new Date() } },
      { upsert: true }
    )

    // Send password reset email
    const user = admin || superAdmin
    if (!user) {
      return success({ message: 'If the email exists, a reset link will be sent.' })
    }
    
    const emailSent = await sendPasswordResetEmail(email, token, user.name)
    
    if (emailSent) {
      return success({ message: 'Password reset link sent to your email' })
    } else {
      // Fallback for development/testing
      return success({ 
        message: 'Password reset link generated but email failed', 
        debugToken: process.env.NODE_ENV === 'development' ? token : undefined,
        note: process.env.NODE_ENV === 'development' ? 'Email service not configured, check debugToken field' : 'Please contact support'
      })
    }
  } catch (e) {
    return error('Internal server error', 500)
  }
}


