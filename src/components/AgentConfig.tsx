'use client'

import { useState } from 'react'
import { X, Save, MessageSquare, Volume2, Brain, Settings, Webhook, Server, Phone, ChevronRight } from 'lucide-react'
import { Agent } from '@/types/agent'

interface AgentConfigProps {
  agent: Agent
  onSave: (agent: Partial<Agent>) => void
  onCancel: () => void
}

type Tab = 'prompts' | 'voice' | 'llm' | 'advanced' | 'webhooks' | 'mcp' | 'phone'

const VOICE_OPTIONS = {
  openai: [
    { value: 'alloy', label: 'Alloy (Neutral)' },
    { value: 'echo', label: 'Echo (Male)' },
    { value: 'fable', label: 'Fable (British)' },
    { value: 'onyx', label: 'Onyx (Deep Male)' },
    { value: 'nova', label: 'Nova (Female)' },
    { value: 'shimmer', label: 'Shimmer (Soft Female)' },
  ],
  elevenlabs: [
    { value: 'rachel', label: 'Rachel' },
    { value: 'drew', label: 'Drew' },
    { value: 'clyde', label: 'Clyde' },
    { value: 'paul', label: 'Paul' },
    { value: 'domi', label: 'Domi' },
    { value: 'dave', label: 'Dave' },
  ],
}

const LLM_MODELS = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
}

const WEBHOOK_EVENTS = [
  { value: 'call.started', label: 'Call Started' },
  { value: 'call.ended', label: 'Call Ended' },
  { value: 'call.failed', label: 'Call Failed' },
  { value: 'transcript.ready', label: 'Transcript Ready' },
  { value: 'agent.error', label: 'Agent Error' },
]

