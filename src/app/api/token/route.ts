import { NextRequest } from 'next/server'
import { generateToken, getLiveKitUrl } from '@/lib/livekit'
import { getAgent } from '@/lib/agents-store'
import { getUser } from '@/lib/users-store'
import { successResponse, errorResponse, badRequestResponse, notFoundResponse, parseJsonBody } from '@/lib/api-utils'

interface TokenRequest {
  agentId: string
  userName?: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<TokenRequest>(request)
    
    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    const { agentId, userName, userId } = body

    if (!agentId) {
      return badRequestResponse('Agent ID is required')
    }

    const agent = getAgent(agentId)
    if (!agent) {
      return notFoundResponse('Agent')
    }

    if (agent.status !== 'active') {
      return badRequestResponse('Agent is not active')
    }

    // Get user's LiveKit credentials if userId provided
    let credentials = null
    if (userId) {
      const user = getUser(userId)
      if (user?.livekit) {
        credentials = user.livekit
      }
    } else if (agent.ownerId) {
      const owner = getUser(agent.ownerId)
      if (owner?.livekit) {
        credentials = owner.livekit
      }
    }

    const roomName = `${agentId}-${Date.now()}`
    const participantIdentity = `user-${Date.now()}`
    const participantName = userName || 'User'

    const token = await generateToken(roomName, participantIdentity, participantName, credentials)

    return successResponse({
      token,
      wsUrl: getLiveKitUrl(credentials),
      roomName,
      participantIdentity,
      agentName: agent.name,
    })
  } catch (error) {
    return errorResponse('Failed to generate token', 500, error)
  }
}
