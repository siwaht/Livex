import { NextRequest } from 'next/server'
import { getAllSIPTrunks, createSIPTrunk } from '@/lib/telephony-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { SIPTrunk, TelephonyProvider } from '@/types/telephony'

export async function GET() {
  try {
    const trunks = getAllSIPTrunks()
    // Mask password in response
    const safeTrunks = trunks.map(t => ({
      ...t,
      password: t.password ? '••••••••' : undefined
    }))
    return successResponse(safeTrunks)
  } catch (error) {
    return errorResponse('Failed to fetch SIP trunks', 500, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<Partial<SIPTrunk> & { name: string; provider: string }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    if (!body.name || !body.provider) {
      return badRequestResponse('Name and provider are required')
    }

    // Build SIP trunk with defaults
    const trunkData: Omit<SIPTrunk, 'id' | 'createdAt' | 'updatedAt'> = {
      name: body.name,
      provider: body.provider as TelephonyProvider,
      type: body.type || 'both',
      trunkSid: body.trunkSid,
      terminationUri: body.terminationUri,
      originationUri: body.originationUri,
      username: body.username,
      password: body.password,
      livekitSipUri: body.livekitSipUri,
      status: body.status || 'active',
    }

    const trunk = createSIPTrunk(trunkData)
    return successResponse(trunk, 201)
  } catch (error) {
    return errorResponse('Failed to create SIP trunk', 500, error)
  }
}
