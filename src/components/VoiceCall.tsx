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
import { Mic, MicOff, PhoneOff, ArrowLeft, Loader2 } from 'lucide-react'
import { Agent } from '@/types/agent'

interface VoiceCallProps {
  agent: Agent
  onEnd: () => void
}

function AgentVisualizer() {
  const { state, audioTrack } = useVoiceAssistant()

  const stateLabels: Record<string, string> = {
    listening: 'Listening...',
    thinking: 'Thinking...',
    speaking: 'Speaking...',
    idle: 'Ready',
    connecting: 'Connecting...',
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="badge-info text-sm px-4 py-2">
        {stateLabels[state] || state}
      </div>
      <div className="h-32 sm:h-40 w-full max-w-xs">
        <BarVisualizer
          state={state}
          trackRef={audioTrack}
          barCount={7}
          options={{ minHeight: 10 }}
        />
      </div>
    </div>
  )
}

function CallControls({ onDisconnect }: { onDisconnect: () => void }) {
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 ${
          isMuted 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
            : 'bg-slate-700 hover:bg-slate-600'
        }`}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      <DisconnectButton onClick={onDisconnect}>
        <div className="p-4 sm:p-5 rounded-2xl bg-red-500 hover:bg-red-600 transition-all duration-200 cursor-pointer shadow-lg shadow-red-500/30">
          <PhoneOff size={24} />
        </div>
      </DisconnectButton>
    </div>
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

        if (!response.ok) {
          throw new Error('Failed to get connection token')
        }

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
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <PhoneOff size={32} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Connection Failed</h3>
          <p className="text-slate-400">{error}</p>
        </div>
        <button onClick={onEnd} className="btn-secondary">
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    )
  }

  if (isConnecting || !connectionDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6 text-center">
        <div className="w-20 h-20 bg-sky-500/20 rounded-2xl flex items-center justify-center animate-pulse-glow">
          <Loader2 size={36} className="text-sky-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Connecting...</h3>
          <p className="text-slate-400">Starting call with {agent.displayName}</p>
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
      className="h-full flex flex-col items-center justify-center gap-8 p-6"
    >
      {/* Agent info */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25">
          <span className="text-3xl font-bold text-white">
            {agent.displayName.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1">{agent.displayName}</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">{agent.description}</p>
      </div>

      {/* Visualizer */}
      <AgentVisualizer />

      {/* Controls */}
      <CallControls onDisconnect={handleDisconnect} />

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
