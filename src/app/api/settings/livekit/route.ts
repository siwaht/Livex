import { NextRequest } from 'next/server'
import { updatePlatformLiveKit, getPlatformSettings } from '@/lib/settings-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { LiveKitCredentials } from '@/types/user'

export async function PUT(request: NextRequest) {
  try {
    const body = await parseJsonBody<LiveKitCredentials>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    const { apiKey, apiSecret, wsUrl } = body

    if (!apiKey || !apiSecret || !wsUrl) {
      return badRequestResponse('apiKey, apiSecret, and wsUrl are required')
    }

    updatePlatformLiveKit({ apiKey, apiSecret, wsUrl })
    const settings = getPlatformSettings()
    
    return successResponse(settings)
  } catch (error) {
    return errorResponse('Failed to update LiveKit credentials', 500, error)
  }
}

export async function DELETE() {
  try {
    updatePlatformLiveKit(null)
    const settings = getPlatformSettings()
    return successResponse(settings)
  } catch (error) {
    return errorResponse('Failed to remove LiveKit credentials', 500, error)
  }
}
