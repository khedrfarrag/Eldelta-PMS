import { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { success, error } from '@/lib/http'
import { verifyOtpSchema } from '@/schemas/otp'
import { hashOtp, isExpired } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = verifyOtpSchema.safeParse(body)
    if (!parsed.success) {
      return error('Invalid payload', 400, { details: parsed.error.flatten() })
    }
    const { email, otp } = parsed.data

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const admin = await db.collection('admins').findOne({ email })
    if (!admin) return error('Admin not found', 404)
    if (admin.status !== 'pending') return error('OTP not required', 400)

    const otpRec = await db.collection('admin_otps').findOne({ email })
    if (!otpRec) return error('OTP not found', 404)
    if (isExpired(otpRec.expiresAt)) return error('OTP expired', 400)

    const otpHash = hashOtp(otp)
    if (otpHash !== otpRec.otpHash) return error('Invalid OTP', 400)

    // Mark admin as verified (still needs super admin approval)
    await db.collection('admins').updateOne(
      { email },
      { $set: { status: 'verified', updatedAt: new Date() } }
    )

    // Clean up OTP
    await db.collection('admin_otps').deleteOne({ email })

    return success({ message: 'OTP verified. Await super admin approval.' })
  } catch (e) {
    return error('Internal server error', 500)
  }
}


