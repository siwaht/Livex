'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { CreateAgentInput } from '@/types/agent'

interface AgentFormProps {
  onSave: (data: CreateAgentInput) => void
  onCancel: () => void
}

export default function AgentForm({ onSave, onCancel }: AgentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name || formData.displayName.toLowerCase().replace(/\s+/g, '-'),
      displayName: formData.displayName,
      description: formData.description,
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Create New Agent</h2>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-5">
          <div>
            <label className="label">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="input"
              placeholder="Customer Support"
              required
            />
          </div>

          <div>
            <label className="label">Agent ID (optional)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="customer-support"
            />
            <p className="text-xs text-slate-500 mt-1">
              Auto-generated from display name if left empty
            </p>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea h-24"
              placeholder="Brief description of what this agent does..."
            />
          </div>

          <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg">
            💡 After creating the agent, you can configure prompts, voice, LLM settings, webhooks, and more.
          </p>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto">
            Create Agent
          </button>
        </div>
      </div>
    </div>
  )
}
