'use client'

import { Phone, Settings, Trash2, MoreVertical, Copy, Power } from 'lucide-react'
import { Agent } from '@/types/agent'
import { useState } from 'react'

interface AgentCardProps {
  agent: Agent
  onCall: (agent: Agent) => void
  onEdit?: (agent: Agent) => void
  onDelete?: (agent: Agent) => void
  onToggleStatus?: (agent: Agent) => void
  showAdminControls?: boolean
}

export default function AgentCard({
  agent,
  onCall,
  onEdit,
  onDelete,
  onToggleStatus,
  showAdminControls = false,
}: AgentCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const statusConfig = {
    active: { class: 'bg-emerald-500', label: 'Active' },
    inactive: { class: 'bg-slate-500', label: 'Inactive' },
    draft: { class: 'bg-amber-500', label: 'Draft' },
  }

  const status = statusConfig[agent.status]

  const copyAgentId = () => {
    navigator.clipboard.writeText(agent.id)
    setShowMenu(false)
  }

  return (
    <div className="card p-4 flex flex-col h-full animate-fade-in group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-sky-400">
            {agent.displayName.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">
              {agent.displayName}
            </h3>
            <div className={`w-2 h-2 rounded-full ${status.class}`} title={status.label} />
          </div>
          <p className="text-xs text-slate-500 truncate">{agent.name}</p>
        </div>
        
        {showAdminControls && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              onBlur={() => setTimeout(() => setShowMenu(false), 150)}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl py-1 z-10 animate-fade-in">
                {onEdit && (
                  <button
                    onClick={() => { onEdit(agent); setShowMenu(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings size={14} />
                    Configure
                  </button>
                )}
                {onToggleStatus && (
                  <button
                    onClick={() => { onToggleStatus(agent); setShowMenu(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Power size={14} />
                    {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                )}
                <button
                  onClick={copyAgentId}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <Copy size={14} />
                  Copy ID
                </button>
                {onDelete && (
                  <>
                    <div className="border-t border-slate-700/50 my-1" />
                    <button
                      onClick={() => { onDelete(agent); setShowMenu(false) }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
        {agent.description || 'No description'}
      </p>

      {/* Config Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4 text-xs">
        <span className="px-2 py-0.5 bg-slate-900/50 rounded text-slate-500">
          {agent.voice.provider}
        </span>
        <span className="px-2 py-0.5 bg-slate-900/50 rounded text-slate-500">
          {agent.llm.model}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onCall(agent)}
          disabled={agent.status !== 'active'}
          className="btn-primary flex-1 py-2 text-sm"
        >
          <Phone size={16} />
          Call
        </button>
        {showAdminControls && onEdit && (
          <button
            onClick={() => onEdit(agent)}
            className="btn-secondary py-2 px-3"
          >
            <Settings size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
