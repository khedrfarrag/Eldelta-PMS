import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import { env } from '@/config/env'
import { verifyAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Create and List site-wide reviews (not tied to a specific service)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const name = (body?.name || '').toString().trim()
        const rating = Number(body?.rating)
        const comment = (body?.comment || '').toString().trim()
        const locale = (body?.locale || 'ar').toString().trim()

        if (!name || !rating || rating < 1 || rating > 5 || !comment) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const client = await getMongoClient()
        const db = client.db(env.MONGODB_DB)
        const now = new Date()
        const doc = {
            scope: 'site',
            name,
            rating,
            comment,
            locale,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        }
        const res = await db.collection('reviews').insertOne(doc)
        return NextResponse.json({ success: true, id: res.insertedId, review: doc }, { status: 201 })
    } catch (error) {
        console.error('Create site review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = (searchParams.get('status') || 'approved').toString()
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const client = await getMongoClient()
        const db = client.db(env.MONGODB_DB)

        const filter: any = { scope: 'site' }
        if (status && status !== 'all') filter.status = status

        // Permissions: public can only see approved; admin can query any status
        if (status !== 'approved') {
            const authResult = await verifyAdmin(request)
            if (!authResult.isValid) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        const items = await db.collection('reviews')
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray()
        const total = await db.collection('reviews').countDocuments(filter)

        // summary (respect same filter)
        const agg = await db.collection('reviews').aggregate([
            { $match: filter },
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]).toArray()
        const summary = { average: agg[0]?.avg ?? 0, count: agg[0]?.count ?? 0 }

        return NextResponse.json({ success: true, reviews: items, pagination: { page, limit, total }, summary })
    } catch (error) {
        console.error('List site reviews error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


