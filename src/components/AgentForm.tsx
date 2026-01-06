'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Agent, CreateAgentInput } from '@/types/agent'

interface AgentFormProps {
  agent?: Agent
  onSave: (data: CreateAgentInput) => void
  onCancel: () => void
}

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Male)' },
  { value: 'fable', label: 'Fable (British)' },
  { value: 'onyx', label: 'Onyx (Deep Male)' },
  { value: 'nova', label: 'Nova (Female)' },
  { value: 'shimmer', label: 'Shimmer (Soft Female)' },
]

export default function AgentForm({ agent, onSave, onCancel }: AgentFormProps) {
  const [formData, setFormData] = useState<CreateAgentInput>({
    name: agent?.name || '',
    displayName: agent?.displayName || '',
    description: agent?.description || '',
    welcomeMessage: agent?.welcomeMessage || 'Hello! How can I help you today?',
    instructions: agent?.instructions || '',
    voice: agent?.voice || 'alloy',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content modal-content-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {agent ? 'Edit Agent' : 'Create New Agent'}
          </h2>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Agent ID</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="support-agent"
                required
                disabled={!!agent}
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Unique identifier (no spaces)
              </p>
            </div>
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
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="Brief description of the agent's purpose"
            />
          </div>

          <div>
            <label className="label">Voice</label>
            <select
              value={formData.voice}
              onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
              className="select"
            >
              {VOICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Welcome Message</label>
            <input
              type="text"
              value={formData.welcomeMessage}
              onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
              className="input"
              placeholder="Hello! How can I help you today?"
            />
          </div>

          <div>
            <label className="label">Instructions (System Prompt)</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="textarea h-28"
              placeholder="Define the agent's personality, behavior, and capabilities..."
            />
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto">
            {agent ? 'Save Changes' : 'Create Agent'}
          </button>
        </div>
      </div>
    </div>
  )
}
