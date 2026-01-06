'use client'

import Navbar from '@/components/Navbar'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-3">
            <BarChart3 className="text-sky-400" size={28} />
            Analytics Dashboard
          </h1>
          <p className="page-subtitle">
            Monitor your voice agent performance and usage
          </p>
        </div>
        <AnalyticsDashboard />
      </main>
    </div>
  )
}
