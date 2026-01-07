import { NextRequest } from 'next/server'
import { getAnalyticsSummary, getDailyStats, getAgentAnalytics } from '@/lib/analytics-store'
import { successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || 'month') as 'day' | 'week' | 'month' | 'year'
    const days = parseInt(searchParams.get('days') || '30')
    
    const summary = getAnalyticsSummary(period)
    const dailyStats = getDailyStats(days)
    const agentStats = getAgentAnalytics()
    
    return successResponse({
      summary,
      dailyStats,
      agentStats,
    })
  } catch (error) {
    return errorResponse('Failed to fetch analytics', 500, error)
  }
}
