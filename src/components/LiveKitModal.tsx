'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Trash2, Shield } from 'lucide-react'
import { User, LiveKitCredentials } from '@/types/user'

interface LiveKitModalProps {
  user: User
  onSave: (credentials: LiveKitCredentials) => void
  onRemove: () => void
  onCancel: () => void
}

export default function LiveKitModal({ user, onSave, onRemove, onCancel }: LiveKitModalProps) {
  const [credentials, setCredentials] = useState<LiveKitCredentials>({
    apiKey: user.livekit?.apiKey || '',
    apiSecret: '',
    wsUrl: user.livekit?.wsUrl || '',
  })
  const [showSecret, setShowSecret] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.apiKey && credentials.apiSecret && credentials.wsUrl) {
      onSave(credentials)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-sky-400" />
            </div>
            <div>
              <h2 className="modal-title">LiveKit Credentials</h2>
              <p className="text-sm text-slate-400">{user.name}</p>
            </div>
          </div>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-5">
          <div>
            <label className="label">API Key</label>
            <input
              type="text"
              value={credentials.apiKey}
              onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
              className="input font-mono text-sm"
              placeholder="APIxxxxxxxx"
              required
            />
          </div>

          <div>
            <label className="label">API Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={credentials.apiSecret}
                onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
                className="input font-mono text-sm pr-12"
                placeholder={user.livekit ? '(unchanged)' : 'Enter secret'}
                required={!user.livekit}
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
              value={credentials.wsUrl}
              onChange={(e) => setCredentials({ ...credentials, wsUrl: e.target.value })}
              className="input font-mono text-sm"
              placeholder="wss://your-project.livekit.cloud"
              required
            />
          </div>

          {user.livekit && (
            <button
              type="button"
              onClick={onRemove}
              className="btn-danger w-full"
            >
              <Trash2 size={16} />
              <span>Remove Credentials</span>
            </button>
          )}
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto">
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  )
}
