'use client'

import { Settings, Trash2, Key, Bot, CheckCircle2, XCircle } from 'lucide-react'
import { User } from '@/types/user'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onManageLiveKit: (user: User) => void
  onManageAgents: (user: User) => void
}

export default function UserCard({
  user,
  onEdit,
  onDelete,
  onManageLiveKit,
  onManageAgents,
}: UserCardProps) {
  return (
    <div className="card card-hover p-5 sm:p-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {user.name}
          </h3>
          <p className="text-sm text-slate-400 truncate">{user.email}</p>
        </div>
        <span className={user.role === 'admin' ? 'badge-purple' : 'badge-info'}>
          {user.role}
        </span>
      </div>

      {/* Status indicators */}
      <div className="space-y-2.5 mb-5 flex-1">
        <div className="flex items-center gap-2.5 text-sm">
          {user.livekit ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-400">LiveKit Connected</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-slate-500 flex-shrink-0" />
              <span className="text-slate-500">No LiveKit Account</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-400">
          <Bot size={16} className="flex-shrink-0" />
          <span>
            {user.agentIds.length} agent{user.agentIds.length !== 1 ? 's' : ''} assigned
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onManageLiveKit(user)}
          className="btn-secondary btn-sm flex-1"
        >
          <Key size={16} />
          <span>LiveKit</span>
        </button>
        <button
          onClick={() => onManageAgents(user)}
          className="btn-secondary btn-sm flex-1"
        >
          <Bot size={16} />
          <span>Agents</span>
        </button>
        <div className="flex gap-2 sm:gap-1">
          <button
            onClick={() => onEdit(user)}
            className="btn-icon flex-1 sm:flex-none"
            aria-label="Edit user"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="btn-icon flex-1 sm:flex-none hover:!text-red-400"
            aria-label="Delete user"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
