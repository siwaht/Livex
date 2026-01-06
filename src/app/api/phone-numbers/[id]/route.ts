import { NextRequest, NextResponse } from 'next/server'
import { getPhoneNumber, updatePhoneNumber, deletePhoneNumber } from '@/lib/telephony-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const phoneNumber = getPhoneNumber(params.id)
  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number not found' }, { status: 404 })
  }
  return NextResponse.json(phoneNumber)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = updatePhoneNumber(params.id, body)
    if (!updated) {
      return NextResponse.json({ error: 'Phone number not found' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update phone number' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deletePhoneNumber(params.id)
  if (!deleted) {
    return NextResponse.json({ error: 'Phone number not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
