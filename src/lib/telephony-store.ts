import { PhoneNumber, SIPTrunk, OutboundCall, CallCampaign, OutboundCallRequest } from '@/types/telephony'

// Phone Numbers Store
const phoneNumbers: Map<string, PhoneNumber> = new Map([
  ['pn-1', {
    id: 'pn-1',
    number: '+15551234567',
    formattedNumber: '+1 (555) 123-4567',
    provider: 'twilio',
    country: 'US',
    region: 'CA',
    capabilities: ['voice', 'sms'],
    assignedAgentId: 'inbound-support',
    sipTrunkId: 'trunk-1',
    inboundEnabled: true,
    outboundEnabled: true,
    monthlyCost: 1.00,
    perMinuteCost: 0.0085,
    status: 'active',
    purchasedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }],
  ['pn-2', {
    id: 'pn-2',
    number: '+15559876543',
    formattedNumber: '+1 (555) 987-6543',
    provider: 'twilio',
    country: 'US',
    region: 'NY',
    capabilities: ['voice'],
    assignedAgentId: 'outbound-sales',
    sipTrunkId: 'trunk-1',
    inboundEnabled: false,
    outboundEnabled: true,
    outboundCallerId: 'TechCorp Sales',
    monthlyCost: 1.00,
    perMinuteCost: 0.0085,
    status: 'active',
    purchasedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }],
])

// SIP Trunks Store
const sipTrunks: Map<string, SIPTrunk> = new Map([
  ['trunk-1', {
    id: 'trunk-1',
    name: 'Primary Twilio Trunk',
    provider: 'twilio',
    type: 'both',
    trunkSid: 'TKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    terminationUri: 'my-trunk.pstn.twilio.com',
    originationUri: 'sip:xxxxx.sip.livekit.cloud',
    username: 'livekit_user',
    password: '••••••••',
    livekitSipUri: 'sip:xxxxx.sip.livekit.cloud',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
])

// Outbound Calls Store
const outboundCalls: Map<string, OutboundCall> = new Map()

// Generate demo outbound calls
for (let i = 0; i < 25; i++) {
  const statuses: OutboundCall['status'][] = ['completed', 'completed', 'completed', 'no-answer', 'busy', 'failed']
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const duration = status === 'completed' ? Math.floor(Math.random() * 300) + 30 : 0
  
  const call: OutboundCall = {
    id: `oc-${i}`,
    agentId: 'outbound-sales',
    toNumber: `+1555${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    fromNumber: '+15559876543',
    status,
    queuedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    dialedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    answeredAt: status === 'completed' ? new Date().toISOString() : undefined,
    endedAt: new Date().toISOString(),
    duration,
    cost: duration * 0.0085 / 60,
  }
  outboundCalls.set(call.id, call)
}

// Phone Numbers Functions
export function getAllPhoneNumbers(): PhoneNumber[] {
  return Array.from(phoneNumbers.values())
}

export function getPhoneNumber(id: string): PhoneNumber | undefined {
  return phoneNumbers.get(id)
}

export function getPhoneNumbersByAgent(agentId: string): PhoneNumber[] {
  return Array.from(phoneNumbers.values()).filter(p => p.assignedAgentId === agentId)
}

export function createPhoneNumber(data: Omit<PhoneNumber, 'id' | 'createdAt'>): PhoneNumber {
  const id = `pn-${Date.now()}`
  const phoneNumber: PhoneNumber = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
  }
  phoneNumbers.set(id, phoneNumber)
  return phoneNumber
}

export function updatePhoneNumber(id: string, updates: Partial<PhoneNumber>): PhoneNumber | null {
  const phoneNumber = phoneNumbers.get(id)
  if (!phoneNumber) return null
  const updated = { ...phoneNumber, ...updates }
  phoneNumbers.set(id, updated)
  return updated
}

export function deletePhoneNumber(id: string): boolean {
  return phoneNumbers.delete(id)
}

// SIP Trunks Functions
export function getAllSIPTrunks(): SIPTrunk[] {
  return Array.from(sipTrunks.values())
}

export function getSIPTrunk(id: string): SIPTrunk | undefined {
  return sipTrunks.get(id)
}

export function createSIPTrunk(data: Omit<SIPTrunk, 'id' | 'createdAt' | 'updatedAt'>): SIPTrunk {
  const id = `trunk-${Date.now()}`
  const trunk: SIPTrunk = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  sipTrunks.set(id, trunk)
  return trunk
}

export function updateSIPTrunk(id: string, updates: Partial<SIPTrunk>): SIPTrunk | null {
  const trunk = sipTrunks.get(id)
  if (!trunk) return null
  const updated = { ...trunk, ...updates, updatedAt: new Date().toISOString() }
  sipTrunks.set(id, updated)
  return updated
}

export function deleteSIPTrunk(id: string): boolean {
  return sipTrunks.delete(id)
}

// Outbound Calls Functions
export function getAllOutboundCalls(): OutboundCall[] {
  return Array.from(outboundCalls.values()).sort((a, b) => 
    new Date(b.queuedAt).getTime() - new Date(a.queuedAt).getTime()
  )
}

export function getOutboundCall(id: string): OutboundCall | undefined {
  return outboundCalls.get(id)
}

export function createOutboundCall(request: OutboundCallRequest): OutboundCall {
  const phoneNumber = getPhoneNumber(request.fromNumberId)
  const id = `oc-${Date.now()}`
  
  const call: OutboundCall = {
    id,
    agentId: request.agentId,
    toNumber: request.toNumber,
    fromNumber: phoneNumber?.number || '',
    status: 'queued',
    queuedAt: new Date().toISOString(),
  }
  
  outboundCalls.set(id, call)
  return call
}

export function updateOutboundCall(id: string, updates: Partial<OutboundCall>): OutboundCall | null {
  const call = outboundCalls.get(id)
  if (!call) return null
  const updated = { ...call, ...updates }
  outboundCalls.set(id, updated)
  return updated
}

// Stats
export function getOutboundCallStats() {
  const calls = getAllOutboundCalls()
  const completed = calls.filter(c => c.status === 'completed')
  const failed = calls.filter(c => ['failed', 'busy', 'no-answer'].includes(c.status))
  
  return {
    total: calls.length,
    completed: completed.length,
    failed: failed.length,
    inProgress: calls.filter(c => ['queued', 'dialing', 'ringing', 'in-progress'].includes(c.status)).length,
    totalDuration: completed.reduce((sum, c) => sum + (c.duration || 0), 0),
    totalCost: calls.reduce((sum, c) => sum + (c.cost || 0), 0),
    answerRate: calls.length > 0 ? (completed.length / calls.length) * 100 : 0,
  }
}
