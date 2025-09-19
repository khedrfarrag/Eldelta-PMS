import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { env } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()
    
    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }
    
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }
    
    const client = await getMongoClient()
    const db = client.db(env.MONGODB_DB)
    
    // Create contact message
    const contactMessage = {
      name,
      email,
      message,
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('contacts').insertOne(contactMessage)
    
    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
      message: 'Message sent successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
