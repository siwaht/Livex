'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Key } from 'lucide-react'
import { User, CreateUserInput, LiveKitCredentials } from '@/types/user'

interface UserFormProps {
  user?: User
  onSave: (data: CreateUserInput) => void
  onCancel: () => void
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || 'user' as 'admin' | 'user',
  })
  
  const [livekit, setLivekit] = useState<LiveKitCredentials>({
    apiKey: '',
    apiSecret: '',
    wsUrl: '',
  })
  
  const [showSecret, setShowSecret] = useState(false)
  const [includeLiveKit, setIncludeLiveKit] = useState(!!user?.livekit)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      livekit: includeLiveKit && livekit.apiKey ? livekit : undefined,
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content modal-content-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              className="select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="divider" />

          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeLiveKit}
                onChange={(e) => setIncludeLiveKit(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
              />
              <div className="flex items-center gap-2">
                <Key size={18} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
                <span className="font-medium">Assign LiveKit Account</span>
              </div>
            </label>

            {includeLiveKit && (
              <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-4 animate-fade-in">
                <div>
                  <label className="label">API Key</label>
                  <input
                    type="text"
                    value={livekit.apiKey}
                    onChange={(e) => setLivekit({ ...livekit, apiKey: e.target.value })}
                    className="input font-mono text-sm"
                    placeholder="APIxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="label">API Secret</label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={livekit.apiSecret}
                      onChange={(e) => setLivekit({ ...livekit, apiSecret: e.target.value })}
                      className="input font-mono text-sm pr-12"
                      placeholder="••••••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label={showSecret ? 'Hide secret' : 'Show secret'}
                    >
                      {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">WebSocket URL</label>
                  <input
                    type="text"
                    value={livekit.wsUrl}
                    onChange={(e) => setLivekit({ ...livekit, wsUrl: e.target.value })}
                    className="input font-mono text-sm"
                    placeholder="wss://your-project.livekit.cloud"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto">
            {user ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  )
}
