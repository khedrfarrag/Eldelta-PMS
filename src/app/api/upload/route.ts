import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { GridFSBucket, ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Upload to MongoDB GridFS (works on Netlify)
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' })

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const filename = `product-specs-${timestamp}-${randomString}.pdf`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'application/pdf',
      metadata: { originalName: (file as any)?.name || filename }
    })

    await new Promise<void>((resolve, reject) => {
      uploadStream.end(buffer, (err?: Error | null) => {
        if (err) reject(err)
        else resolve()
      })
    })

    const id = uploadStream.id as ObjectId
    const origin = request.nextUrl.origin
    const fileUrl = `${origin}/api/upload?id=${id.toString()}`

    return NextResponse.json({ success: true, url: fileUrl, id: id.toString(), filename, size: file.size })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Serve files from GridFS by id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid file id' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' })

    // Find file info for headers
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray()
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    const fileDoc: any = files[0]

    const stream = bucket.openDownloadStream(new ObjectId(id))
    const headers = new Headers()
    headers.set('Content-Type', fileDoc.contentType || 'application/pdf')
    headers.set('Content-Disposition', `inline; filename="${fileDoc.filename || 'file.pdf'}"`)

    return new NextResponse(stream as any, { headers })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}

