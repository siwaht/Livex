import { User, CreateUserInput, LiveKitCredentials } from '@/types/user'

const users: Map<string, User> = new Map([
  ['admin-1', {
    id: 'admin-1',
    email: 'admin@agency.com',
    name: 'Agency Admin',
    role: 'admin',
    livekit: null, // Admin uses system-level credentials
    agentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

export function createUser(input: CreateUserInput): User {
  const id = `user-${Date.now()}`
  const user: User = {
    id,
    email: input.email,
    name: input.name,
    role: input.role,
    livekit: input.livekit || null,
    agentIds: [],
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

export function deleteUser(id: string): boolean {
  return users.delete(id)
}
