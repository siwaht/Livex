import { NextRequest } from 'next/server'
import { getUser, updateUser, deleteUser } from '@/lib/users-store'
import { successResponse, errorResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUser(params.id)
    if (!user) {
      return notFoundResponse('User')
    }
    // Mask secret for security
    const safeUser = {
      ...user,
      livekit: user.livekit ? { ...user.livekit, apiSecret: '••••••••' } : null
    }
    return successResponse(safeUser)
  } catch (error) {
    return errorResponse('Failed to fetch user', 500, error)
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
    
    const updated = updateUser(params.id, body)
    if (!updated) {
      return notFoundResponse('User')
    }
    
    return successResponse(updated)
  } catch (error) {
    return errorResponse('Failed to update user', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteUser(params.id)
    if (!deleted) {
      return notFoundResponse('User')
    }
    return successResponse({ success: true })
  } catch (error) {
    return errorResponse('Failed to delete user', 500, error)
  }
}
