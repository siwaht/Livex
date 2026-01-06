export interface LiveKitCredentials {
  apiKey: string
  apiSecret: string
  wsUrl: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  livekit: LiveKitCredentials | null
  agentIds: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  email: string
  name: string
  role: 'admin' | 'user'
  livekit?: LiveKitCredentials
}
