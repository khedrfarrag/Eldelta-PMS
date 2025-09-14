import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

// Common validation functions
export function validateEmail(email: string): boolean {
  return email.includes('@') && email.length > 5
}

export function validateServiceData(data: any): { isValid: boolean; error?: string } {
  const { name, description, features } = data
  
  if (!name || !description || !features || !Array.isArray(features)) {
    return { isValid: false, error: 'Name, description and features array are required' }
  }
  
  if (name.length < 3) {
    return { isValid: false, error: 'Service name must be at least 3 characters long' }
  }
  
  if (description.length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters long' }
  }
  
  if (features.length === 0) {
    return { isValid: false, error: 'At least one feature is required' }
  }
  
  return { isValid: true }
}

export function validateObjectId(id: string): boolean {
  return ObjectId.isValid(id)
}

// Common error responses
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function badRequestResponse(message: string = 'Bad Request') {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function notFoundResponse(message: string = 'Not Found') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function conflictResponse(message: string = 'Conflict') {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function internalServerErrorResponse(message: string = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 })
}

// Common success responses
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, ...data }, { status })
}

export function createdResponse(data: any) {
  return NextResponse.json({ success: true, ...data }, { status: 201 })
}

// Pagination helper
export function getPaginationData(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

// Filter builder
export function buildFilter(searchParams: URLSearchParams, allowedFields: string[]) {
  const filter: any = {}
  
  allowedFields.forEach(field => {
    const value = searchParams.get(field)
    if (value && value !== 'all') {
      filter[field] = value
    }
  })
  
  return filter
}

// Pagination response
export function createPaginationResponse(data: any[], total: number, page: number, limit: number) {
  return {
    success: true,
    data,
    pagination: {
      CurrentPage: page,
      PageSize: limit,
      TotalCount: total,
      TotalPages: Math.ceil(total / limit)
    }
  }
}
