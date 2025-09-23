import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import { env } from '@/config/env'
import { ObjectId } from 'mongodb'
import { verifyAdmin, verifySuperAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Get one, Update, Delete for site review by id

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        if (!/^[0-9a-fA-F]{24}$/.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        const client = await getMongoClient()
        const db = client.db(env.MONGODB_DB)
        const doc = await db.collection('reviews').findOne({ _id: new ObjectId(id), scope: 'site' })
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, review: doc })
    } catch (error) {
        console.error('Get site review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        if (!/^[0-9a-fA-F]{24}$/.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        // Only admin/super-admin can update status or edit content
        const authResult = await verifyAdmin(request)
        if (!authResult.isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        const body = await request.json()
        const update: any = { updatedAt: new Date() }
        if (typeof body?.name === 'string') update.name = body.name.trim()
        if (typeof body?.comment === 'string') update.comment = body.comment.trim()
        if (typeof body?.locale === 'string') update.locale = body.locale.trim()
        if (typeof body?.rating !== 'undefined') {
            const rating = Number(body.rating)
            if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
            update.rating = rating
        }
        if (typeof body?.status === 'string') update.status = body.status

        const client = await getMongoClient()
        const db = client.db(env.MONGODB_DB)
        const res = await db.collection('reviews').findOneAndUpdate(
            { _id: new ObjectId(id), scope: 'site' },
            { $set: update },
            { returnDocument: 'after' }
        )
        if (!res.value) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, review: res.value })
    } catch (error) {
        console.error('Update site review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        if (!/^[0-9a-fA-F]{24}$/.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        // Only super admin can delete
        const superAuth = await verifySuperAdmin(request)
        if (!superAuth.isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        const client = await getMongoClient()
        const db = client.db(env.MONGODB_DB)
        const res = await db.collection('reviews').deleteOne({ _id: new ObjectId(id), scope: 'site' })
        if (res.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete site review error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


