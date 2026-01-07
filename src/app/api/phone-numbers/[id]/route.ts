import { NextRequest } from 'next/server'
import { getPhoneNumber, updatePhoneNumber, deletePhoneNumber } from '@/lib/telephony-store'
import { successResponse, errorResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const phoneNumber = getPhoneNumber(params.id)
    if (!phoneNumber) {
      return notFoundResponse('Phone number')
    }
    return successResponse(phoneNumber)
  } catch (error) {
    return errorResponse('Failed to fetch phone number', 500, error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseJsonBody<Record<string, unknown>>(request)
    if (!body) {
      return errorResponse('Invalid JSON body', 400)
    }
    
    const updated = updatePhoneNumber(params.id, body)
    if (!updated) {
      return notFoundResponse('Phone number')
    }
    return successResponse(updated)
  } catch (error) {
    return errorResponse('Failed to update phone number', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deletePhoneNumber(params.id)
    if (!deleted) {
      return notFoundResponse('Phone number')
    }
    return successResponse({ success: true })
  } catch (error) {
    return errorResponse('Failed to delete phone number', 500, error)
  }
}
