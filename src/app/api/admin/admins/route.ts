import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { verifySuperAdmin, hashPassword } from '@/lib/auth'
import { env } from '@/config/env'

// GET - Get all admins (super admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      )
    }
    
    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)
    
    // Get all admins (excluding super admin)
    const admins = await db.collection('admins')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      admins
    })
    
  } catch (error) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new admin (super admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      )
    }
    
    const { name, email, password, role = 'admin' } = await request.json()
    
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
    
    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)
    
    // Check if email already exists
    const existingAdmin = await db.collection('admins').findOne({ email })
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create admin
    const newAdmin = {
      name,
      email,
      password: hashedPassword,
      role,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('admins').insertOne(newAdmin)
    
    // Remove password from response
    const { password: _, ...adminWithoutPassword } = newAdmin
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: { ...adminWithoutPassword, id: result.insertedId }
    })
    
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
