import { User, CreateUserInput, LiveKitCredentials } from '@/types/user'
import crypto from 'crypto'

const users: Map<string, User> = new Map([
  ['admin-1', {
    id: 'admin-1',
    email: 'admin@agency.com',
    name: 'Agency Admin',
    company: 'VoiceAgent Inc',
    role: 'admin',
    livekit: null,
    plan: 'enterprise',
    billingStatus: 'active',
    usage: {
      totalCalls: 1250,
      totalMinutes: 4500,
      totalTokens: 2500000,
      callsThisMonth: 150,
      minutesThisMonth: 520,
      tokensThisMonth: 280000,
    },
    agentIds: [],
    apiKey: 'va_live_admin_xxxxx',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }],
  ['demo-user', {
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    company: 'Demo Corp',
    role: 'user',
    livekit: {
      apiKey: 'APIxxxxxxxx',
      apiSecret: 'secret_xxxxx',
      wsUrl: 'wss://demo.livekit.cloud',
    },
    plan: 'pro',
    billingStatus: 'active',
    usage: {
      totalCalls: 450,
      totalMinutes: 1200,
      totalTokens: 650000,
      callsThisMonth: 85,
      minutesThisMonth: 220,
      tokensThisMonth: 120000,
    },
    agentIds: ['support-agent', 'sales-agent'],
    apiKey: 'va_live_demo_xxxxx',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }],
])

export function getAllUsers(): User[] {
  return Array.from(users.values())
}

export function getUser(id: string): User | undefined {
  return users.get(id)
}

export function getUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find(u => u.email === email)
}

export function getUserByApiKey(apiKey: string): User | undefined {
  return Array.from(users.values()).find(u => u.apiKey === apiKey)
}

export function createUser(input: CreateUserInput): User {
  const id = `user-${Date.now()}`
  const user: User = {
    id,
    email: input.email,
    name: input.name,
    company: input.company,
    role: input.role,
    livekit: input.livekit || null,
    plan: input.plan || 'free',
    billingStatus: 'trialing',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    usage: {
      totalCalls: 0,
      totalMinutes: 0,
      totalTokens: 0,
      callsThisMonth: 0,
      minutesThisMonth: 0,
      tokensThisMonth: 0,
    },
    agentIds: [],
    apiKey: `va_live_${crypto.randomBytes(16).toString('hex')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  users.set(id, user)
  return user
}

export function updateUser(id: string, updates: Partial<CreateUserInput>): User | null {
  const user = users.get(id)
  if (!user) return null
  
  const updated: User = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  users.set(id, updated)
  return updated
}

export function updateUserLiveKit(id: string, livekit: LiveKitCredentials | null): User | null {
  const user = users.get(id)
  if (!user) return null
  
  const updated: User = { ...user, livekit, updatedAt: new Date().toISOString() }
  users.set(id, updated)
  return updated
}

export function updateUserUsage(id: string, minutes: number, tokens: number): User | null {
  const user = users.get(id)
  if (!user) return null
  
  user.usage.totalCalls += 1
  user.usage.totalMinutes += minutes
  user.usage.totalTokens += tokens
  user.usage.callsThisMonth += 1
  user.usage.minutesThisMonth += minutes
  user.usage.tokensThisMonth += tokens
  user.updatedAt = new Date().toISOString()
  
  users.set(id, user)
  return user
}

export function assignAgentToUser(userId: string, agentId: string): User | null {
  const user = users.get(userId)
  if (!user) return null
  
  if (!user.agentIds.includes(agentId)) {
    user.agentIds.push(agentId)
    user.updatedAt = new Date().toISOString()
    users.set(userId, user)
  }
  return user
}

export function removeAgentFromUser(userId: string, agentId: string): User | null {
  const user = users.get(userId)
  if (!user) return null
  
  user.agentIds = user.agentIds.filter(id => id !== agentId)
  user.updatedAt = new Date().toISOString()
  users.set(userId, user)
  return user
}

export function regenerateApiKey(userId: string): User | null {
  const user = users.get(userId)
  if (!user) return null
  
  user.apiKey = `va_live_${crypto.randomBytes(16).toString('hex')}`
  user.updatedAt = new Date().toISOString()
  users.set(userId, user)
  return user
}

export function deleteUser(id: string): boolean {
  return users.delete(id)
}
