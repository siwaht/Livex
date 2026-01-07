import { NextResponse } from 'next/server'

// Standard API response helpers
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 500, details?: unknown) {
  console.error(`API Error [${status}]:`, message, details)
  return NextResponse.json(
    { error: message, ...(process.env.NODE_ENV === 'development' && details ? { details } : {}) },
    { status }
  )
}

export function notFoundResponse(resource = 'Resource') {
  return errorResponse(`${resource} not found`, 404)
}

export function badRequestResponse(message: string) {
  return errorResponse(message, 400)
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401)
}

export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(message, 403)
}

export function rateLimitResponse() {
  return errorResponse('Too many requests', 429)
}

// Request validation
export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

// Rate limiting helper (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  limit = 60,
  windowMs = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''))
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = []
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(String(field))
    }
  }
  return { valid: missing.length === 0, missing }
}

// CORS headers for API routes
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// Pagination helper
export function paginate<T>(
  items: T[],
  page = 1,
  limit = 20
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const data = items.slice(start, start + limit)
  
  return {
    data,
    pagination: { page, limit, total, totalPages }
  }
}
