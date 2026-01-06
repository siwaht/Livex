'use client'

import { Settings, Trash2, Key, Bot, CheckCircle2, XCircle, CreditCard, Clock } from 'lucide-react'
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
  const billingStatusConfig = {
    active: { class: 'badge-success', label: 'Active' },
    past_due: { class: 'badge-danger', label: 'Past Due' },
    canceled: { class: 'badge-danger', label: 'Canceled' },
    trialing: { class: 'badge-info', label: 'Trial' },
  }

  const billingStatus = billingStatusConfig[user.billingStatus]

  return (
    <div className="card card-hover p-5 sm:p-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-0.5">
            {user.name}
          </h3>
          <p className="text-sm text-slate-400 truncate">{user.email}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={user.role === 'admin' ? 'badge-purple' : 'badge-info'}>
            {user.role}
          </span>
          <span className={billingStatus.class}>{billingStatus.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-slate-900/50 rounded-lg text-center">
          <p className="text-lg font-bold">{user.usage.callsThisMonth}</p>
          <p className="text-xs text-slate-500">Calls</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded-lg text-center">
          <p className="text-lg font-bold">{user.usage.minutesThisMonth.toFixed(0)}</p>
          <p className="text-xs text-slate-500">Minutes</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded-lg text-center">
          <p className="text-lg font-bold">{user.agentIds.length}</p>
          <p className="text-xs text-slate-500">Agents</p>
        </div>
      </div>

      {/* Status indicators */}
      <div className="space-y-2 mb-4 flex-1">
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
          <CreditCard size={16} className="flex-shrink-0" />
          <span className="capitalize">{user.plan} Plan</span>
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
