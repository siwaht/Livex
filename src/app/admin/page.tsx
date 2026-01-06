'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AgentCard from '@/components/AgentCard'
import AgentForm from '@/components/AgentForm'
import { Agent, CreateAgentInput } from '@/types/agent'
import { Plus, AlertCircle, Bot, X } from 'lucide-react'

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>()
  const [error, setError] = useState<string | null>(null)

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

  async function handleSave(data: CreateAgentInput) {
    try {
      const url = editingAgent ? `/api/agents/${editingAgent.id}` : '/api/agents'
      const method = editingAgent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save agent')

      await fetchAgents()
      setShowForm(false)
      setEditingAgent(undefined)
    } catch (err) {
      setError('Failed to save agent')
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

  function handleEdit(agent: Agent) {
    setEditingAgent(agent)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingAgent(undefined)
  }

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Agent Management</h1>
              <p className="page-subtitle">Create and manage your voice agents</p>
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

        {/* Error Alert */}
        {error && (
          <div className="alert-error animate-slide-down">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <span className="text-red-400 flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="btn-icon text-red-400 hover:text-red-300"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : agents.length === 0 ? (
          <div className="empty-state card p-8 sm:p-12">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-slate-500" />
            </div>
            <p className="empty-state-text">No agents created yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Create Your First Agent</span>
            </button>
          </div>
        ) : (
          <div className="grid-cards">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onCall={() => {}}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showAdminControls
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <AgentForm
            agent={editingAgent}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  )
}
