import { NextRequest, NextResponse } from 'next/server'
import { getAllPhoneNumbers, createPhoneNumber } from '@/lib/telephony-store'

export async function GET() {
  const phoneNumbers = getAllPhoneNumbers()
  return NextResponse.json(phoneNumbers)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const phoneNumber = createPhoneNumber(body)
    return NextResponse.json(phoneNumber, { status: 201 })
  } catch (error) {
    console.error('Create phone number error:', error)
    return NextResponse.json({ error: 'Failed to create phone number' }, { status: 500 })
  }
}
