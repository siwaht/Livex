'use client'

import { Phone, Settings, Trash2, Volume2 } from 'lucide-react'
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
                aria-label="Edit agent"
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

      {/* Voice info */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
        <Volume2 size={14} />
        <span className="capitalize">{agent.voice}</span>
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
