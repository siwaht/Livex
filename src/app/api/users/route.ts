import { NextRequest } from 'next/server'
import { getAllUsers, createUser } from '@/lib/users-store'
import { successResponse, errorResponse, badRequestResponse, parseJsonBody } from '@/lib/api-utils'
import { LiveKitCredentials } from '@/types/user'

export async function GET() {
  try {
    const users = getAllUsers()
    // Don't expose secrets in list view
    const safeUsers = users.map(u => ({
      ...u,
      livekit: u.livekit ? { ...u.livekit, apiSecret: '••••••••' } : null
    }))
    return successResponse(safeUsers)
  } catch (error) {
    return errorResponse('Failed to fetch users', 500, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody<{
      email: string
      name: string
      role?: 'admin' | 'user'
      livekit?: LiveKitCredentials
    }>(request)

    if (!body) {
      return badRequestResponse('Invalid JSON body')
    }

    const { email, name, role, livekit } = body

    if (!email || !name) {
      return badRequestResponse('Email and name are required')
    }

    const user = createUser({
      email,
      name,
      role: role || 'user',
      livekit,
    })

    return successResponse(user, 201)
  } catch (error) {
    return errorResponse('Failed to create user', 500, error)
  }
}
