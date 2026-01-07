'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  DisconnectButton,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Mic, MicOff, PhoneOff, ArrowLeft, Loader2, Volume2 } from 'lucide-react'
import { Agent } from '@/types/agent'

interface VoiceCallProps {
  agent: Agent
  onEnd: () => void
}

function AgentVisualizer() {
  const { state, audioTrack } = useVoiceAssistant()

  const stateConfig: Record<string, { label: string; color: string }> = {
    listening: { label: 'Listening', color: 'text-emerald-400' },
    thinking: { label: 'Thinking', color: 'text-amber-400' },
    speaking: { label: 'Speaking', color: 'text-sky-400' },
    idle: { label: 'Ready', color: 'text-slate-400' },
    connecting: { label: 'Connecting', color: 'text-slate-400' },
  }

  const config = stateConfig[state] || { label: state, color: 'text-slate-400' }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`flex items-center gap-2 text-sm font-medium ${config.color}`}>
        <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`} />
        {config.label}
      </div>
      <div className="h-24 w-full max-w-xs">
        <BarVisualizer
          state={state}
          trackRef={audioTrack}
          barCount={5}
          options={{ minHeight: 8 }}
        />
      </div>
    </div>
  )
}

function CallControls({ onDisconnect }: { onDisconnect: () => void }) {
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isMuted 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
      <DisconnectButton onClick={onDisconnect}>
        <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-lg shadow-red-500/30">
          <PhoneOff size={24} className="text-white" />
        </div>
      </DisconnectButton>
      <button
        className="w-14 h-14 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 flex items-center justify-center transition-colors"
        aria-label="Volume"
      >
        <Volume2 size={22} />
      </button>
    </div>
  )
}

function CallTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <span className="text-sm text-slate-500 font-mono">
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  )
}

export default function VoiceCall({ agent, onEnd }: VoiceCallProps) {
  const [connectionDetails, setConnectionDetails] = useState<{
    token: string
    wsUrl: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    async function connect() {
      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: agent.id }),
        })

        if (!response.ok) throw new Error('Failed to connect')

        const data = await response.json()
        setConnectionDetails({ token: data.token, wsUrl: data.wsUrl })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed')
      } finally {
        setIsConnecting(false)
      }
    }

    connect()
  }, [agent.id])

  const handleDisconnect = useCallback(() => {
    onEnd()
  }, [onEnd])

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <PhoneOff size={32} className="text-red-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Connection Failed</h3>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
        <button onClick={onEnd} className="btn-secondary">
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    )
  }

  if (isConnecting || !connectionDetails) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-20 h-20 bg-sky-500/20 rounded-2xl flex items-center justify-center">
          <Loader2 size={36} className="text-sky-400 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Connecting...</h3>
          <p className="text-slate-400 text-sm">Starting call with {agent.displayName}</p>
        </div>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={connectionDetails.token}
      serverUrl={connectionDetails.wsUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={handleDisconnect}
      data-lk-theme="default"
      className="flex-1 flex flex-col items-center justify-center gap-8 p-6"
    >
      {/* Agent Avatar */}
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/20">
          <span className="text-4xl font-bold text-white">
            {agent.displayName.charAt(0)}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-1">{agent.displayName}</h2>
        <CallTimer />
      </div>

      {/* Visualizer */}
      <AgentVisualizer />

      {/* Controls */}
      <CallControls onDisconnect={handleDisconnect} />

      {/* Back button */}
      <button
        onClick={onEnd}
        className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
      >
        <ArrowLeft size={14} />
        End & go back
      </button>

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
