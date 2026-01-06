'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { PhoneNumber, SIPTrunk } from '@/types/telephony'
import { Agent } from '@/types/agent'
import { 
  Phone, Plus, Settings, Trash2, Search, AlertCircle, X,
  PhoneIncoming, PhoneOutgoing, CheckCircle2, XCircle, Globe
} from 'lucide-react'

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [sipTrunks, setSipTrunks] = useState<SIPTrunk[]>([])
  const [loading, setLoading] = useState(true)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showTrunkModal, setShowTrunkModal] = useState(false)
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/phone-numbers').then(r => r.json()),
      fetch('/api/agents').then(r => r.json()),
      fetch('/api/sip-trunks').then(r => r.json()),
    ]).then(([numbers, agentsData, trunks]) => {
      setPhoneNumbers(numbers)
      setAgents(agentsData)
      setSipTrunks(trunks)
      setLoading(false)
    }).catch(() => {
      setError('Failed to load data')
      setLoading(false)
    })
  }, [])

  async function handleAssignAgent(numberId: string, agentId: string) {
    try {
      const response = await fetch(`/api/phone-numbers/${numberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedAgentId: agentId || null }),
      })
      if (response.ok) {
        const updated = await response.json()
        setPhoneNumbers(prev => prev.map(p => p.id === numberId ? updated : p))
      }
    } catch (err) {
      setError('Failed to assign agent')
    }
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title flex items-center gap-3">
                <Phone className="text-sky-400" size={28} />
                Phone Numbers
              </h1>
              <p className="page-subtitle">Manage phone numbers and SIP trunks for voice calls</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowTrunkModal(true)} className="btn-secondary">
                <Settings size={18} />
                <span className="hidden sm:inline">SIP Trunks</span>
              </button>
              <button onClick={() => setShowBuyModal(true)} className="btn-primary">
                <Plus size={18} />
                <span>Buy Number</span>
              </button>
            </div>
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

        {/* SIP Trunks Summary */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-slate-400" />
              <div>
                <p className="font-medium">SIP Trunks</p>
                <p className="text-sm text-slate-400">
                  {sipTrunks.filter(t => t.status === 'active').length} active trunk(s) configured
                </p>
              </div>
            </div>
            <button onClick={() => setShowTrunkModal(true)} className="btn-ghost btn-sm">
              Manage
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : phoneNumbers.length === 0 ? (
          <div className="empty-state card p-8 sm:p-12">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone size={32} className="text-slate-500" />
            </div>
            <p className="empty-state-text">No phone numbers yet</p>
            <p className="text-sm text-slate-500 mb-6">
              Purchase phone numbers to enable inbound and outbound calls
            </p>
            <button onClick={() => setShowBuyModal(true)} className="btn-primary">
              <Plus size={18} />
              <span>Buy Your First Number</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {phoneNumbers.map((number) => {
              const assignedAgent = agents.find(a => a.id === number.assignedAgentId)
              return (
                <div key={number.id} className="card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Number info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-lg font-mono font-semibold">{number.formattedNumber}</p>
                        <span className={number.status === 'active' ? 'badge-success' : 'badge-warning'}>
                          {number.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Globe size={14} />
                          {number.country} {number.region && `• ${number.region}`}
                        </span>
                        <span className="capitalize">{number.provider}</span>
                        <span>${number.monthlyCost}/mo</span>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {number.inboundEnabled ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-sm">
                            <PhoneIncoming size={16} />
                            <span className="hidden sm:inline">Inbound</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <PhoneIncoming size={16} />
                          </div>
                        )}
                        {number.outboundEnabled ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-sm">
                            <PhoneOutgoing size={16} />
                            <span className="hidden sm:inline">Outbound</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <PhoneOutgoing size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agent assignment */}
                    <div className="flex items-center gap-2">
                      <select
                        value={number.assignedAgentId || ''}
                        onChange={(e) => handleAssignAgent(number.id, e.target.value)}
                        className="select w-40 text-sm"
                      >
                        <option value="">No agent</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.displayName}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingNumber(number)}
                        className="btn-icon"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Buy Number Modal */}
        {showBuyModal && (
          <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
            <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Buy Phone Number</h2>
                <button onClick={() => setShowBuyModal(false)} className="btn-icon">
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body space-y-4">
                <div>
                  <label className="label">Country</label>
                  <select className="select">
                    <option value="US">United States (+1)</option>
                    <option value="CA">Canada (+1)</option>
                    <option value="GB">United Kingdom (+44)</option>
                    <option value="AU">Australia (+61)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Area Code (optional)</label>
                  <input type="text" className="input" placeholder="415" maxLength={3} />
                </div>
                <div>
                  <label className="label">Provider</label>
                  <select className="select">
                    <option value="twilio">Twilio</option>
                    <option value="telnyx">Telnyx</option>
                    <option value="vonage">Vonage</option>
                    <option value="plivo">Plivo</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-sm text-slate-400 mb-2">Estimated Cost</p>
                  <p className="text-2xl font-bold">$1.00<span className="text-sm font-normal text-slate-400">/month</span></p>
                  <p className="text-xs text-slate-500">+ $0.0085/min for calls</p>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowBuyModal(false)} className="btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button className="btn-primary w-full sm:w-auto">
                  Search Numbers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIP Trunk Modal */}
        {showTrunkModal && (
          <div className="modal-overlay" onClick={() => setShowTrunkModal(false)}>
            <div className="modal-content modal-content-lg animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">SIP Trunks</h2>
                <button onClick={() => setShowTrunkModal(false)} className="btn-icon">
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p className="text-sm text-slate-400 mb-4">
                  Configure SIP trunks to connect your telephony provider (Twilio, Telnyx, etc.) to LiveKit.
                </p>
                
                {sipTrunks.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <Globe size={32} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-slate-500 text-sm mb-4">No SIP trunks configured</p>
                    <button className="btn-primary btn-sm">
                      <Plus size={16} />
                      Add SIP Trunk
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sipTrunks.map(trunk => (
                      <div key={trunk.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{trunk.name}</span>
                            <span className={trunk.status === 'active' ? 'badge-success' : 'badge-danger'}>
                              {trunk.status}
                            </span>
                          </div>
                          <span className="text-sm text-slate-400 capitalize">{trunk.provider}</span>
                        </div>
                        <div className="text-sm text-slate-400 space-y-1">
                          <p>Type: <span className="text-slate-300 capitalize">{trunk.type}</span></p>
                          {trunk.terminationUri && (
                            <p>Termination: <code className="text-xs bg-slate-800 px-1 rounded">{trunk.terminationUri}</code></p>
                          )}
                        </div>
                      </div>
                    ))}
                    <button className="btn-secondary btn-sm w-full">
                      <Plus size={16} />
                      Add Another Trunk
                    </button>
                  </div>
                )}

                <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl">
                  <h4 className="font-medium text-sky-400 mb-2">Setup Guide</h4>
                  <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Create a SIP trunk in your provider (Twilio, Telnyx, etc.)</li>
                    <li>Configure the origination URI to point to LiveKit</li>
                    <li>Set up authentication credentials</li>
                    <li>Add the trunk details here</li>
                  </ol>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowTrunkModal(false)} className="btn-secondary w-full">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
