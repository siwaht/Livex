export interface MCPServer {
  id: string
  name: string
  url: string
  apiKey?: string
  enabled: boolean
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: WebhookEvent[]
  secret?: string
  enabled: boolean
}

export type WebhookEvent = 
  | 'call.started'
  | 'call.ended'
  | 'call.failed'
  | 'transcript.ready'
  | 'agent.error'

export interface PhoneNumber {
  id: string
  number: string
  provider: 'twilio' | 'vonage' | 'telnyx'
  country: string
  capabilities: ('voice' | 'sms')[]
  assignedAgentId?: string
}

export interface AgentPrompt {
  systemPrompt: string
  firstMessage: string
  fallbackMessage: string
  endCallMessage: string
  transferMessage: string
}

export interface AgentVoiceConfig {
  provider: 'openai' | 'elevenlabs' | 'deepgram' | 'playht'
  voiceId: string
  speed: number
  pitch: number
  stability?: number
  similarityBoost?: number
}

export interface AgentLLMConfig {
  provider: 'openai' | 'anthropic' | 'groq' | 'together'
  model: string
  temperature: number
  maxTokens: number
}

export interface AgentAdvancedConfig {
  interruptionThreshold: number
  silenceTimeout: number
  maxCallDuration: number
  recordCalls: boolean
  transcribeCalls: boolean
  enableVAD: boolean
}

export interface Agent {
  id: string
  name: string
  displayName: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  ownerId: string | null
  
  // Prompts
  prompts: AgentPrompt
  
  // Voice config
  voice: AgentVoiceConfig
  
  // LLM config
  llm: AgentLLMConfig
  
  // Advanced settings
  advanced: AgentAdvancedConfig
  
  // Integrations
  mcpServers: MCPServer[]
  webhooks: WebhookConfig[]
  phoneNumbers: string[]
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface CreateAgentInput {
  name: string
  displayName: string
  description: string
  prompts?: Partial<AgentPrompt>
  voice?: Partial<AgentVoiceConfig>
  llm?: Partial<AgentLLMConfig>
  advanced?: Partial<AgentAdvancedConfig>
}

export interface AgentSession {
  roomName: string
  participantIdentity: string
  agentName: string
  token: string
  wsUrl: string
}
