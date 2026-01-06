'use client'

import Navbar from '@/components/Navbar'
import CallHistory from '@/components/CallHistory'
import { History } from 'lucide-react'

export default function CallsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-3">
            <History className="text-sky-400" size={28} />
            Call History
          </h1>
          <p className="page-subtitle">
            View and analyze all voice agent calls
          </p>
        </div>
        <CallHistory />
      </main>
    </div>
  )
}
