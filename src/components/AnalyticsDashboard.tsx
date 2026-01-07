'use client'

import { useState, useEffect } from 'react'
import { 
  Phone, Clock, DollarSign, TrendingUp, TrendingDown, 
  Activity, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { AnalyticsSummary, DailyStats, AgentAnalytics } from '@/types/analytics'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: typeof Phone
  iconBg: string
  iconColor: string
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400">{title}</p>
            {change !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${
                change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(change).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.slice(-14).map((value, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} transition-all hover:opacity-80`}
          style={{ height: `${Math.max((value / max) * 100, 4)}%` }}
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
    setLoading(true)
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
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={32} className="text-slate-500 mx-auto mb-3" />
        <p className="text-slate-400">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg w-fit">
        {(['day', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              period === p
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {p === 'day' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Calls"
          value={summary.totalCalls.toLocaleString()}
          change={summary.callsChange}
          icon={Phone}
          iconBg="bg-sky-500/20"
          iconColor="text-sky-400"
        />
        <StatCard
          title="Minutes"
          value={summary.totalMinutes.toFixed(0)}
          change={summary.minutesChange}
          icon={Clock}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
        />
        <StatCard
          title="Cost"
          value={`$${summary.totalCost.toFixed(2)}`}
          change={summary.costChange}
          icon={DollarSign}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Success Rate"
          value={`${summary.successRate.toFixed(0)}%`}
          icon={Activity}
          iconBg="bg-amber-500/20"
          iconColor="text-amber-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Calls</h3>
            <span className="text-xs text-slate-500">Last 14 days</span>
          </div>
          <MiniChart data={dailyStats.map(d => d.calls)} color="bg-sky-500" />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Cost</h3>
            <span className="text-xs text-slate-500">Last 14 days</span>
          </div>
          <MiniChart data={dailyStats.map(d => d.cost)} color="bg-emerald-500" />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-0.5">
            <CheckCircle size={14} />
            <span className="font-bold">{summary.completedCalls}</span>
          </div>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-red-400 mb-0.5">
            <XCircle size={14} />
            <span className="font-bold">{summary.failedCalls}</span>
          </div>
          <p className="text-xs text-slate-500">Failed</p>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-0.5">
            <Clock size={14} />
            <span className="font-bold">{summary.avgDuration.toFixed(0)}s</span>
          </div>
          <p className="text-xs text-slate-500">Avg Duration</p>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-0.5">
            <Activity size={14} />
            <span className="font-bold">{summary.avgLatency.toFixed(0)}ms</span>
          </div>
          <p className="text-xs text-slate-500">Latency</p>
        </div>
      </div>

      {/* Agent Performance Table */}
      {agentStats.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="font-medium">Agent Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/30">
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium text-right">Calls</th>
                  <th className="px-4 py-3 font-medium text-right">Minutes</th>
                  <th className="px-4 py-3 font-medium text-right">Avg</th>
                  <th className="px-4 py-3 font-medium text-right">Success</th>
                </tr>
              </thead>
              <tbody>
                {agentStats.slice(0, 5).map((agent) => (
                  <tr key={agent.agentId} className="border-b border-slate-700/20 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium">{agent.agentName}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{agent.totalCalls}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{agent.totalMinutes.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{agent.avgDuration.toFixed(0)}s</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${
                        agent.successRate >= 80 ? 'text-emerald-400' : 
                        agent.successRate >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {agent.successRate.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
