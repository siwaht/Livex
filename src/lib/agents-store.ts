import { Agent, CreateAgentInput } from '@/types/agent'

const defaultPrompts = {
  systemPrompt: 'You are a helpful voice assistant. Be friendly, professional, and concise.',
  firstMessage: 'Hello! How can I help you today?',
  fallbackMessage: "I'm sorry, I didn't quite catch that. Could you please repeat?",
  endCallMessage: 'Thank you for calling. Have a great day!',
  transferMessage: 'Let me transfer you to a human agent.',
}

const defaultVoice = {
  provider: 'openai' as const,
  voiceId: 'alloy',
  speed: 1.0,
  pitch: 1.0,
}

const defaultLLM = {
  provider: 'openai' as const,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1024,
}

const defaultAdvanced = {
  interruptionThreshold: 0.5,
  silenceTimeout: 10,
  maxCallDuration: 1800,
  recordCalls: true,
  transcribeCalls: true,
  enableVAD: true,
}

const agents: Map<string, Agent> = new Map([
  ['support-agent', {
    id: 'support-agent',
    name: 'support-agent',
    displayName: 'Customer Support',
    description: 'Friendly support agent for customer inquiries',
    status: 'active',
    ownerId: null,
    prompts: {
      ...defaultPrompts,
      systemPrompt: 'You are a helpful customer support agent. Be friendly, professional, and resolve issues efficiently. Always ask clarifying questions when needed.',
      firstMessage: 'Hello! Thank you for calling support. How can I assist you today?',
    },
    voice: defaultVoice,
    llm: defaultLLM,
    advanced: defaultAdvanced,
    mcpServers: [],
    webhooks: [],
    phoneNumbers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
  ['sales-agent', {
    id: 'sales-agent',
    name: 'sales-agent',
    displayName: 'Sales Assistant',
    description: 'Knowledgeable sales agent for product inquiries',
    status: 'active',
    ownerId: null,
    prompts: {
      ...defaultPrompts,
      systemPrompt: 'You are a sales assistant. Help customers understand products and guide them to the right solutions. Be persuasive but not pushy.',
      firstMessage: 'Hi there! Looking for information about our products? I\'d love to help!',
    },
    voice: { ...defaultVoice, voiceId: 'echo' },
    llm: defaultLLM,
    advanced: defaultAdvanced,
    mcpServers: [],
    webhooks: [],
    phoneNumbers: [],
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
    name: input.name,
    displayName: input.displayName,
    description: input.description,
    status: 'draft',
    ownerId: ownerId || null,
    prompts: { ...defaultPrompts, ...input.prompts },
    voice: { ...defaultVoice, ...input.voice },
    llm: { ...defaultLLM, ...input.llm },
    advanced: { ...defaultAdvanced, ...input.advanced },
    mcpServers: [],
    webhooks: [],
    phoneNumbers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  agents.set(id, agent)
  return agent
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const agent = agents.get(id)
  if (!agent) return null
  
  const updated: Agent = {
    ...agent,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  agents.set(id, updated)
  return updated
}

export function getAgentsByOwner(ownerId: string): Agent[] {
  return Array.from(agents.values()).filter(a => a.ownerId === ownerId)
}

export function deleteAgent(id: string): boolean {
  return agents.delete(id)
}
