import { NextRequest } from 'next/server'
import { getSIPTrunk, updateSIPTrunk, deleteSIPTrunk } from '@/lib/telephony-store'
import { successResponse, errorResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trunk = getSIPTrunk(params.id)
    if (!trunk) {
      return notFoundResponse('SIP trunk')
    }
    // Mask password
    return successResponse({ ...trunk, password: trunk.password ? '••••••••' : undefined })
  } catch (error) {
    return errorResponse('Failed to fetch SIP trunk', 500, error)
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
    
    const updated = updateSIPTrunk(params.id, body)
    if (!updated) {
      return notFoundResponse('SIP trunk')
    }
    return successResponse({ ...updated, password: updated.password ? '••••••••' : undefined })
  } catch (error) {
    return errorResponse('Failed to update SIP trunk', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteSIPTrunk(params.id)
    if (!deleted) {
      return notFoundResponse('SIP trunk')
    }
    return successResponse({ success: true })
  } catch (error) {
    return errorResponse('Failed to delete SIP trunk', 500, error)
  }
}
