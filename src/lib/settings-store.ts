import { LiveKitCredentials } from '@/types/user'

export interface PlatformSettings {
  livekit: LiveKitCredentials | null
  twilioAccountSid?: string
  twilioAuthToken?: string
  telnyxApiKey?: string
  vonageApiKey?: string
  vonageApiSecret?: string
  updatedAt: string
}

// Platform-wide settings (singleton)
let platformSettings: PlatformSettings = {
  livekit: null,
  updatedAt: new Date().toISOString(),
}

export function getPlatformSettings(): PlatformSettings {
  return { 
    ...platformSettings,
    // Mask secrets
    twilioAuthToken: platformSettings.twilioAuthToken ? '••••••••' : undefined,
    telnyxApiKey: platformSettings.telnyxApiKey ? '••••••••' : undefined,
    vonageApiSecret: platformSettings.vonageApiSecret ? '••••••••' : undefined,
    livekit: platformSettings.livekit ? {
      ...platformSettings.livekit,
      apiSecret: '••••••••'
    } : null
  }
}

export function getPlatformSettingsRaw(): PlatformSettings {
  return platformSettings
}

export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  platformSettings = {
    ...platformSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return getPlatformSettings()
}

export function updatePlatformLiveKit(credentials: LiveKitCredentials | null): PlatformSettings {
  platformSettings.livekit = credentials
  platformSettings.updatedAt = new Date().toISOString()
  return getPlatformSettings()
}

export function getPlatformLiveKitCredentials(): LiveKitCredentials | null {
  return platformSettings.livekit
}

// Telephony provider credentials
export function updateTwilioCredentials(accountSid: string, authToken: string): PlatformSettings {
  platformSettings.twilioAccountSid = accountSid
  platformSettings.twilioAuthToken = authToken
  platformSettings.updatedAt = new Date().toISOString()
  return getPlatformSettings()
}

export function updateTelnyxCredentials(apiKey: string): PlatformSettings {
  platformSettings.telnyxApiKey = apiKey
  platformSettings.updatedAt = new Date().toISOString()
  return getPlatformSettings()
}

export function updateVonageCredentials(apiKey: string, apiSecret: string): PlatformSettings {
  platformSettings.vonageApiKey = apiKey
  platformSettings.vonageApiSecret = apiSecret
  platformSettings.updatedAt = new Date().toISOString()
  return getPlatformSettings()
}

export function getTwilioCredentials(): { accountSid?: string; authToken?: string } | null {
  if (!platformSettings.twilioAccountSid || !platformSettings.twilioAuthToken) return null
  return {
    accountSid: platformSettings.twilioAccountSid,
    authToken: platformSettings.twilioAuthToken,
  }
}

export function getTelnyxCredentials(): { apiKey: string } | null {
  if (!platformSettings.telnyxApiKey) return null
  return { apiKey: platformSettings.telnyxApiKey }
}

export function getVonageCredentials(): { apiKey?: string; apiSecret?: string } | null {
  if (!platformSettings.vonageApiKey || !platformSettings.vonageApiSecret) return null
  return {
    apiKey: platformSettings.vonageApiKey,
    apiSecret: platformSettings.vonageApiSecret,
  }
}
