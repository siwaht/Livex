export interface Agent {
  id: string
  name: string
  displayName: string
  description: string
  welcomeMessage: string
  instructions: string
  voice: string
  status: 'active' | 'inactive' | 'draft'
  ownerId: string | null // User who owns this agent
  createdAt: string
  updatedAt: string
}

export interface AgentSession {
  roomName: string
  participantIdentity: string
  agentName: string
  token: string
  wsUrl: string
}

export interface CreateAgentInput {
  name: string
  displayName: string
  description: string
  welcomeMessage: string
  instructions: string
  voice: string
}