export default function AgentConfig({ agent, onSave, onCancel }: AgentConfigProps) {
  const [activeTab, setActiveTab] = useState<Tab>('prompts')
  const [formData, setFormData] = useState<Agent>({ ...agent })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await onSave(formData)
    setIsSaving(false)
  }

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
    { id: 'prompts', label: 'Prompts', icon: MessageSquare },
    { id: 'voice', label: 'Voice', icon: Volume2 },
    { id: 'llm', label: 'LLM', icon: Brain },
    { id: 'advanced', label: 'Advanced', icon: Settings },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'mcp', label: 'MCP', icon: Server },
    { id: 'phone', label: 'Phone', icon: Phone },
  ]

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="bg-slate-800 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-semibold">{agent.displayName}</h2>
            <p className="text-sm text-slate-400">Configure agent settings</p>
          </div>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-slate-700/50 p-2 hidden sm:block">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Mobile tabs */}
          <div className="sm:hidden w-full border-b border-slate-700/50 overflow-x-auto">
            <div className="flex p-2 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'prompts' && (
              <div className="space-y-5">
                <div>
                  <label className="label">System Prompt</label>
                  <textarea
                    value={formData.prompts.systemPrompt}
                    onChange={(e) => setFormData({
                      ...formData,
                      prompts: { ...formData.prompts, systemPrompt: e.target.value }
                    })}
                    className="textarea h-40"
                    placeholder="Define the agent's personality, behavior, and capabilities..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This is the main instruction that defines how your agent behaves.
                  </p>
                </div>

                <div>
                  <label className="label">First Message</label>
                  <textarea
                    value={formData.prompts.firstMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      prompts: { ...formData.prompts, firstMessage: e.target.value }
                    })}
                    className="textarea h-20"
                    placeholder="Hello! How can I help you today?"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    The greeting message when a call starts.
                  </p>
                </div>

                <div>
                  <label className="label">Fallback Message</label>
                  <input
                    type="text"
                    value={formData.prompts.fallbackMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      prompts: { ...formData.prompts, fallbackMessage: e.target.value }
                    })}
                    className="input"
                    placeholder="I didn't catch that, could you repeat?"
                  />
                </div>

                <div>
                  <label className="label">End Call Message</label>
                  <input
                    type="text"
                    value={formData.prompts.endCallMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      prompts: { ...formData.prompts, endCallMessage: e.target.value }
                    })}
                    className="input"
                    placeholder="Thank you for calling. Goodbye!"
                  />
                </div>

                <div>
                  <label className="label">Transfer Message</label>
                  <input
                    type="text"
                    value={formData.prompts.transferMessage}
                    onChange={(e) => setFormData({
                      ...formData,
                      prompts: { ...formData.prompts, transferMessage: e.target.value }
                    })}
                    className="input"
                    placeholder="Let me transfer you to a human agent."
                  />
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-5">
                <div>
                  <label className="label">Voice Provider</label>
                  <select
                    value={formData.voice.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      voice: { ...formData.voice, provider: e.target.value as any }
                    })}
                    className="select"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="elevenlabs">ElevenLabs</option>
                    <option value="deepgram">Deepgram</option>
                    <option value="playht">PlayHT</option>
                  </select>
                </div>

                <div>
                  <label className="label">Voice</label>
                  <select
                    value={formData.voice.voiceId}
                    onChange={(e) => setFormData({
                      ...formData,
                      voice: { ...formData.voice, voiceId: e.target.value }
                    })}
                    className="select"
                  >
                    {(VOICE_OPTIONS[formData.voice.provider as keyof typeof VOICE_OPTIONS] || VOICE_OPTIONS.openai).map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Speed: {formData.voice.speed.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={formData.voice.speed}
                    onChange={(e) => setFormData({
                      ...formData,
                      voice: { ...formData.voice, speed: parseFloat(e.target.value) }
                    })}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div>
                  <label className="label">Pitch: {formData.voice.pitch.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={formData.voice.pitch}
                    onChange={(e) => setFormData({
                      ...formData,
                      voice: { ...formData.voice, pitch: parseFloat(e.target.value) }
                    })}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'llm' && (
              <div className="space-y-5">
                <div>
                  <label className="label">LLM Provider</label>
                  <select
                    value={formData.llm.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      llm: { ...formData.llm, provider: e.target.value as any }
                    })}
                    className="select"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="groq">Groq</option>
                    <option value="together">Together AI</option>
                  </select>
                </div>

                <div>
                  <label className="label">Model</label>
                  <select
                    value={formData.llm.model}
                    onChange={(e) => setFormData({
                      ...formData,
                      llm: { ...formData.llm, model: e.target.value }
                    })}
                    className="select"
                  >
                    {(LLM_MODELS[formData.llm.provider as keyof typeof LLM_MODELS] || LLM_MODELS.openai).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Temperature: {formData.llm.temperature.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.llm.temperature}
                    onChange={(e) => setFormData({
                      ...formData,
                      llm: { ...formData.llm, temperature: parseFloat(e.target.value) }
                    })}
                    className="w-full accent-sky-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Lower = more focused, Higher = more creative
                  </p>
                </div>

                <div>
                  <label className="label">Max Tokens</label>
                  <input
                    type="number"
                    value={formData.llm.maxTokens}
                    onChange={(e) => setFormData({
                      ...formData,
                      llm: { ...formData.llm, maxTokens: parseInt(e.target.value) }
                    })}
                    className="input"
                    min="256"
                    max="8192"
                  />
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-5">
                <div>
                  <label className="label">Interruption Threshold: {formData.advanced.interruptionThreshold.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.advanced.interruptionThreshold}
                    onChange={(e) => setFormData({
                      ...formData,
                      advanced: { ...formData.advanced, interruptionThreshold: parseFloat(e.target.value) }
                    })}
                    className="w-full accent-sky-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    How easily the user can interrupt the agent
                  </p>
                </div>

                <div>
                  <label className="label">Silence Timeout (seconds)</label>
                  <input
                    type="number"
                    value={formData.advanced.silenceTimeout}
                    onChange={(e) => setFormData({
                      ...formData,
                      advanced: { ...formData.advanced, silenceTimeout: parseInt(e.target.value) }
                    })}
                    className="input"
                    min="5"
                    max="60"
                  />
                </div>

                <div>
                  <label className="label">Max Call Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.advanced.maxCallDuration}
                    onChange={(e) => setFormData({
                      ...formData,
                      advanced: { ...formData.advanced, maxCallDuration: parseInt(e.target.value) }
                    })}
                    className="input"
                    min="60"
                    max="7200"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.advanced.recordCalls}
                      onChange={(e) => setFormData({
                        ...formData,
                        advanced: { ...formData.advanced, recordCalls: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
                    />
                    <span>Record Calls</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.advanced.transcribeCalls}
                      onChange={(e) => setFormData({
                        ...formData,
                        advanced: { ...formData.advanced, transcribeCalls: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
                    />
                    <span>Transcribe Calls</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.advanced.enableVAD}
                      onChange={(e) => setFormData({
                        ...formData,
                        advanced: { ...formData.advanced, enableVAD: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
                    />
                    <span>Enable Voice Activity Detection</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div className="space-y-5">
                <p className="text-sm text-slate-400">
                  Configure webhooks to receive real-time notifications about call events.
                </p>

                {formData.webhooks.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <Webhook size={32} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-slate-500 text-sm mb-4">No webhooks configured</p>
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        webhooks: [...formData.webhooks, {
                          id: `wh-${Date.now()}`,
                          name: 'New Webhook',
                          url: '',
                          events: ['call.ended'],
                          enabled: true,
                        }]
                      })}
                      className="btn-secondary btn-sm"
                    >
                      Add Webhook
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.webhooks.map((webhook, idx) => (
                      <div key={webhook.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={webhook.name}
                            onChange={(e) => {
                              const updated = [...formData.webhooks]
                              updated[idx] = { ...webhook, name: e.target.value }
                              setFormData({ ...formData, webhooks: updated })
                            }}
                            className="input input-sm bg-transparent border-none p-0 font-medium"
                            placeholder="Webhook name"
                          />
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              webhooks: formData.webhooks.filter((_, i) => i !== idx)
                            })}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={webhook.url}
                          onChange={(e) => {
                            const updated = [...formData.webhooks]
                            updated[idx] = { ...webhook, url: e.target.value }
                            setFormData({ ...formData, webhooks: updated })
                          }}
                          className="input input-sm mb-3"
                          placeholder="https://your-server.com/webhook"
                        />
                        <div className="flex flex-wrap gap-2">
                          {WEBHOOK_EVENTS.map((event) => (
                            <label key={event.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={webhook.events.includes(event.value as any)}
                                onChange={(e) => {
                                  const updated = [...formData.webhooks]
                                  if (e.target.checked) {
                                    updated[idx] = { ...webhook, events: [...webhook.events, event.value as any] }
                                  } else {
                                    updated[idx] = { ...webhook, events: webhook.events.filter(ev => ev !== event.value) }
                                  }
                                  setFormData({ ...formData, webhooks: updated })
                                }}
                                className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-sky-500"
                              />
                              {event.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        webhooks: [...formData.webhooks, {
                          id: `wh-${Date.now()}`,
                          name: 'New Webhook',
                          url: '',
                          events: ['call.ended'],
                          enabled: true,
                        }]
                      })}
                      className="btn-secondary btn-sm w-full"
                    >
                      Add Another Webhook
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mcp' && (
              <div className="space-y-5">
                <p className="text-sm text-slate-400">
                  Connect MCP (Model Context Protocol) servers to give your agent access to external tools and data.
                </p>

                {formData.mcpServers.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <Server size={32} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-slate-500 text-sm mb-4">No MCP servers configured</p>
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        mcpServers: [...formData.mcpServers, {
                          id: `mcp-${Date.now()}`,
                          name: 'New MCP Server',
                          url: '',
                          enabled: true,
                        }]
                      })}
                      className="btn-secondary btn-sm"
                    >
                      Add MCP Server
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.mcpServers.map((server, idx) => (
                      <div key={server.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={server.name}
                            onChange={(e) => {
                              const updated = [...formData.mcpServers]
                              updated[idx] = { ...server, name: e.target.value }
                              setFormData({ ...formData, mcpServers: updated })
                            }}
                            className="input input-sm bg-transparent border-none p-0 font-medium"
                            placeholder="Server name"
                          />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={server.enabled}
                                onChange={(e) => {
                                  const updated = [...formData.mcpServers]
                                  updated[idx] = { ...server, enabled: e.target.checked }
                                  setFormData({ ...formData, mcpServers: updated })
                                }}
                                className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-sky-500"
                              />
                              Enabled
                            </label>
                            <button
                              onClick={() => setFormData({
                                ...formData,
                                mcpServers: formData.mcpServers.filter((_, i) => i !== idx)
                              })}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <input
                          type="url"
                          value={server.url}
                          onChange={(e) => {
                            const updated = [...formData.mcpServers]
                            updated[idx] = { ...server, url: e.target.value }
                            setFormData({ ...formData, mcpServers: updated })
                          }}
                          className="input input-sm mb-2"
                          placeholder="https://mcp-server.example.com"
                        />
                        <input
                          type="password"
                          value={server.apiKey || ''}
                          onChange={(e) => {
                            const updated = [...formData.mcpServers]
                            updated[idx] = { ...server, apiKey: e.target.value }
                            setFormData({ ...formData, mcpServers: updated })
                          }}
                          className="input input-sm"
                          placeholder="API Key (optional)"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        mcpServers: [...formData.mcpServers, {
                          id: `mcp-${Date.now()}`,
                          name: 'New MCP Server',
                          url: '',
                          enabled: true,
                        }]
                      })}
                      className="btn-secondary btn-sm w-full"
                    >
                      Add Another MCP Server
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-5">
                <p className="text-sm text-slate-400">
                  Assign phone numbers to this agent for inbound calls.
                </p>

                <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                  <Phone size={32} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-slate-500 text-sm mb-4">No phone numbers assigned</p>
                  <p className="text-xs text-slate-600 mb-4">
                    Phone numbers can be purchased and managed in the Phone Numbers section.
                  </p>
                  <button className="btn-secondary btn-sm">
                    Go to Phone Numbers
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 sm:p-6 border-t border-slate-700/50 sm:justify-end">
          <button onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary w-full sm:w-auto">
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
