import { NextRequest, NextResponse } from 'next/server'
import { getAgent, updateAgent, deleteAgent } from '@/lib/agents-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = getAgent(params.id)
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  return NextResponse.json(agent)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = updateAgent(params.id, body)
    
    if (!updated) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update agent error:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteAgent(params.id)
  if (!deleted) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
