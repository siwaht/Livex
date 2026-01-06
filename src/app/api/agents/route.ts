import { NextRequest, NextResponse } from 'next/server'
import { getAllAgents, createAgent } from '@/lib/agents-store'

export async function GET() {
  const agents = getAllAgents()
  return NextResponse.json(agents)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, welcomeMessage, instructions, voice } = body

    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      )
    }

    const agent = createAgent({
      name,
      displayName,
      description: description || '',
      welcomeMessage: welcomeMessage || 'Hello! How can I help you?',
      instructions: instructions || '',
      voice: voice || 'alloy',
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Create agent error:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}
