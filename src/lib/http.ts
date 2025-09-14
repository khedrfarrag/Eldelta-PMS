import { NextResponse } from 'next/server'

type Pagination = {
  CurrentPage: number
  PageSize: number
  TotalCount: number
  TotalPages: number
}

export function success<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...((data as unknown) as object) }, init)
}

export function error(message: string, status: number = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...(extra || {}) }, { status })
}

export function pagination<T extends object>(payload: T, total: number, page: number, limit: number) {
  const meta: Pagination = {
    CurrentPage: page,
    PageSize: limit,
    TotalCount: total,
    TotalPages: Math.ceil(total / limit) || 0,
  }
  return NextResponse.json({ success: true, ...payload, pagination: meta })
}


