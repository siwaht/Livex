import { NextRequest, NextResponse } from 'next/server'
import { generateToken, getLiveKitUrl } from '@/lib/livekit'
import { getAgent } from '@/lib/agents-store'
import { getUser } from '@/lib/users-store'

export async function POST(request: NextRequest) {
  try {
    const { agentId, userName, userId } = await request.json()

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    const agent = getAgent(agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    if (agent.status !== 'active') {
      return NextResponse.json({ error: 'Agent is not active' }, { status: 400 })
    }

    // Get user's LiveKit credentials if userId provided
    let credentials = null
    if (userId) {
      const user = getUser(userId)
      if (user?.livekit) {
        credentials = user.livekit
      }
    } else if (agent.ownerId) {
      // Use agent owner's credentials
      const owner = getUser(agent.ownerId)
      if (owner?.livekit) {
        credentials = owner.livekit
      }
    }

    const roomName = `${agentId}-${Date.now()}`
    const participantIdentity = `user-${Date.now()}`
    const participantName = userName || 'User'

    const token = await generateToken(roomName, participantIdentity, participantName, credentials)

    return NextResponse.json({
      token,
      wsUrl: getLiveKitUrl(credentials),
      roomName,
      participantIdentity,
      agentName: agent.name,
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}
