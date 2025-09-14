import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token generation and verification
export function generateToken(payload: any): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions)
}

export function verifyToken(token: string): any {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// Extract token from request
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (token && token.trim() !== '') {
      return token
    }
  }

  // Also check cookies
  const cookieToken = request.cookies.get('auth-token')?.value
  
  return cookieToken || null
}

// Common database verification function
async function verifyUserInDatabase(email: string, collections: string[]): Promise<{ isValid: boolean; user?: any }> {
  try {
    const { MongoClient } = await import('mongodb')
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    
    const db = client.db(process.env.MONGODB_DB)
    
    for (const collectionName of collections) {
      let user
      
      if (collectionName === 'super_admin') {
        user = await db.collection(collectionName).findOne({ email })
        if (user) {
          await client.close()
          return { 
            isValid: true, 
            user: { 
              ...user, 
              role: 'super_admin',
              id: user._id 
            } 
          }
        }
      } else if (collectionName === 'admins') {
        user = await db.collection(collectionName).findOne({ 
          email,
          status: 'approved'
        })
        if (user) {
          await client.close()
          return { 
            isValid: true, 
            user: { 
              ...user, 
              role: 'admin',
              id: user._id 
            } 
          }
        }
      }
    }
    
    await client.close()
    return { isValid: false }
    
  } catch (error) {
    console.error('Database verification error:', error)
    return { isValid: false }
  }
}

// Verify admin authentication
export async function verifyAdmin(request: NextRequest): Promise<{ isValid: boolean; user?: any }> {
  const token = extractTokenFromRequest(request)
  
  if (!token) {
    return { isValid: false }
  }
  
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return { isValid: false }
  }

  return await verifyUserInDatabase(decoded.email, ['super_admin', 'admins'])
}

// Verify general authentication
export async function verifyAuth(request: NextRequest): Promise<{ isValid: boolean; user?: any }> {
  const token = extractTokenFromRequest(request)
  if (!token) {
    return { isValid: false }
  }
  
  const decoded = verifyToken(token)
  if (!decoded) {
    return { isValid: false }
  }
  
  return { isValid: true, user: decoded }
}

// Verify super admin only
export async function verifySuperAdmin(request: NextRequest): Promise<{ isValid: boolean; user?: any }> {
  const token = extractTokenFromRequest(request)
  
  if (!token) {
    return { isValid: false }
  }
  
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return { isValid: false }
  }

  return await verifyUserInDatabase(decoded.email, ['super_admin'])
}

// Rate limiting helper
export function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  // This is a simple in-memory rate limiter
  // In production, you might want to use Redis or a similar solution
  const now = Date.now()
  const windowStart = now - windowMs
  
  // For now, return true (allow request)
  // You can implement proper rate limiting logic here
  return true
}
