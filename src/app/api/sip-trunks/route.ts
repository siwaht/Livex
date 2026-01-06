import { NextRequest, NextResponse } from 'next/server'
import { getAllSIPTrunks, createSIPTrunk } from '@/lib/telephony-store'

export async function GET() {
  const trunks = getAllSIPTrunks()
  return NextResponse.json(trunks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const trunk = createSIPTrunk(body)
    return NextResponse.json(trunk, { status: 201 })
  } catch (error) {
    console.error('Create SIP trunk error:', error)
    return NextResponse.json({ error: 'Failed to create SIP trunk' }, { status: 500 })
  }
}
