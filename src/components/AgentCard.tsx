'use client'

import { Phone, Settings, Trash2, Volume2, MessageSquare } from 'lucide-react'
import { Agent } from '@/types/agent'

interface AgentCardProps {
  agent: Agent
  onCall: (agent: Agent) => void
  onEdit?: (agent: Agent) => void
  onDelete?: (agent: Agent) => void
  showAdminControls?: boolean
}

export default function AgentCard({
  agent,
  onCall,
  onEdit,
  onDelete,
  showAdminControls = false,
}: AgentCardProps) {
  const statusConfig = {
    active: { class: 'badge-success', label: 'Active' },
    inactive: { class: 'badge-danger', label: 'Inactive' },
    draft: { class: 'badge-warning', label: 'Draft' },
  }

  const status = statusConfig[agent.status]

  return (
    <div className="card card-hover p-5 sm:p-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {agent.displayName}
          </h3>
          <span className={status.class}>{status.label}</span>
        </div>
        {showAdminControls && (
          <div className="flex gap-1 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(agent)}
                className="btn-icon"
                aria-label="Configure agent"
              >
                <Settings size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(agent)}
                className="btn-icon hover:!text-red-400"
                aria-label="Delete agent"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
        {agent.description || 'No description provided'}
      </p>

      {/* Config summary */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 rounded-lg text-slate-400">
          <Volume2 size={12} />
          <span className="capitalize">{agent.voice.voiceId}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 rounded-lg text-slate-400">
          <MessageSquare size={12} />
          <span>{agent.llm.model}</span>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onCall(agent)}
        disabled={agent.status !== 'active'}
        className="btn-primary w-full"
      >
        <Phone size={18} />
        <span>Start Call</span>
      </button>
    </div>
  )
}
