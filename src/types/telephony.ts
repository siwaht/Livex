// Telephony Provider Types
export type TelephonyProvider = 'twilio' | 'telnyx' | 'vonage' | 'plivo'

export interface TelephonyCredentials {
  provider: TelephonyProvider
  accountSid?: string      // Twilio
  authToken?: string       // Twilio
  apiKey?: string          // Telnyx, Vonage
  apiSecret?: string       // Telnyx, Vonage
}

export interface SIPTrunk {
  id: string
  name: string
  provider: TelephonyProvider
  type: 'inbound' | 'outbound' | 'both'
  
  // Twilio specific
  trunkSid?: string
  terminationUri?: string
  originationUri?: string
  
  // Credentials
  username?: string
  password?: string
  
  // LiveKit SIP config
  livekitSipUri?: string
  
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}

export interface PhoneNumber {
  id: string
  number: string
  formattedNumber: string
  provider: TelephonyProvider
  country: string
  region?: string
  capabilities: ('voice' | 'sms')[]
  
  // Assignment
  assignedAgentId?: string
  sipTrunkId?: string
  
  // Inbound config
  inboundEnabled: boolean
  
  // Outbound config  
  outboundEnabled: boolean
  outboundCallerId?: string
  
  // Cost
  monthlyCost: number
  perMinuteCost: number
  
  status: 'active' | 'inactive' | 'pending'
  purchasedAt: string
  createdAt: string
}

// Outbound Call Types
export interface OutboundCallRequest {
  agentId: string
  toNumber: string
  fromNumberId: string
  
  // Optional overrides
  customCallerId?: string
  metadata?: Record<string, string>
  
  // DTMF/Extension
  dtmfSequence?: string
  playDialtone?: boolean
  
  // Scheduling
  scheduledAt?: string
}

export interface OutboundCall {
  id: string
  agentId: string
  toNumber: string
  fromNumber: string
  
  // Status
  status: 'queued' | 'dialing' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer'
  
  // Timing
  queuedAt: string
  dialedAt?: string
  answeredAt?: string
  endedAt?: string
  duration?: number
  
  // LiveKit
  roomName?: string
  sipParticipantId?: string
  
  // Result
  endReason?: string
  errorMessage?: string
  
  // Cost
  cost?: number
}

// Batch/Campaign Calls
export interface CallCampaign {
  id: string
  name: string
  agentId: string
  fromNumberId: string
  
  // Contacts
  contacts: CampaignContact[]
  
  // Settings
  maxConcurrentCalls: number
  callsPerSecond: number
  retryAttempts: number
  retryDelayMinutes: number
  
  // Schedule
  startTime?: string
  endTime?: string
  timezone: string
  allowedDays: number[] // 0-6, Sunday-Saturday
  allowedHoursStart: number // 0-23
  allowedHoursEnd: number // 0-23
  
  // Status
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'canceled'
  
  // Stats
  totalContacts: number
  contactsCalled: number
  contactsAnswered: number
  contactsFailed: number
  
  createdAt: string
  updatedAt: string
}

export interface CampaignContact {
  id: string
  phoneNumber: string
  name?: string
  metadata?: Record<string, string>
  
  // Status
  status: 'pending' | 'called' | 'answered' | 'failed' | 'skipped'
  attempts: number
  lastAttemptAt?: string
  callId?: string
}
