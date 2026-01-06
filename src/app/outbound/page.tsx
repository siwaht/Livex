'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { OutboundCall } from '@/types/telephony'
import { PhoneNumber } from '@/types/telephony'
import { Agent } from '@/types/agent'
import { 
  PhoneOutgoing, Plus, Search, AlertCircle, X, Phone,
  Clock, CheckCircle, XCircle, Loader2, PhoneOff, PhoneMissed
} from 'lucide-react'

export default function OutboundPage() {
  const [calls, setCalls] = useState<OutboundCall[]>([])
  const [stats, setStats] = useState<any>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [showCallModal, setShowCallModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // New call form
  const [newCall, setNewCall] = useState({
    agentId: '',
    toNumber: '',
    fromNumberId: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/outbound-calls?stats=true').then(r => r.json()),
      fetch('/api/agents').then(r => r.json()),
      fetch('/api/phone-numbers').then(r => r.json()),
    ]).then(([callsData, agentsData, numbersData]) => {
      setCalls(callsData.calls || callsData)
      setStats(callsData.stats)
      setAgents(agentsData)
      setPhoneNumbers(numbersData.filter((n: PhoneNumber) => n.outboundEnabled))
      setLoading(false)
    }).catch(() => {
      setError('Failed to load data')
      setLoading(false)
    })
  }, [])

  async function handleMakeCall() {
    if (!newCall.agentId || !newCall.toNumber || !newCall.fromNumberId) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/outbound-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCall),
      })

      if (response.ok) {
        const call = await response.json()
        setCalls(prev => [call, ...prev])
        setShowCallModal(false)
        setNewCall({ agentId: '', toNumber: '', fromNumberId: '' })
      } else {
        setError('Failed to initiate call')
      }
    } catch (err) {
      setError('Failed to initiate call')
    }
  }

  const statusIcon = (status: OutboundCall['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-emerald-400" />
      case 'in-progress': return <Loader2 size={16} className="text-sky-400 animate-spin" />
      case 'ringing': 
      case 'dialing': return <Phone size={16} className="text-amber-400 animate-pulse" />
      case 'queued': return <Clock size={16} className="text-slate-400" />
      case 'failed': return <XCircle size={16} className="text-red-400" />
      case 'busy': return <PhoneOff size={16} className="text-amber-400" />
      case 'no-answer': return <PhoneMissed size={16} className="text-slate-400" />
      default: return <Phone size={16} className="text-slate-400" />
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredCalls = statusFilter === 'all' 
    ? calls 
    : calls.filter(c => c.status === statusFilter)

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title flex items-center gap-3">
                <PhoneOutgoing className="text-sky-400" size={28} />
                Outbound Calls
              </h1>
              <p className="page-subtitle">Make and manage outbound voice calls</p>
            </div>
            <button onClick={() => setShowCallModal(true)} className="btn-primary">
              <Plus size={18} />
              <span>New Call</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-error animate-slide-down">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400 flex-1">{error}</span>
            <button onClick={() => setError(null)} className="btn-icon text-red-400">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Calls</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-emerald-400">{stats.answerRate.toFixed(1)}%</p>
              <p className="text-sm text-slate-400">Answer Rate</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
              <p className="text-sm text-slate-400">Total Duration</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
              <p className="text-sm text-slate-400">Total Cost</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="failed">Failed</option>
            <option value="no-answer">No Answer</option>
            <option value="busy">Busy</option>
          </select>
        </div>

        {/* Calls List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="empty-state card p-8">
            <PhoneOutgoing size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-slate-400">No outbound calls yet</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">To</th>
                    <th className="p-4 font-medium">From</th>
                    <th className="p-4 font-medium">Agent</th>
                    <th className="p-4 font-medium text-right">Duration</th>
                    <th className="p-4 font-medium text-right">Cost</th>
                    <th className="p-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.map((call) => {
                    const agent = agents.find(a => a.id === call.agentId)
                    return (
                      <tr key={call.id} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {statusIcon(call.status)}
                            <span className="capitalize text-sm">{call.status.replace('-', ' ')}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{call.toNumber}</td>
                        <td className="p-4 font-mono text-sm text-slate-400">{call.fromNumber}</td>
                        <td className="p-4 text-sm">{agent?.displayName || call.agentId}</td>
                        <td className="p-4 text-right text-sm">{formatDuration(call.duration)}</td>
                        <td className="p-4 text-right text-sm">${(call.cost || 0).toFixed(4)}</td>
                        <td className="p-4 text-right text-sm text-slate-400">
                          {new Date(call.queuedAt).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* New Call Modal */}
        {showCallModal && (
          <div className="modal-overlay" onClick={() => setShowCallModal(false)}>
            <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Make Outbound Call</h2>
                <button onClick={() => setShowCallModal(false)} className="btn-icon">
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body space-y-4">
                <div>
                  <label className="label">Agent</label>
                  <select
                    value={newCall.agentId}
                    onChange={(e) => setNewCall({ ...newCall, agentId: e.target.value })}
                    className="select"
                  >
                    <option value="">Select an agent</option>
                    {agents.filter(a => a.status === 'active').map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.displayName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Phone Number to Call</label>
                  <input
                    type="tel"
                    value={newCall.toNumber}
                    onChange={(e) => setNewCall({ ...newCall, toNumber: e.target.value })}
                    className="input font-mono"
                    placeholder="+15551234567"
                  />
                  <p className="text-xs text-slate-500 mt-1">Include country code (e.g., +1 for US)</p>
                </div>
                <div>
                  <label className="label">From Number</label>
                  <select
                    value={newCall.fromNumberId}
                    onChange={(e) => setNewCall({ ...newCall, fromNumberId: e.target.value })}
                    className="select"
                  >
                    <option value="">Select caller ID</option>
                    {phoneNumbers.map(number => (
                      <option key={number.id} value={number.id}>{number.formattedNumber}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowCallModal(false)} className="btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button onClick={handleMakeCall} className="btn-primary w-full sm:w-auto">
                  <PhoneOutgoing size={18} />
                  <span>Start Call</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
