'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Bot, Search } from 'lucide-react'
import { User } from '@/types/user'
import { Agent } from '@/types/agent'

interface AgentAssignModalProps {
  user: User
  onAssign: (agentId: string) => void
  onRemove: (agentId: string) => void
  onCancel: () => void
}

export default function AgentAssignModal({ user, onAssign, onRemove, onCancel }: AgentAssignModalProps) {
  const [allAgents, setAllAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAllAgents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const assignedAgents = allAgents.filter(a => user.agentIds.includes(a.id))
  const availableAgents = allAgents.filter(a => !user.agentIds.includes(a.id))

  const handleAssign = () => {
    if (selectedAgent) {
      onAssign(selectedAgent)
      setSelectedAgent('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="modal-title">Manage Agents</h2>
              <p className="text-sm text-slate-400">{user.name}</p>
            </div>
          </div>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-8 h-8" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add agent section */}
              <div>
                <label className="label">Add Agent</label>
                <div className="flex gap-2">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="select flex-1"
                    disabled={availableAgents.length === 0}
                  >
                    <option value="">
                      {availableAgents.length === 0 ? 'No agents available' : 'Select an agent...'}
                    </option>
                    {availableAgents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.displayName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={!selectedAgent}
                    className="btn-primary"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>

              <div className="divider" />

              {/* Assigned agents list */}
              <div>
                <label className="label">
                  Assigned Agents ({assignedAgents.length})
                </label>
                {assignedAgents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <Search size={24} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-slate-500 text-sm">No agents assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {assignedAgents.map(agent => (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 group hover:border-slate-600/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate">{agent.displayName}</p>
                          <p className="text-sm text-slate-400 truncate">{agent.description}</p>
                        </div>
                        <button
                          onClick={() => onRemove(agent.id)}
                          className="btn-icon ml-2 opacity-50 group-hover:opacity-100 hover:!text-red-400"
                          aria-label="Remove agent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary w-full">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
