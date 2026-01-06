import { NextRequest, NextResponse } from 'next/server'
import { getAllAgents, createAgent } from '@/lib/agents-store'

export async function GET() {
  const agents = getAllAgents()
  return NextResponse.json(agents)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, prompts, voice, llm, advanced, ownerId } = body

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
      prompts,
      voice,
      llm,
      advanced,
    }, ownerId)

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Create agent error:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}
