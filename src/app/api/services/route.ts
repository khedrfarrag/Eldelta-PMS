import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
// Translation at read-time is removed. Services store {ar,en} and we select by lang.

// GET - Get all services (public) with language support
export async function GET(request: NextRequest) {
  try {
    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const lang = searchParams.get('lang') || 'ar' // Default to Arabic
    
    // Validate language
    if (!['ar', 'en'].includes(lang)) {
      return NextResponse.json(
        { error: 'Invalid language. Use ar or en' },
        { status: 400 }
      )
    }
    
    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    
    // Get services
    const services = await db.collection('services')
      .find(filter)
      .sort({ order: 1 })
      .toArray()
    
    // Map services to requested language directly from stored fields
    const mapped = services.map((s: any) => ({
      _id: s._id,
      name: typeof s.name === 'object' ? (s.name[lang] || s.name.ar || s.name.en || '') : s.name,
      description: typeof s.description === 'object' ? (s.description[lang] || s.description.ar || s.description.en || '') : s.description,
      features: Array.isArray(s.features)
        ? s.features.map((f: any) => (typeof f === 'object' ? (f[lang] || f.ar || f.en || '') : f))
        : [],
      status: s.status,
      order: s.order,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({ success: true, services: mapped, language: lang })
    
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
