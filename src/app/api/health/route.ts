import { NextResponse } from 'next/server'
import { validateEnv } from '@/lib/env'
import { getDatabaseStatus } from '@/lib/db'

export async function GET() {
  const envStatus = validateEnv()
  const dbStatus = getDatabaseStatus()
  
  const healthy = envStatus.valid && dbStatus.connected
  
  return NextResponse.json({
    status: healthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      environment: {
        status: envStatus.valid ? 'pass' : 'fail',
        missing: envStatus.missing,
      },
      database: {
        status: dbStatus.connected ? 'pass' : 'fail',
        type: dbStatus.type,
      },
    },
  }, { status: healthy ? 200 : 503 })
}
