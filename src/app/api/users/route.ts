import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser } from '@/lib/users-store'

export async function GET() {
  const users = getAllUsers()
  // Don't expose secrets in list view
  const safeUsers = users.map(u => ({
    ...u,
    livekit: u.livekit ? { ...u.livekit, apiSecret: '••••••••' } : null
  }))
  return NextResponse.json(safeUsers)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role, livekit } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    const user = createUser({
      email,
      name,
      role: role || 'user',
      livekit: livekit || undefined,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
