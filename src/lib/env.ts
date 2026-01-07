// Environment configuration with validation
const requiredEnvVars = ['LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET', 'LIVEKIT_URL'] as const

type RequiredEnvVar = typeof requiredEnvVars[number]

function getEnvVar(name: RequiredEnvVar): string {
  const value = process.env[name]
  // Only throw in production runtime, not during build
  if (!value && process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.NEXT_PHASE) {
    console.warn(`Warning: Missing environment variable: ${name}`)
  }
  return value || ''
}

export const env = {
  // LiveKit
  LIVEKIT_API_KEY: getEnvVar('LIVEKIT_API_KEY'),
  LIVEKIT_API_SECRET: getEnvVar('LIVEKIT_API_SECRET'),
  LIVEKIT_URL: getEnvVar('LIVEKIT_URL'),
  
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Feature flags
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []
  for (const key of requiredEnvVars) {
    if (!process.env[key]) missing.push(key)
  }
  return { valid: missing.length === 0, missing }
}
