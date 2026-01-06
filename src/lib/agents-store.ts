import { Agent, CreateAgentInput } from '@/types/agent'

// In-memory store for demo - replace with database in production
const agents: Map<string, Agent> = new Map([
  ['support-agent', {
    id: 'support-agent',
    name: 'support-agent',
    displayName: 'Customer Support',
    description: 'Friendly support agent for customer inquiries',
    welcomeMessage: 'Hello! How can I help you today?',
    instructions: 'You are a helpful customer support agent. Be friendly, professional, and resolve issues efficiently.',
    voice: 'alloy',
    status: 'active',
    ownerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
  ['sales-agent', {
    id: 'sales-agent',
    name: 'sales-agent',
    displayName: 'Sales Assistant',
    description: 'Knowledgeable sales agent for product inquiries',
    welcomeMessage: 'Hi there! Looking for information about our products?',
    instructions: 'You are a sales assistant. Help customers understand products and guide them to the right solutions.',
    voice: 'echo',
    status: 'active',
    ownerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
])

export function getAllAgents(): Agent[] {
  return Array.from(agents.values())
}

export function getAgent(id: string): Agent | undefined {
  return agents.get(id)
}

export function createAgent(input: CreateAgentInput, ownerId?: string): Agent {
  const id = input.name.toLowerCase().replace(/\s+/g, '-')
  const agent: Agent = {
    id,
    ...input,
    status: 'active',
    ownerId: ownerId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  agents.set(id, agent)
  return agent
}

export function getAgentsByOwner(ownerId: string): Agent[] {
  return Array.from(agents.values()).filter(a => a.ownerId === ownerId)
}

export function updateAgent(id: string, updates: Partial<CreateAgentInput>): Agent | null {
  const agent = agents.get(id)
  if (!agent) return null
  
  const updated = { ...agent, ...updates, updatedAt: new Date().toISOString() }
  agents.set(id, updated)
  return updated
}

export function deleteAgent(id: string): boolean {
  return agents.delete(id)
}
