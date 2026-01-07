'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AgentCard from '@/components/AgentCard'
import AgentForm from '@/components/AgentForm'
import AgentConfig from '@/components/AgentConfig'
import { Agent, CreateAgentInput } from '@/types/agent'
import { Plus, AlertCircle, Bot, X, Search, Filter } from 'lucide-react'

type StatusFilter = 'all' | 'active' | 'inactive' | 'draft'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [configAgent, setConfigAgent] = useState<Agent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    fetchAgents()
  }, [])

  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      setAgents(data)
    } catch (err) {
      setError('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(data: CreateAgentInput) {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create agent')
      await fetchAgents()
      setShowForm(false)
    } catch (err) {
      setError('Failed to create agent')
    }
  }

  async function handleSaveConfig(updates: Partial<Agent>) {
    if (!configAgent) return
    try {
      const response = await fetch(`/api/agents/${configAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update agent')
      await fetchAgents()
      setConfigAgent(null)
    } catch (err) {
      setError('Failed to update agent')
    }
  }

  async function handleDelete(agent: Agent) {
    if (!confirm(`Delete "${agent.displayName}"?`)) return
    try {
      const response = await fetch(`/api/agents/${agent.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete agent')
      await fetchAgents()
    } catch (err) {
      setError('Failed to delete agent')
    }
  }

  async function handleToggleStatus(agent: Agent) {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active'
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update status')
      await fetchAgents()
    } catch (err) {
      setError('Failed to update agent status')
    }
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.displayName.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    inactive: agents.filter(a => a.status === 'inactive').length,
    draft: agents.filter(a => a.status === 'draft').length,
  }

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Agents</h1>
            <p className="text-sm text-slate-400">{agents.length} total agents</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={18} />
            New Agent
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 py-2"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
            {(['all', 'active', 'inactive', 'draft'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1.5 text-xs text-slate-500">({statusCounts[status]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error mb-6 animate-slide-down">
            <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
            <span className="text-red-400 flex-1 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-8 h-8" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={28} className="text-slate-600" />
            </div>
            <h3 className="font-semibold mb-1">
              {search || statusFilter !== 'all' ? 'No matching agents' : 'No agents yet'}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first voice agent to get started'}
            </p>
            {!search && statusFilter === 'all' && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={18} />
                Create Agent
              </button>
            )}
          </div>
        ) : (
          <div className="grid-cards">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onCall={() => {}}
                onEdit={setConfigAgent}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                showAdminControls
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showForm && (
          <AgentForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        )}
        {configAgent && (
          <AgentConfig
            agent={configAgent}
            onSave={handleSaveConfig}
            onCancel={() => setConfigAgent(null)}
          />
        )}
      </main>
    </div>
  )
}
