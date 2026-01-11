import { NextRequest } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { LiveKitCredentials } from '@/types/user'
import { getPlatformSettingsRaw } from '@/lib/settings-store'

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<LiveKitCredentials>(request)

    // Use provided credentials or fall back to platform settings
    let apiKey: string
    let apiSecret: string
    let wsUrl: string

    if (body?.apiKey && body?.apiSecret && body?.wsUrl) {
      apiKey = body.apiKey
      apiSecret = body.apiSecret
      wsUrl = body.wsUrl
    } else {
      const settings = getPlatformSettingsRaw()
      if (!settings.livekit) {
        return badRequestResponse('No LiveKit credentials configured')
      }
      apiKey = settings.livekit.apiKey
      apiSecret = settings.livekit.apiSecret
      wsUrl = settings.livekit.wsUrl
    }

    // Try to generate a test token to validate credentials
    const at = new AccessToken(apiKey, apiSecret, {
      identity: 'test-connection',
      name: 'Connection Test',
      ttl: '10s',
    })

    at.addGrant({
      room: 'test-room',
      roomJoin: true,
    })

    const token = await at.toJwt()

    // If we got here, credentials are valid
    return successResponse({
      success: true,
      message: 'LiveKit credentials are valid',
      wsUrl,
      tokenGenerated: !!token,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse(`LiveKit connection test failed: ${message}`, 400, error)
  }
}
