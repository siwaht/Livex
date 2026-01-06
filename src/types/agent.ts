// Voice Provider Types
export type VoiceProvider = 'openai' | 'elevenlabs' | 'deepgram' | 'playht' | 'azure' | 'cartesia'
export type LLMProvider = 'openai' | 'anthropic' | 'groq' | 'together' | 'azure' | 'custom'
export type TranscriberProvider = 'deepgram' | 'openai' | 'assemblyai' | 'gladia'

// Agent Configuration
export interface AgentPrompts {
  systemPrompt: string
  firstMessage: string
  firstMessageMode: 'static' | 'dynamic' // dynamic = LLM generates
  
  // Contextual messages
  idleMessage?: string
  idleTimeoutSeconds?: number
  
  endCallMessage?: string
  endCallPhrases?: string[] // Phrases that trigger end call
  
  voicemailMessage?: string
  voicemailDetection?: boolean
  
  // Transfer
  transferMessage?: string
  transferNumber?: string
}

export interface VoiceConfig {
  provider: VoiceProvider
  voiceId: string
  
  // Speed/Pitch
  speed?: number // 0.5-2.0
  pitch?: number // 0.5-2.0
  
  // ElevenLabs specific
  stability?: number
  similarityBoost?: number
  style?: number
  useSpeakerBoost?: boolean
  
  // Filler words
  fillerInjection?: boolean
  fillerWords?: string[]
  
  // Emotion
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised'
}

export interface TranscriberConfig {
  provider: TranscriberProvider
  model?: string
  language?: string
  
  // Keywords/Boosting
  keywords?: string[]
  keywordBoost?: number
  
  // Endpointing
  endpointingMs?: number
}

export interface LLMConfig {
  provider: LLMProvider
  model: string
  
  // Parameters
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  
  // Custom LLM
  customLLMUrl?: string
  customLLMHeaders?: Record<string, string>
  
  // Knowledge base
  knowledgeBaseId?: string
  
  // Semantic caching
  semanticCaching?: boolean
}

export interface ConversationConfig {
  // Turn taking
  interruptionSensitivity: number // 0-1
  responsiveness: number // 0-1, how quickly agent responds
  
  // Silence handling
  silenceTimeoutSeconds: number
  maxSilenceCount: number
  
  // Call limits
  maxDurationSeconds: number
  
  // Backchanneling
  backchanneling?: boolean
  backchannelingWords?: string[]
  
  // Recording
  recordingEnabled: boolean
  recordingFormat?: 'mp3' | 'wav'
  
  // Transcription
  transcriptionEnabled: boolean
  
  // Privacy
  hipaaCompliant?: boolean
  pciCompliant?: boolean
}

// Function/Tool Calling
export interface AgentFunction {
  id: string
  name: string
  description: string
  
  // Parameters (JSON Schema)
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description?: string
      enum?: string[]
    }>
    required?: string[]
  }
  
  // Execution
  type: 'webhook' | 'api' | 'transfer' | 'end_call' | 'dtmf'
  
  // Webhook config
  webhookUrl?: string
  webhookMethod?: 'GET' | 'POST'
  webhookHeaders?: Record<string, string>
  
  // Transfer config
  transferNumber?: string
  transferMessage?: string
  
  // Timing
  async?: boolean
  timeoutMs?: number
  
  enabled: boolean
}

// Webhook Events
export type WebhookEvent = 
  | 'call.started'
  | 'call.ringing'
  | 'call.answered'
  | 'call.ended'
  | 'call.failed'
  | 'speech.started'
  | 'speech.ended'
  | 'transcript.partial'
  | 'transcript.final'
  | 'function.called'
  | 'function.completed'
  | 'transfer.initiated'
  | 'recording.ready'
  | 'voicemail.detected'

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: WebhookEvent[]
  
  // Auth
  secret?: string
  headers?: Record<string, string>
  
  // Retry
  retryAttempts?: number
  retryDelayMs?: number
  
  enabled: boolean
}

// MCP (Model Context Protocol)
export interface MCPServer {
  id: string
  name: string
  description?: string
  
  // Connection
  type: 'stdio' | 'http' | 'websocket'
  command?: string // for stdio
  url?: string // for http/websocket
  
  // Auth
  apiKey?: string
  headers?: Record<string, string>
  
  // Tools exposed
  tools?: string[]
  
  enabled: boolean
}

// Main Agent Type
export interface Agent {
  id: string
  name: string
  displayName: string
  description: string
  
  // Status
  status: 'active' | 'inactive' | 'draft'
  
  // Ownership
  ownerId: string | null
  
  // Configuration
  prompts: AgentPrompts
  voice: VoiceConfig
  transcriber: TranscriberConfig
  llm: LLMConfig
  conversation: ConversationConfig
  
  // Functions/Tools
  functions: AgentFunction[]
  
  // Integrations
  webhooks: WebhookConfig[]
  mcpServers: MCPServer[]
  
  // Phone numbers assigned
  phoneNumberIds: string[]
  
  // Analytics
  totalCalls: number
  totalMinutes: number
  avgCallDuration: number
  successRate: number
  
  // Metadata
  tags?: string[]
  metadata?: Record<string, string>
  
  createdAt: string
  updatedAt: string
}

export interface CreateAgentInput {
  name: string
  displayName: string
  description?: string
  prompts?: Partial<AgentPrompts>
  voice?: Partial<VoiceConfig>
  transcriber?: Partial<TranscriberConfig>
  llm?: Partial<LLMConfig>
  conversation?: Partial<ConversationConfig>
}
