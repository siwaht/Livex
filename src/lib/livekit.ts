import { AccessToken } from 'livekit-server-sdk'
import { LiveKitCredentials } from '@/types/user'
import { env } from '@/lib/env'

export async function generateToken(
  roomName: string,
  participantIdentity: string,
  participantName: string,
  credentials?: LiveKitCredentials | null
): Promise<string> {
  const apiKey = credentials?.apiKey || env.LIVEKIT_API_KEY
  const apiSecret = credentials?.apiSecret || env.LIVEKIT_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API credentials not configured')
  }

  const at = new AccessToken(apiKey, apiSecret, {
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
  return credentials?.wsUrl || env.LIVEKIT_URL || 'wss://your-project.livekit.cloud'
}
