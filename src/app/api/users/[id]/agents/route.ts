import { NextRequest, NextResponse } from 'next/server'
import { getUser, assignAgentToUser, removeAgentFromUser } from '@/lib/users-store'
import { getAgent, getAgentsByOwner } from '@/lib/agents-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser(params.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  const agents = getAgentsByOwner(params.id)
  return NextResponse.json(agents)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { agentId } = await request.json()

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 })
    }

    const agent = getAgent(agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const updated = assignAgentToUser(params.id, agentId)
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Assign agent error:', error)
    return NextResponse.json(
      { error: 'Failed to assign agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { agentId } = await request.json()

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 })
    }

    const updated = removeAgentFromUser(params.id, agentId)
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Remove agent error:', error)
    return NextResponse.json(
      { error: 'Failed to remove agent' },
      { status: 500 }
    )
  }
}
