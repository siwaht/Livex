import { Agent, CreateAgentInput, AgentFunction } from '@/types/agent'

const defaultPrompts = {
  systemPrompt: `You are a helpful voice assistant. Be friendly, professional, and concise.

Guidelines:
- Keep responses brief and conversational
- Ask clarifying questions when needed
- Be empathetic and patient
- Never make up information you don't know`,
  firstMessage: 'Hello! How can I help you today?',
  firstMessageMode: 'static' as const,
  idleMessage: 'Are you still there?',
  idleTimeoutSeconds: 10,
  endCallMessage: 'Thank you for calling. Have a great day!',
  endCallPhrases: ['goodbye', 'bye', 'end call', 'hang up'],
  voicemailMessage: 'Hi, this is an automated message. Please call us back at your convenience.',
  voicemailDetection: true,
}

const defaultVoice = {
  provider: 'openai' as const,
  voiceId: 'alloy',
  speed: 1.0,
  pitch: 1.0,
  fillerInjection: false,
}

const defaultTranscriber = {
  provider: 'deepgram' as const,
  model: 'nova-2',
  language: 'en',
  endpointingMs: 300,
}

const defaultLLM = {
  provider: 'openai' as const,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 256,
  semanticCaching: false,
}

const defaultConversation = {
  interruptionSensitivity: 0.5,
  responsiveness: 0.8,
  silenceTimeoutSeconds: 30,
  maxSilenceCount: 2,
  maxDurationSeconds: 1800,
  backchanneling: true,
  backchannelingWords: ['mhm', 'uh-huh', 'I see', 'got it'],
  recordingEnabled: true,
  recordingFormat: 'mp3' as const,
  transcriptionEnabled: true,
}

const agents: Map<string, Agent> = new Map([
  ['inbound-support', {
    id: 'inbound-support',
    name: 'inbound-support',
    displayName: 'Inbound Support',
    description: 'Handles incoming customer support calls with empathy and efficiency',
    status: 'active',
    ownerId: null,
    prompts: {
      ...defaultPrompts,
      systemPrompt: `You are a friendly customer support agent for a software company.

Your responsibilities:
- Answer questions about our products and services
- Help troubleshoot common issues
- Collect information for support tickets
- Transfer to human agents when needed

Guidelines:
- Be patient and empathetic
- Ask clarifying questions
- Summarize the issue before providing solutions
- Offer to transfer if you can't resolve the issue`,
      firstMessage: 'Thank you for calling support! My name is Alex. How can I help you today?',
    },
    voice: { ...defaultVoice, voiceId: 'nova' },
    transcriber: defaultTranscriber,
    llm: defaultLLM,
    conversation: defaultConversation,
    functions: [
      {
        id: 'fn-1',
        name: 'create_ticket',
        description: 'Create a support ticket for the customer',
        parameters: {
          type: 'object' as const,
          properties: {
            subject: { type: 'string', description: 'Brief description of the issue' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            category: { type: 'string', enum: ['billing', 'technical', 'general'] },
          },
          required: ['subject', 'priority'],
        },
        type: 'webhook' as const,
        webhookUrl: 'https://api.example.com/tickets',
        webhookMethod: 'POST' as const,
        enabled: true,
      },
      {
        id: 'fn-2',
        name: 'transfer_to_human',
        description: 'Transfer the call to a human agent',
        parameters: {
          type: 'object' as const,
          properties: {
            department: { type: 'string', enum: ['sales', 'support', 'billing'] },
            reason: { type: 'string', description: 'Reason for transfer' },
          },
          required: ['department'],
        },
        type: 'transfer' as const,
        transferNumber: '+15551234567',
        transferMessage: 'Let me transfer you to a specialist who can better assist you.',
        enabled: true,
      },
    ] as AgentFunction[],
    webhooks: [],
    mcpServers: [],
    phoneNumberIds: [],
    totalCalls: 1250,
    totalMinutes: 4500,
    avgCallDuration: 216,
    successRate: 94.5,
    tags: ['support', 'inbound'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
  ['outbound-sales', {
    id: 'outbound-sales',
    name: 'outbound-sales',
    displayName: 'Outbound Sales',
    description: 'Makes outbound sales calls to qualify leads and book appointments',
    status: 'active',
    ownerId: null,
    prompts: {
      ...defaultPrompts,
      systemPrompt: `You are a professional sales development representative making outbound calls.

Your goal:
- Introduce our product/service
- Qualify the prospect
- Book a demo or meeting with our sales team

Guidelines:
- Be respectful of their time
- Ask open-ended questions
- Listen more than you talk
- Handle objections gracefully
- Always offer value before asking for commitment`,
      firstMessage: 'Hi {{name}}, this is Sarah from TechCorp. I noticed you recently visited our website. Do you have a quick moment to chat?',
      firstMessageMode: 'dynamic' as const,
      voicemailMessage: 'Hi {{name}}, this is Sarah from TechCorp. I was calling to discuss how we might help your business. Please call me back at your convenience or visit our website to schedule a demo. Thanks!',
    },
    voice: { ...defaultVoice, voiceId: 'shimmer', speed: 1.05 },
    transcriber: defaultTranscriber,
    llm: { ...defaultLLM, model: 'gpt-4o', temperature: 0.8 },
    conversation: { ...defaultConversation, maxDurationSeconds: 600 },
    functions: [
      {
        id: 'fn-3',
        name: 'book_meeting',
        description: 'Book a demo meeting with the prospect',
        parameters: {
          type: 'object' as const,
          properties: {
            email: { type: 'string', description: 'Prospect email address' },
            preferredTime: { type: 'string', description: 'Preferred meeting time' },
            notes: { type: 'string', description: 'Any notes about the prospect' },
          },
          required: ['email'],
        },
        type: 'webhook' as const,
        webhookUrl: 'https://api.example.com/meetings',
        webhookMethod: 'POST' as const,
        enabled: true,
      },
      {
        id: 'fn-4',
        name: 'end_call',
        description: 'End the call politely',
        parameters: {
          type: 'object' as const,
          properties: {
            outcome: { type: 'string', enum: ['interested', 'not_interested', 'callback', 'wrong_number'] },
          },
          required: ['outcome'],
        },
        type: 'end_call' as const,
        enabled: true,
      },
    ] as AgentFunction[],
    webhooks: [],
    mcpServers: [],
    phoneNumberIds: [],
    totalCalls: 850,
    totalMinutes: 1200,
    avgCallDuration: 85,
    successRate: 32.5,
    tags: ['sales', 'outbound'],
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
  const id = input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const agent: Agent = {
    id,
    name: input.name,
    displayName: input.displayName,
    description: input.description || '',
    status: 'draft',
    ownerId: ownerId || null,
    prompts: { ...defaultPrompts, ...input.prompts },
    voice: { ...defaultVoice, ...input.voice },
    transcriber: { ...defaultTranscriber, ...input.transcriber },
    llm: { ...defaultLLM, ...input.llm },
    conversation: { ...defaultConversation, ...input.conversation },
    functions: [],
    webhooks: [],
    mcpServers: [],
    phoneNumberIds: [],
    totalCalls: 0,
    totalMinutes: 0,
    avgCallDuration: 0,
    successRate: 0,
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
