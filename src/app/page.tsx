'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import VoiceCall from '@/components/VoiceCall'
import { Agent } from '@/types/agent'
import { 
  Phone, Bot, Users, BarChart3, PhoneOutgoing, 
  ArrowRight, Zap, Clock, TrendingUp, Sparkles,
  Play, Settings
} from 'lucide-react'

interface QuickStats {
  totalAgents: number
  activeAgents: number
  totalCalls: number
  totalMinutes: number
}

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCall, setActiveCall] = useState<Agent | null>(null)

  useEffect(() => {
    Promise.all([fetchAgents(), fetchStats()])
      .finally(() => setLoading(false))
  }, [])

  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      setAgents(data)
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/analytics?period=month')
      const data = await response.json()
      setStats({
        totalAgents: 0,
        activeAgents: 0,
        totalCalls: data.summary?.totalCalls || 0,
        totalMinutes: data.summary?.totalMinutes || 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const activeAgents = agents.filter(a => a.status === 'active')

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back 👋
          </h1>
          <p className="text-slate-400">
            Manage your voice agents and monitor performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <Bot size={20} className="text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeAgents.length}</p>
                <p className="text-xs text-slate-400">Active Agents</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Phone size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalCalls || 0}</p>
                <p className="text-xs text-slate-400">Total Calls</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(stats?.totalMinutes || 0)}</p>
                <p className="text-xs text-slate-400">Minutes Used</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-xs text-slate-400">Total Agents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/agents" className="card card-hover p-5 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <ArrowRight size={20} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold mb-1">Manage Agents</h3>
            <p className="text-sm text-slate-400">Create and configure voice AI agents</p>
          </Link>

          <Link href="/outbound" className="card card-hover p-5 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <PhoneOutgoing size={24} className="text-white" />
              </div>
              <ArrowRight size={20} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold mb-1">Outbound Calls</h3>
            <p className="text-sm text-slate-400">Initiate calls to your customers</p>
          </Link>

          <Link href="/dashboard" className="card card-hover p-5 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <ArrowRight size={20} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold mb-1">View Analytics</h3>
            <p className="text-sm text-slate-400">Monitor performance and usage</p>
          </Link>
        </div>

        {/* Test Your Agents */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Quick Test
            </h2>
            <Link href="/agents" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner w-8 h-8" />
            </div>
          ) : activeAgents.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot size={28} className="text-slate-500" />
              </div>
              <h3 className="font-semibold mb-2">No Active Agents</h3>
              <p className="text-sm text-slate-400 mb-4">Create your first agent to start making calls</p>
              <Link href="/agents" className="btn-primary inline-flex">
                <Sparkles size={18} />
                Create Agent
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAgents.slice(0, 3).map((agent) => (
                <div key={agent.id} className="card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-sky-400">
                      {agent.displayName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{agent.displayName}</h3>
                    <p className="text-xs text-slate-400 truncate">{agent.description || 'Voice agent'}</p>
                  </div>
                  <button
                    onClick={() => setActiveCall(agent)}
                    className="btn-primary btn-sm flex-shrink-0"
                  >
                    <Play size={14} />
                    Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Getting Started */}
        {agents.length === 0 && !loading && (
          <div className="card p-6 bg-gradient-to-br from-sky-500/10 to-purple-500/10 border-sky-500/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-sky-400" />
              Getting Started
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-sm">1</div>
                <div>
                  <p className="font-medium text-sm">Create an Agent</p>
                  <p className="text-xs text-slate-400">Set up your first voice AI agent</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-sm">2</div>
                <div>
                  <p className="font-medium text-sm">Configure Settings</p>
                  <p className="text-xs text-slate-400">Add prompts, voice, and LLM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-sm">3</div>
                <div>
                  <p className="font-medium text-sm">Start Calling</p>
                  <p className="text-xs text-slate-400">Test or deploy to production</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
