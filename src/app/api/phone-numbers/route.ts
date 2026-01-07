import { NextRequest } from 'next/server'
import { getAllPhoneNumbers, createPhoneNumber } from '@/lib/telephony-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { PhoneNumber, TelephonyProvider } from '@/types/telephony'

export async function GET() {
  try {
    const phoneNumbers = getAllPhoneNumbers()
    return successResponse(phoneNumbers)
  } catch (error) {
    return errorResponse('Failed to fetch phone numbers', 500, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<Partial<PhoneNumber> & { number: string; sipTrunkId: string }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    if (!body.number || !body.sipTrunkId) {
      return badRequestResponse('Phone number and SIP trunk ID are required')
    }

    // Build phone number with defaults
    const phoneNumberData: Omit<PhoneNumber, 'id' | 'createdAt'> = {
      number: body.number,
      formattedNumber: body.formattedNumber || body.number,
      provider: (body.provider || 'twilio') as TelephonyProvider,
      country: body.country || 'US',
      region: body.region,
      capabilities: body.capabilities || ['voice'],
      assignedAgentId: body.assignedAgentId,
      sipTrunkId: body.sipTrunkId,
      inboundEnabled: body.inboundEnabled ?? true,
      outboundEnabled: body.outboundEnabled ?? true,
      outboundCallerId: body.outboundCallerId,
      monthlyCost: body.monthlyCost ?? 1.00,
      perMinuteCost: body.perMinuteCost ?? 0.0085,
      status: body.status || 'active',
      purchasedAt: body.purchasedAt || new Date().toISOString(),
    }

    const phoneNumber = createPhoneNumber(phoneNumberData)
    return successResponse(phoneNumber, 201)
  } catch (error) {
    return errorResponse('Failed to create phone number', 500, error)
  }
}
