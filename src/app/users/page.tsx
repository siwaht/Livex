'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import UserCard from '@/components/UserCard'
import UserForm from '@/components/UserForm'
import LiveKitModal from '@/components/LiveKitModal'
import AgentAssignModal from '@/components/AgentAssignModal'
import { User, CreateUserInput, LiveKitCredentials } from '@/types/user'
import { Plus, AlertCircle, Users, X, Search } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [liveKitUser, setLiveKitUser] = useState<User | null>(null)
  const [agentUser, setAgentUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(data: CreateUserInput) {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save user')

      await fetchUsers()
      setShowForm(false)
      setEditingUser(undefined)
    } catch (err) {
      setError('Failed to save user')
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete "${user.name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete user')
      await fetchUsers()
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  async function handleSaveLiveKit(credentials: LiveKitCredentials) {
    if (!liveKitUser) return

    try {
      const response = await fetch(`/api/users/${liveKitUser.id}/livekit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) throw new Error('Failed to save credentials')

      await fetchUsers()
      setLiveKitUser(null)
    } catch (err) {
      setError('Failed to save LiveKit credentials')
    }
  }

  async function handleRemoveLiveKit() {
    if (!liveKitUser) return

    try {
      const response = await fetch(`/api/users/${liveKitUser.id}/livekit`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove credentials')

      await fetchUsers()
      setLiveKitUser(null)
    } catch (err) {
      setError('Failed to remove LiveKit credentials')
    }
  }

  async function handleAssignAgent(agentId: string) {
    if (!agentUser) return

    try {
      const response = await fetch(`/api/users/${agentUser.id}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })

      if (!response.ok) throw new Error('Failed to assign agent')

      await fetchUsers()
      setAgentUser(prev => prev ? {
        ...prev,
        agentIds: [...prev.agentIds, agentId]
      } : null)
    } catch (err) {
      setError('Failed to assign agent')
    }
  }

  async function handleRemoveAgent(agentId: string) {
    if (!agentUser) return

    try {
      const response = await fetch(`/api/users/${agentUser.id}/agents`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })

      if (!response.ok) throw new Error('Failed to remove agent')

      await fetchUsers()
      setAgentUser(prev => prev ? {
        ...prev,
        agentIds: prev.agentIds.filter(id => id !== agentId)
      } : null)
    } catch (err) {
      setError('Failed to remove agent')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title flex items-center gap-3">
                <Users className="text-sky-400" size={28} />
                User Management
              </h1>
              <p className="page-subtitle">Manage users and their LiveKit accounts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>New User</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {error && (
          <div className="alert-error animate-slide-down">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <span className="text-red-400 flex-1">{error}</span>
            <button onClick={() => setError(null)} className="btn-icon text-red-400">
              <X size={18} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state card p-8 sm:p-12">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-500" />
            </div>
            <p className="empty-state-text">
              {search ? 'No users match your search' : 'No users created yet'}
            </p>
            {!search && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={18} />
                <span>Create Your First User</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid-cards">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={(u) => { setEditingUser(u); setShowForm(true) }}
                onDelete={handleDelete}
                onManageLiveKit={setLiveKitUser}
                onManageAgents={setAgentUser}
              />
            ))}
          </div>
        )}

        {showForm && (
          <UserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingUser(undefined) }}
          />
        )}

        {liveKitUser && (
          <LiveKitModal
            user={liveKitUser}
            onSave={handleSaveLiveKit}
            onRemove={handleRemoveLiveKit}
            onCancel={() => setLiveKitUser(null)}
          />
        )}

        {agentUser && (
          <AgentAssignModal
            user={agentUser}
            onAssign={handleAssignAgent}
            onRemove={handleRemoveAgent}
            onCancel={() => setAgentUser(null)}
          />
        )}
      </main>
    </div>
  )
}
