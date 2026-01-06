'use client'

import { useState, useEffect } from 'react'
import { 
  Phone, Clock, DollarSign, TrendingUp, TrendingDown, 
  Activity, CheckCircle, XCircle, BarChart3
} from 'lucide-react'
import { AnalyticsSummary, DailyStats, AgentAnalytics } from '@/types/analytics'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: typeof Phone
  color: string
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            change >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  )
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-12">
      {data.slice(-14).map((value, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color}`}
          style={{ height: `${(value / max) * 100}%`, minHeight: '2px' }}
        />
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [agentStats, setAgentStats] = useState<AgentAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  async function fetchAnalytics() {
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      const data = await response.json()
      setSummary(data.summary)
      setDailyStats(data.dailyStats)
      setAgentStats(data.agentStats)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="spinner w-10 h-10" />
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {(['day', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? 'bg-sky-500/20 text-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Calls"
          value={summary.totalCalls.toLocaleString()}
          change={summary.callsChange}
          icon={Phone}
          color="bg-sky-500/20 text-sky-400"
        />
        <StatCard
          title="Total Minutes"
          value={summary.totalMinutes.toFixed(0)}
          change={summary.minutesChange}
          icon={Clock}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Total Cost"
          value={`$${summary.totalCost.toFixed(2)}`}
          change={summary.costChange}
          icon={DollarSign}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          title="Success Rate"
          value={`${summary.successRate.toFixed(1)}%`}
          icon={Activity}
          color="bg-amber-500/20 text-amber-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Calls Over Time</h3>
            <BarChart3 size={18} className="text-slate-400" />
          </div>
          <MiniChart data={dailyStats.map(d => d.calls)} color="bg-sky-500" />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{dailyStats[0]?.date}</span>
            <span>{dailyStats[dailyStats.length - 1]?.date}</span>
          </div>
        </div>

        {/* Cost chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Cost Over Time</h3>
            <DollarSign size={18} className="text-slate-400" />
          </div>
          <MiniChart data={dailyStats.map(d => d.cost)} color="bg-emerald-500" />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{dailyStats[0]?.date}</span>
            <span>{dailyStats[dailyStats.length - 1]?.date}</span>
          </div>
        </div>
      </div>

      {/* Agent performance */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
                <th className="pb-3 font-medium">Agent</th>
                <th className="pb-3 font-medium text-right">Calls</th>
                <th className="pb-3 font-medium text-right">Minutes</th>
                <th className="pb-3 font-medium text-right">Avg Duration</th>
                <th className="pb-3 font-medium text-right">Success</th>
                <th className="pb-3 font-medium text-right">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {agentStats.map((agent) => (
                <tr key={agent.agentId} className="border-b border-slate-700/30 last:border-0">
                  <td className="py-3 font-medium">{agent.agentName}</td>
                  <td className="py-3 text-right text-slate-300">{agent.totalCalls}</td>
                  <td className="py-3 text-right text-slate-300">{agent.totalMinutes.toFixed(0)}</td>
                  <td className="py-3 text-right text-slate-300">{agent.avgDuration.toFixed(0)}s</td>
                  <td className="py-3 text-right">
                    <span className={agent.successRate >= 80 ? 'text-emerald-400' : agent.successRate >= 60 ? 'text-amber-400' : 'text-red-400'}>
                      {agent.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-emerald-400">{agent.sentiment.positive}</span>
                      <span className="text-slate-400">{agent.sentiment.neutral}</span>
                      <span className="text-red-400">{agent.sentiment.negative}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
            <CheckCircle size={16} />
            <span className="text-lg font-bold">{summary.completedCalls}</span>
          </div>
          <p className="text-xs text-slate-400">Completed</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
            <XCircle size={16} />
            <span className="text-lg font-bold">{summary.failedCalls}</span>
          </div>
          <p className="text-xs text-slate-400">Failed</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
            <Clock size={16} />
            <span className="text-lg font-bold">{summary.avgDuration.toFixed(0)}s</span>
          </div>
          <p className="text-xs text-slate-400">Avg Duration</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
            <Activity size={16} />
            <span className="text-lg font-bold">{summary.avgLatency.toFixed(0)}ms</span>
          </div>
          <p className="text-xs text-slate-400">Avg Latency</p>
        </div>
      </div>
    </div>
  )
}
