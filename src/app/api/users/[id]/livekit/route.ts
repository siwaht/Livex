import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUserLiveKit } from '@/lib/users-store'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { apiKey, apiSecret, wsUrl } = body

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: 'apiKey, apiSecret, and wsUrl are required' },
        { status: 400 }
      )
    }

    const updated = updateUserLiveKit(params.id, { apiKey, apiSecret, wsUrl })
    
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      ...updated,
      livekit: { ...updated.livekit, apiSecret: '••••••••' }
    })
  } catch (error) {
    console.error('Update LiveKit credentials error:', error)
    return NextResponse.json(
      { error: 'Failed to update LiveKit credentials' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const updated = updateUserLiveKit(params.id, null)
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json(updated)
}
