import { NextRequest } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { success, error } from '@/lib/http'
import { resendOtpSchema } from '@/schemas/otp'
import { generateNumericOtp, hashOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resendOtpSchema.safeParse(body)
    if (!parsed.success) {
      return error('Invalid payload', 400, { details: parsed.error.flatten() })
    }
    const { email } = parsed.data

    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)

    const admin = await db.collection('admins').findOne({ email })
    if (!admin) return error('Admin not found', 404)
    if (admin.status !== 'pending') return error('OTP not required', 400)

    // Check if OTP already exists and is not expired
    const existingOtp = await db.collection('admin_otps').findOne({ email })
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return error('OTP already sent and still valid', 400, {
        note: 'Please wait for the current OTP to expire or check your email'
      })
    }

    // Generate new OTP (1 minute expiry) - upsert in separate collection
    const otp = generateNumericOtp(6)
    const otpHash = hashOtp(otp)
    const expiresAt = new Date(Date.now() + 60 * 1000)

    await db.collection('admin_otps').updateOne(
      { email },
      { $set: { email, otpHash, expiresAt, createdAt: new Date() } },
      { upsert: true }
    )

    // Send OTP via email
    const emailSent = await sendOtpEmail(email, otp, admin.name)
    
    if (emailSent) {
      return success({ 
        message: 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني', 
        expiresInSeconds: 60,
        note: 'يرجى فحص بريدك الإلكتروني للحصول على رمز التحقق الجديد'
      })
    } else {
      // Fallback: return OTP in response for development/testing
      return success({ 
        message: 'تم إنشاء رمز تحقق جديد', 
        expiresInSeconds: 60, 
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        note: process.env.NODE_ENV === 'development' 
          ? 'خدمة البريد غير مفعلة، رمز التحقق: ' + otp 
          : 'يرجى التواصل مع الدعم'
      })
    }
  } catch (e) {
    return error('Internal server error', 500)
  }
}


