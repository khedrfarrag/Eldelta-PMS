import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { 
  baseRequestSchema,
  importRequestSchema,
  exportRequestSchema,
  logisticsRequestSchema,
  suppliersRequestSchema
} from '@/lib/validations/serviceSchemas'

// POST - Create new service request
export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()

    // Validate base fields first (cheap checks)
    const baseParsed = baseRequestSchema.safeParse(raw)
    if (!baseParsed.success) {
      const first = baseParsed.error.issues?.[0]
      return NextResponse.json({ error: first?.message || 'البيانات غير صحيحة' }, { status: 400 })
    }

    // Determine service type (from payload or inferred from service name later)
    const providedServiceType = raw?.serviceType as string | undefined
    
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    // Validate serviceId format first
    if (!/^[0-9a-fA-F]{24}$/.test(baseParsed.data.serviceId)) {
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }

    // Validate service exists and get service name if not provided
    let service
    try {
      service = await db.collection('services').findOne({ _id: new ObjectId(baseParsed.data.serviceId) })
    } catch (error) {
      console.error('ObjectId conversion error:', error)
      return NextResponse.json(
        { error: 'Invalid service ID format' },
        { status: 400 }
      )
    }
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    // Infer serviceType if not provided using service name
    const inferType = (name?: string | any) => {
      // Handle both string and translation object formats
      let serviceName = '';
      if (typeof name === 'string') {
        serviceName = name;
      } else if (name && typeof name === 'object') {
        // Handle translation object format
        serviceName = name.ar || name.en || '';
      } else {
        serviceName = String(name || '');
      }
      
      const n = serviceName.toLowerCase()
      if (n.includes('استيراد') || n.includes('import')) return 'import'
      if (n.includes('تصدير') || n.includes('export')) return 'export'
      if (n.includes('شحن') || n.includes('نقل') || n.includes('logistics') || n.includes('لوجستي')) return 'logistics'
      if (n.includes('تخليص') || n.includes('جمرك') || n.includes('customs')) return 'suppliers'
      return 'suppliers' // Default to suppliers for other services
    }

    // Final service type
    const resolvedServiceType = (providedServiceType as any) || inferType(service?.name)

    // Helper function to get service name as string
    const getServiceName = (serviceName: any) => {
      if (typeof serviceName === 'string') {
        return serviceName;
      } else if (serviceName && typeof serviceName === 'object') {
        return serviceName.ar || serviceName.en || '';
      }
      return String(serviceName || '');
    };

    // Conditional validation by service type
    let parsed: any
    if (resolvedServiceType === 'import') {
      parsed = importRequestSchema.safeParse({ ...raw, serviceType: 'import', serviceName: raw?.serviceName || getServiceName(service?.name) })
    } else if (resolvedServiceType === 'export') {
      parsed = exportRequestSchema.safeParse({ ...raw, serviceType: 'export', serviceName: raw?.serviceName || getServiceName(service?.name) })
    } else if (resolvedServiceType === 'logistics') {
      // map logistics aliases to expected fields if needed
      const normalized = {
        ...raw,
        serviceType: 'logistics',
        serviceName: raw?.serviceName || getServiceName(service?.name),
        exportCountry: raw?.exportCountry || raw?.fromCountry,
        destinationCountry: raw?.destinationCountry || raw?.toCountry,
      }
      parsed = logisticsRequestSchema.safeParse(normalized)
      if (parsed.success) raw.exportCountry = normalized.exportCountry, raw.destinationCountry = normalized.destinationCountry
    } else {
      // suppliers
      parsed = suppliersRequestSchema.safeParse({ ...raw, serviceType: 'suppliers', serviceName: raw?.serviceName || getServiceName(service?.name) })
    }

    if (!parsed?.success) {
      const first = parsed?.error?.issues?.[0]
      return NextResponse.json({ error: first?.message || 'البيانات غير صحيحة' }, { status: 400 })
    }

    // Parse dates if provided
    let readyAt: Date | undefined
    let desiredAt: Date | undefined
    if (raw?.readyDate) {
      const d = new Date(raw.readyDate)
      if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid readyDate' }, { status: 400 })
      readyAt = d
    }
    if (raw?.desiredArrivalDate) {
      const d = new Date(raw.desiredArrivalDate)
      if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid desiredArrivalDate' }, { status: 400 })
      desiredAt = d
    }
    
    // Create request with all fields from parsed data
    const newRequest: any = {
      ...parsed.data,
      serviceId: parsed.data.serviceId,
      serviceName: parsed.data.serviceName || service.name,
      serviceType: resolvedServiceType,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (readyAt) newRequest.readyDate = readyAt
    if (desiredAt) newRequest.desiredArrivalDate = desiredAt
    
    const result = await db.collection('requests').insertOne(newRequest)
    
    return NextResponse.json({
      success: true,
      requestId: result.insertedId,
      message: 'Service request submitted successfully',
      request: {
        ...newRequest,
        _id: result.insertedId
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve requests (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const serviceId = searchParams.get('serviceId')
    const productType = searchParams.get('productType')
    const destinationCountry = searchParams.get('destinationCountry')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    if (serviceId && serviceId !== 'all') {
      filter.serviceId = serviceId
    }
    if (productType && productType !== 'all') {
      filter.productType = productType
    }
    if (destinationCountry && destinationCountry !== 'all') {
      filter.destinationCountry = destinationCountry
    }
    
    // Get requests with pagination
    const requests = await db.collection('requests')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Get total count
    const total = await db.collection('requests').countDocuments(filter)
    
    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        CurrentPage: page,
        PageSize: limit,
        TotalCount: total,
        TotalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
