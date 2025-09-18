import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { hashPassword } from '@/lib/auth'
import { generateNumericOtp, hashOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }
    
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }
    
    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)
    
    // Check if email already exists in admins or super_admin collections
    const existingAdmin = await db.collection('admins').findOne({ email })
    const existingSuperAdmin = await db.collection('super_admin').findOne({ email })
    
    if (existingAdmin || existingSuperAdmin) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create new admin with pending status
    const newAdmin = {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('admins').insertOne(newAdmin)
    
    // Generate and send OTP automatically
    const otp = generateNumericOtp(6)
    const otpHash = hashOtp(otp)
    const expiresAt = new Date(Date.now() + 60 * 1000) // 1 minute
    
    // Store OTP
    await db.collection('admin_otps').insertOne({
      email,
      otpHash,
      expiresAt,
      createdAt: new Date()
    })
    
    // Send OTP email
    const emailSent = await sendOtpEmail(email, otp, name)
    
    // Remove password from response
    const { password: _, ...adminWithoutPassword } = newAdmin
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        admin: {
          ...adminWithoutPassword,
          _id: result.insertedId
        },
        message: 'تم التسجيل بنجاح! تم إرسال رمز التحقق إلى بريدك الإلكتروني.',
        note: 'يرجى فحص بريدك الإلكتروني للحصول على رمز التحقق'
      }, { status: 201 })
    } else {
      // Fallback: return OTP in response for development/testing
      return NextResponse.json({
        success: true,
        admin: {
          ...adminWithoutPassword,
          _id: result.insertedId
        },
        message: 'تم التسجيل بنجاح! تم إنشاء رمز التحقق.',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        note: process.env.NODE_ENV === 'development' 
          ? 'خدمة البريد غير مفعلة، رمز التحقق: ' + otp 
          : 'يرجى التواصل مع الدعم للحصول على رمز التحقق'
      }, { status: 201 })
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
