import { CallRecord, AnalyticsSummary, DailyStats, AgentAnalytics } from '@/types/analytics'

// In-memory store - replace with database in production
const calls: Map<string, CallRecord> = new Map()

// Generate demo data
function generateDemoData() {
  const now = new Date()
  const agents = ['support-agent', 'sales-agent']
  const statuses: CallRecord['status'][] = ['completed', 'completed', 'completed', 'failed', 'abandoned']
  const sentiments: CallRecord['sentiment'][] = ['positive', 'positive', 'neutral', 'negative']
  
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const startTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const duration = Math.floor(Math.random() * 600) + 30
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    const call: CallRecord = {
      id: `call-${i}`,
      agentId: agents[Math.floor(Math.random() * agents.length)],
      userId: 'demo-user',
      roomName: `room-${i}`,
      startedAt: startTime.toISOString(),
      endedAt: new Date(startTime.getTime() + duration * 1000).toISOString(),
      duration,
      status,
      endReason: status === 'completed' ? 'user_hangup' : 'error',
      tokensUsed: Math.floor(Math.random() * 5000) + 500,
      cost: parseFloat((Math.random() * 0.5 + 0.05).toFixed(4)),
      latencyAvg: Math.floor(Math.random() * 200) + 100,
      latencyP95: Math.floor(Math.random() * 400) + 200,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    }
    calls.set(call.id, call)
  }
}

generateDemoData()

export function getAllCalls(): CallRecord[] {
  return Array.from(calls.values()).sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
}

export function getCallsByAgent(agentId: string): CallRecord[] {
  return getAllCalls().filter(c => c.agentId === agentId)
}

export function getCallsByUser(userId: string): CallRecord[] {
  return getAllCalls().filter(c => c.userId === userId)
}

export function getCall(id: string): CallRecord | undefined {
  return calls.get(id)
}

export function createCall(call: Omit<CallRecord, 'id'>): CallRecord {
  const id = `call-${Date.now()}`
  const record: CallRecord = { id, ...call }
  calls.set(id, record)
  return record
}

export function updateCall(id: string, updates: Partial<CallRecord>): CallRecord | null {
  const call = calls.get(id)
  if (!call) return null
  const updated = { ...call, ...updates }
  calls.set(id, updated)
  return updated
}

export function getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year' = 'month'): AnalyticsSummary {
  const now = new Date()
  const periodMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  }
  
  const cutoff = new Date(now.getTime() - periodMs[period])
  const prevCutoff = new Date(cutoff.getTime() - periodMs[period])
  
  const currentCalls = getAllCalls().filter(c => new Date(c.startedAt) >= cutoff)
  const prevCalls = getAllCalls().filter(c => {
    const date = new Date(c.startedAt)
    return date >= prevCutoff && date < cutoff
  })
  
  const totalCalls = currentCalls.length
  const completedCalls = currentCalls.filter(c => c.status === 'completed').length
  const failedCalls = currentCalls.filter(c => c.status === 'failed').length
  const totalMinutes = currentCalls.reduce((sum, c) => sum + c.duration, 0) / 60
  const totalTokens = currentCalls.reduce((sum, c) => sum + c.tokensUsed, 0)
  const totalCost = currentCalls.reduce((sum, c) => sum + c.cost, 0)
  const avgLatency = currentCalls.length > 0 
    ? currentCalls.reduce((sum, c) => sum + c.latencyAvg, 0) / currentCalls.length 
    : 0
  
  const prevTotalCalls = prevCalls.length
  const prevTotalMinutes = prevCalls.reduce((sum, c) => sum + c.duration, 0) / 60
  const prevTotalCost = prevCalls.reduce((sum, c) => sum + c.cost, 0)
  
  return {
    period,
    totalCalls,
    completedCalls,
    failedCalls,
    avgDuration: totalCalls > 0 ? (totalMinutes * 60) / totalCalls : 0,
    totalMinutes,
    totalTokens,
    totalCost,
    avgLatency,
    successRate: totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0,
    callsChange: prevTotalCalls > 0 ? ((totalCalls - prevTotalCalls) / prevTotalCalls) * 100 : 0,
    minutesChange: prevTotalMinutes > 0 ? ((totalMinutes - prevTotalMinutes) / prevTotalMinutes) * 100 : 0,
    costChange: prevTotalCost > 0 ? ((totalCost - prevTotalCost) / prevTotalCost) * 100 : 0,
  }
}

export function getDailyStats(days: number = 30): DailyStats[] {
  const now = new Date()
  const stats: DailyStats[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayCalls = getAllCalls().filter(c => c.startedAt.startsWith(dateStr))
    const completed = dayCalls.filter(c => c.status === 'completed').length
    
    stats.push({
      date: dateStr,
      calls: dayCalls.length,
      minutes: dayCalls.reduce((sum, c) => sum + c.duration, 0) / 60,
      tokens: dayCalls.reduce((sum, c) => sum + c.tokensUsed, 0),
      cost: dayCalls.reduce((sum, c) => sum + c.cost, 0),
      successRate: dayCalls.length > 0 ? (completed / dayCalls.length) * 100 : 0,
    })
  }
  
  return stats
}

export function getAgentAnalytics(): AgentAnalytics[] {
  const agentMap = new Map<string, CallRecord[]>()
  
  getAllCalls().forEach(call => {
    const existing = agentMap.get(call.agentId) || []
    existing.push(call)
    agentMap.set(call.agentId, existing)
  })
  
  return Array.from(agentMap.entries()).map(([agentId, agentCalls]) => {
    const completed = agentCalls.filter(c => c.status === 'completed').length
    const positive = agentCalls.filter(c => c.sentiment === 'positive').length
    const neutral = agentCalls.filter(c => c.sentiment === 'neutral').length
    const negative = agentCalls.filter(c => c.sentiment === 'negative').length
    
    return {
      agentId,
      agentName: agentId,
      totalCalls: agentCalls.length,
      totalMinutes: agentCalls.reduce((sum, c) => sum + c.duration, 0) / 60,
      avgDuration: agentCalls.length > 0 
        ? agentCalls.reduce((sum, c) => sum + c.duration, 0) / agentCalls.length 
        : 0,
      successRate: agentCalls.length > 0 ? (completed / agentCalls.length) * 100 : 0,
      sentiment: { positive, neutral, negative },
    }
  })
}
