import { NextRequest } from 'next/server'
import { getAllOutboundCalls, createOutboundCall, getOutboundCallStats } from '@/lib/telephony-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    const calls = getAllOutboundCalls()
    
    if (includeStats) {
      const stats = getOutboundCallStats()
      return successResponse({ calls, stats })
    }
    
    return successResponse(calls)
  } catch (error) {
    return errorResponse('Failed to fetch outbound calls', 500, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<{
      agentId: string
      toNumber: string
      fromNumberId: string
      customCallerId?: string
      dtmfSequence?: string
      playDialtone?: boolean
    }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    const { agentId, toNumber, fromNumberId, customCallerId, dtmfSequence, playDialtone } = body

    if (!agentId || !toNumber || !fromNumberId) {
      return badRequestResponse('agentId, toNumber, and fromNumberId are required')
    }

    const call = createOutboundCall({
      agentId,
      toNumber,
      fromNumberId,
      customCallerId,
      dtmfSequence,
      playDialtone,
    })

    // In production, this would trigger the actual LiveKit SIP call
    // await livekitSipService.createOutboundCall(call)

    return successResponse(call, 201)
  } catch (error) {
    return errorResponse('Failed to create outbound call', 500, error)
  }
}
