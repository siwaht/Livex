import { NextRequest } from 'next/server'
import { getUser, assignAgentToUser, removeAgentFromUser } from '@/lib/users-store'
import { getAgent, getAgentsByOwner } from '@/lib/agents-store'
import { successResponse, errorResponse, badRequestResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUser(params.id)
    if (!user) {
      return notFoundResponse('User')
    }
    
    const agents = getAgentsByOwner(params.id)
    return successResponse(agents)
  } catch (error) {
    return errorResponse('Failed to fetch user agents', 500, error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseJsonBody<{ agentId: string }>(request)

    if (!body || !body.agentId) {
      return badRequestResponse('agentId is required')
    }

    const agent = getAgent(body.agentId)
    if (!agent) {
      return notFoundResponse('Agent')
    }

    const updated = assignAgentToUser(params.id, body.agentId)
    if (!updated) {
      return notFoundResponse('User')
    }

    return successResponse(updated)
  } catch (error) {
    return errorResponse('Failed to assign agent', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseJsonBody<{ agentId: string }>(request)

    if (!body || !body.agentId) {
      return badRequestResponse('agentId is required')
    }

    const updated = removeAgentFromUser(params.id, body.agentId)
    if (!updated) {
      return notFoundResponse('User')
    }

    return successResponse(updated)
  } catch (error) {
    return errorResponse('Failed to remove agent', 500, error)
  }
}
