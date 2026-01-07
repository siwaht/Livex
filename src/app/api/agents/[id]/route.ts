import { NextRequest } from 'next/server'
import { getAgent, updateAgent, deleteAgent } from '@/lib/agents-store'
import { successResponse, errorResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = getAgent(params.id)
    if (!agent) {
      return notFoundResponse('Agent')
    }
    return successResponse(agent)
  } catch (error) {
    return errorResponse('Failed to fetch agent', 500, error)
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
    
    const updated = updateAgent(params.id, body)
    if (!updated) {
      return notFoundResponse('Agent')
    }
    
    return successResponse(updated)
  } catch (error) {
    return errorResponse('Failed to update agent', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteAgent(params.id)
    if (!deleted) {
      return notFoundResponse('Agent')
    }
    return successResponse({ success: true })
  } catch (error) {
    return errorResponse('Failed to delete agent', 500, error)
  }
}
