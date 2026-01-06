export interface LiveKitCredentials {
  apiKey: string
  apiSecret: string
  wsUrl: string
}

export interface BillingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    agents: number
    minutesPerMonth: number
    phoneNumbers: number
    webhooks: number
    mcpServers: number
  }
}

export interface UsageStats {
  totalCalls: number
  totalMinutes: number
  totalTokens: number
  callsThisMonth: number
  minutesThisMonth: number
  tokensThisMonth: number
}

export interface User {
  id: string
  email: string
  name: string
  company?: string
  role: 'admin' | 'user'
  
  // LiveKit
  livekit: LiveKitCredentials | null
  
  // Billing
  plan: string
  billingStatus: 'active' | 'past_due' | 'canceled' | 'trialing'
  trialEndsAt?: string
  
  // Usage
  usage: UsageStats
  
  // Agents
  agentIds: string[]
  
  // API
  apiKey?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface CreateUserInput {
  email: string
  name: string
  company?: string
  role: 'admin' | 'user'
  plan?: string
  livekit?: LiveKitCredentials
}
