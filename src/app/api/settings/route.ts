import { NextRequest } from 'next/server'
import { 
  getPlatformSettings, 
  updatePlatformSettings,
  updatePlatformLiveKit,
  updateTwilioCredentials,
  updateTelnyxCredentials,
  updateVonageCredentials
} from '@/lib/settings-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { LiveKitCredentials } from '@/types/user'

export async function GET() {
  try {
    const settings = getPlatformSettings()
    return successResponse(settings)
  } catch (error) {
    return errorResponse('Failed to fetch settings', 500, error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await parseJsonBody<{
      livekit?: LiveKitCredentials
      twilio?: { accountSid: string; authToken: string }
      telnyx?: { apiKey: string }
      vonage?: { apiKey: string; apiSecret: string }
    }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    // Update LiveKit credentials
    if (body.livekit) {
      const { apiKey, apiSecret, wsUrl } = body.livekit
      if (!apiKey || !apiSecret || !wsUrl) {
        return badRequestResponse('LiveKit requires apiKey, apiSecret, and wsUrl')
      }
      updatePlatformLiveKit(body.livekit)
    }

    // Update Twilio credentials
    if (body.twilio) {
      const { accountSid, authToken } = body.twilio
      if (!accountSid || !authToken) {
        return badRequestResponse('Twilio requires accountSid and authToken')
      }
      updateTwilioCredentials(accountSid, authToken)
    }

    // Update Telnyx credentials
    if (body.telnyx) {
      const { apiKey } = body.telnyx
      if (!apiKey) {
        return badRequestResponse('Telnyx requires apiKey')
      }
      updateTelnyxCredentials(apiKey)
    }

    // Update Vonage credentials
    if (body.vonage) {
      const { apiKey, apiSecret } = body.vonage
      if (!apiKey || !apiSecret) {
        return badRequestResponse('Vonage requires apiKey and apiSecret')
      }
      updateVonageCredentials(apiKey, apiSecret)
    }

    const settings = getPlatformSettings()
    return successResponse(settings)
  } catch (error) {
    return errorResponse('Failed to update settings', 500, error)
  }
}
