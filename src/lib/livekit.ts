import { AccessToken } from 'livekit-server-sdk'
import { LiveKitCredentials } from '@/types/user'
import { env } from '@/lib/env'
import { getPlatformSettingsRaw } from '@/lib/settings-store'

function getCredentials(userCredentials?: LiveKitCredentials | null): { apiKey: string; apiSecret: string; wsUrl: string } | null {
  // Priority: user credentials > platform settings > env vars
  if (userCredentials?.apiKey && userCredentials?.apiSecret && userCredentials?.wsUrl) {
    return userCredentials
  }

  const platformSettings = getPlatformSettingsRaw()
  if (platformSettings.livekit?.apiKey && platformSettings.livekit?.apiSecret && platformSettings.livekit?.wsUrl) {
    return platformSettings.livekit
  }

  if (env.LIVEKIT_API_KEY && env.LIVEKIT_API_SECRET && env.LIVEKIT_URL) {
    return {
      apiKey: env.LIVEKIT_API_KEY,
      apiSecret: env.LIVEKIT_API_SECRET,
      wsUrl: env.LIVEKIT_URL,
    }
  }

  return null
}

export async function generateToken(
  roomName: string,
  participantIdentity: string,
  participantName: string,
  credentials?: LiveKitCredentials | null
): Promise<string> {
  const creds = getCredentials(credentials)

  if (!creds) {
    throw new Error('LiveKit API credentials not configured. Please configure them in Settings or set environment variables.')
  }

  const at = new AccessToken(creds.apiKey, creds.apiSecret, {
    identity: participantIdentity,
    name: participantName,
    ttl: '1h',
  })

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  })

  return await at.toJwt()
}

export function getLiveKitUrl(credentials?: LiveKitCredentials | null): string {
  const creds = getCredentials(credentials)
  return creds?.wsUrl || 'wss://your-project.livekit.cloud'
}

export function hasLiveKitCredentials(credentials?: LiveKitCredentials | null): boolean {
  return getCredentials(credentials) !== null
}
