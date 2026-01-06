export interface CallRecord {
  id: string
  agentId: string
  userId: string
  roomName: string
  
  // Timing
  startedAt: string
  endedAt?: string
  duration: number // seconds
  
  // Status
  status: 'active' | 'completed' | 'failed' | 'abandoned'
  endReason?: 'user_hangup' | 'agent_hangup' | 'timeout' | 'error' | 'transfer'
  
  // Metrics
  tokensUsed: number
  cost: number
  
  // Quality
  latencyAvg: number
  latencyP95: number
  
  // Transcript
  transcript?: TranscriptEntry[]
  summary?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  
  // Phone
  phoneNumber?: string
  callerNumber?: string
}

export interface TranscriptEntry {
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

export interface AnalyticsSummary {
  period: 'day' | 'week' | 'month' | 'year'
  
  // Calls
  totalCalls: number
  completedCalls: number
  failedCalls: number
  avgDuration: number
  
  // Usage
  totalMinutes: number
  totalTokens: number
  totalCost: number
  
  // Quality
  avgLatency: number
  successRate: number
  
  // Trends
  callsChange: number
  minutesChange: number
  costChange: number
}

export interface DailyStats {
  date: string
  calls: number
  minutes: number
  tokens: number
  cost: number
  successRate: number
}

export interface AgentAnalytics {
  agentId: string
  agentName: string
  totalCalls: number
  totalMinutes: number
  avgDuration: number
  successRate: number
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
}
