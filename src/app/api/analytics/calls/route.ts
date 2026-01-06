import { NextRequest, NextResponse } from 'next/server'
import { getAllCalls, getCallsByAgent } from '@/lib/analytics-store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agentId')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  let calls = agentId ? getCallsByAgent(agentId) : getAllCalls()
  
  const total = calls.length
  calls = calls.slice(offset, offset + limit)
  
  return NextResponse.json({
    calls,
    total,
    limit,
    offset,
  })
}
