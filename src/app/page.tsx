'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AgentCard from '@/components/AgentCard'
import VoiceCall from '@/components/VoiceCall'
import { Agent } from '@/types/agent'
import { PhoneCall, Search, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCall, setActiveCall] = useState<Agent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAgents()
  }, [])

  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      setAgents(data.filter((a: Agent) => a.status === 'active'))
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (activeCall) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="flex-1 flex">
          <VoiceCall agent={activeCall} onEnd={() => setActiveCall(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Voice AI Agents
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Start a conversation with any of our AI-powered voice agents
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-10 h-10" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="text-slate-600" size={32} />
            </div>
            <p className="text-slate-400">
              {searchQuery ? 'No agents match your search' : 'No agents available'}
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onCall={setActiveCall}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
