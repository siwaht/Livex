'use client'

import Navbar from '@/components/Navbar'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default function DashboardPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-sm text-slate-400">Monitor performance and usage</p>
        </div>
        <AnalyticsDashboard />
      </main>
    </div>
  )
}
