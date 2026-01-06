'use client'

import { useState, useEffect } from 'react'
import { Phone, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Search } from 'lucide-react'
import { CallRecord } from '@/types/analytics'

export default function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchCalls()
  }, [])

  async function fetchCalls() {
    try {
      const response = await fetch('/api/analytics/calls?limit=100')
      const data = await response.json()
      setCalls(data.calls)
    } catch (error) {
      console.error('Failed to fetch calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCalls = calls.filter(call => {
    if (statusFilter !== 'all' && call.status !== statusFilter) return false
    if (search && !call.agentId.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const statusIcon = (status: CallRecord['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-emerald-400" />
      case 'failed': return <XCircle size={16} className="text-red-400" />
      case 'active': return <Phone size={16} className="text-sky-400 animate-pulse" />
      default: return <AlertCircle size={16} className="text-amber-400" />
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="spinner w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select w-full sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {/* Call list */}
      <div className="card overflow-hidden">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-12">
            <Phone size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-slate-400">No calls found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0">
                  {statusIcon(call.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{call.agentId}</span>
                    {call.sentiment && (
                      <span className={`badge text-xs ${
                        call.sentiment === 'positive' ? 'badge-success' :
                        call.sentiment === 'negative' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {call.sentiment}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{formatDate(call.startedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDuration(call.duration)}
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">${call.cost.toFixed(4)}</p>
                  <p className="text-xs text-slate-400">{call.tokensUsed.toLocaleString()} tokens</p>
                </div>

                <ChevronRight size={18} className="text-slate-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
