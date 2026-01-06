'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AgentCard from '@/components/AgentCard'
import AgentForm from '@/components/AgentForm'
import AgentConfig from '@/components/AgentConfig'
import { Agent, CreateAgentInput } from '@/types/agent'
import { Plus, AlertCircle, Bot, X, Search } from 'lucide-react'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [configAgent, setConfigAgent] = useState<Agent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

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
    if (!confirm(`Delete "${agent.displayName}"? This cannot be undone.`)) return

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

  const filteredAgents = agents.filter(agent =>
    agent.displayName.toLowerCase().includes(search.toLowerCase()) ||
    agent.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title flex items-center gap-3">
                <Bot className="text-sky-400" size={28} />
                Voice Agents
              </h1>
              <p className="page-subtitle">Create and configure your AI voice agents</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>New Agent</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {error && (
          <div className="alert-error animate-slide-down">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <span className="text-red-400 flex-1">{error}</span>
            <button onClick={() => setError(null)} className="btn-icon text-red-400">
              <X size={18} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="empty-state card p-8 sm:p-12">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-slate-500" />
            </div>
            <p className="empty-state-text">
              {search ? 'No agents match your search' : 'No agents created yet'}
            </p>
            {!search && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={18} />
                <span>Create Your First Agent</span>
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
                onEdit={() => setConfigAgent(agent)}
                onDelete={handleDelete}
                showAdminControls
              />
            ))}
          </div>
        )}

        {showForm && (
          <AgentForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
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
