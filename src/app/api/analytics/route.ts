import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary, getDailyStats, getAgentAnalytics } from '@/lib/analytics-store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') || 'month') as 'day' | 'week' | 'month' | 'year'
  const days = parseInt(searchParams.get('days') || '30')
  
  const summary = getAnalyticsSummary(period)
  const dailyStats = getDailyStats(days)
  const agentStats = getAgentAnalytics()
  
  return NextResponse.json({
    summary,
    dailyStats,
    agentStats,
  })
}
