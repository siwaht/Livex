import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUser, deleteUser, updateUserLiveKit } from '@/lib/users-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser(params.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  // Mask secret for security
  const safeUser = {
    ...user,
    livekit: user.livekit ? { ...user.livekit, apiSecret: '••••••••' } : null
  }
  return NextResponse.json(safeUser)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = updateUser(params.id, body)
    
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteUser(params.id)
  if (!deleted) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
