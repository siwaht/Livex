import { NextRequest } from 'next/server'
import { getAllAgents, createAgent } from '@/lib/agents-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET() {
  try {
    const agents = getAllAgents()
    return successResponse(agents)
  } catch (error) {
    return errorResponse('Failed to fetch agents', 500, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<{
      name: string
      displayName: string
      description?: string
      prompts?: object
      voice?: object
      transcriber?: object
      llm?: object
      conversation?: object
      ownerId?: string
    }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    const { name, displayName, description, prompts, voice, transcriber, llm, conversation, ownerId } = body

    if (!name || !displayName) {
      return badRequestResponse('Name and display name are required')
    }

    const agent = createAgent({
      name,
      displayName,
      description: description || '',
      prompts,
      voice,
      transcriber,
      llm,
      conversation,
    }, ownerId)

    return successResponse(agent, 201)
  } catch (error) {
    return errorResponse('Failed to create agent', 500, error)
  }
}
