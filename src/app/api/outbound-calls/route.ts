import { NextRequest, NextResponse } from 'next/server'
import { getAllOutboundCalls, createOutboundCall, getOutboundCallStats } from '@/lib/telephony-store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeStats = searchParams.get('stats') === 'true'
  
  const calls = getAllOutboundCalls()
  
  if (includeStats) {
    const stats = getOutboundCallStats()
    return NextResponse.json({ calls, stats })
  }
  
  return NextResponse.json(calls)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, toNumber, fromNumberId, customCallerId, dtmfSequence, playDialtone } = body

    if (!agentId || !toNumber || !fromNumberId) {
      return NextResponse.json(
        { error: 'agentId, toNumber, and fromNumberId are required' },
        { status: 400 }
      )
    }

    const call = createOutboundCall({
      agentId,
      toNumber,
      fromNumberId,
      customCallerId,
      dtmfSequence,
      playDialtone,
    })

    // In production, this would trigger the actual LiveKit SIP call
    // await livekitSipService.createOutboundCall(call)

    return NextResponse.json(call, { status: 201 })
  } catch (error) {
    console.error('Create outbound call error:', error)
    return NextResponse.json({ error: 'Failed to create outbound call' }, { status: 500 })
  }
}
