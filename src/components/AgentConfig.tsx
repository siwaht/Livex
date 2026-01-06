'use client'

import { useState } from 'react'
import { 
  X, Save, MessageSquare, Volume2, Brain, Settings, Webhook, 
  Server, Phone, Mic, Wrench, ChevronRight, Plus, Trash2, Play
} from 'lucide-react'
import { Agent, AgentFunction, WebhookConfig, MCPServer } from '@/types/agent'

interface AgentConfigProps {
  agent: Agent
  onSave: (agent: Partial<Agent>) => void
  onCancel: () => void
}

type Tab = 'prompts' | 'voice' | 'transcriber' | 'llm' | 'conversation' | 'functions' | 'webhooks' | 'mcp'

const VOICE_OPTIONS: Record<string, { value: string; label: string }[]> = {
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
  ],
}

const LLM_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
}

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
    { id: 'transcriber', label: 'Transcriber', icon: Mic },
    { id: 'llm', label: 'LLM', icon: Brain },
    { id: 'conversation', label: 'Conversation', icon: Settings },
    { id: 'functions', label: 'Functions', icon: Wrench },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'mcp', label: 'MCP', icon: Server },
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
          <div className="flex items-center gap-2">
            <button className="btn-secondary btn-sm hidden sm:flex">
              <Play size={16} />
              Test
            </button>
            <button onClick={onCancel} className="btn-icon" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-44 border-r border-slate-700/50 p-2 hidden sm:block overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Mobile tabs */}
          <div className="sm:hidden w-full border-b border-slate-700/50 overflow-x-auto flex-shrink-0">
            <div className="flex p-2 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                      activeTab === tab.id ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
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
              <PromptsTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'voice' && (
              <VoiceTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'transcriber' && (
              <TranscriberTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'llm' && (
              <LLMTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'conversation' && (
              <ConversationTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'functions' && (
              <FunctionsTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'webhooks' && (
              <WebhooksTab formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'mcp' && (
              <MCPTab formData={formData} setFormData={setFormData} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 sm:p-6 border-t border-slate-700/50 sm:justify-end">
          <button onClick={onCancel} className="btn-secondary w-full sm:w-auto">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary w-full sm:w-auto">
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}


// Tab Components
function PromptsTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  return (
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
          The main instruction that defines how your agent behaves. Use variables like {'{{name}}'} for dynamic content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">First Message</label>
          <textarea
            value={formData.prompts.firstMessage}
            onChange={(e) => setFormData({
              ...formData,
              prompts: { ...formData.prompts, firstMessage: e.target.value }
            })}
            className="textarea h-24"
            placeholder="Hello! How can I help you today?"
          />
        </div>
        <div>
          <label className="label">First Message Mode</label>
          <select
            value={formData.prompts.firstMessageMode}
            onChange={(e) => setFormData({
              ...formData,
              prompts: { ...formData.prompts, firstMessageMode: e.target.value as any }
            })}
            className="select mb-2"
          >
            <option value="static">Static (use exact message)</option>
            <option value="dynamic">Dynamic (LLM generates)</option>
          </select>
          <p className="text-xs text-slate-500">
            Dynamic mode lets the LLM generate contextual greetings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Idle Message</label>
          <input
            type="text"
            value={formData.prompts.idleMessage || ''}
            onChange={(e) => setFormData({
              ...formData,
              prompts: { ...formData.prompts, idleMessage: e.target.value }
            })}
            className="input"
            placeholder="Are you still there?"
          />
        </div>
        <div>
          <label className="label">Idle Timeout (seconds)</label>
          <input
            type="number"
            value={formData.prompts.idleTimeoutSeconds || 10}
            onChange={(e) => setFormData({
              ...formData,
              prompts: { ...formData.prompts, idleTimeoutSeconds: parseInt(e.target.value) }
            })}
            className="input"
            min={5}
            max={60}
          />
        </div>
      </div>

      <div>
        <label className="label">End Call Message</label>
        <input
          type="text"
          value={formData.prompts.endCallMessage || ''}
          onChange={(e) => setFormData({
            ...formData,
            prompts: { ...formData.prompts, endCallMessage: e.target.value }
          })}
          className="input"
          placeholder="Thank you for calling. Goodbye!"
        />
      </div>

      <div>
        <label className="label">End Call Phrases</label>
        <input
          type="text"
          value={formData.prompts.endCallPhrases?.join(', ') || ''}
          onChange={(e) => setFormData({
            ...formData,
            prompts: { ...formData.prompts, endCallPhrases: e.target.value.split(',').map(s => s.trim()) }
          })}
          className="input"
          placeholder="goodbye, bye, end call, hang up"
        />
        <p className="text-xs text-slate-500 mt-1">Comma-separated phrases that trigger call end.</p>
      </div>

      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.prompts.voicemailDetection || false}
            onChange={(e) => setFormData({
              ...formData,
              prompts: { ...formData.prompts, voicemailDetection: e.target.checked }
            })}
            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
          />
          <div>
            <span className="font-medium">Voicemail Detection</span>
            <p className="text-xs text-slate-400">Detect voicemail and leave a message</p>
          </div>
        </label>
        {formData.prompts.voicemailDetection && (
          <div className="mt-3">
            <label className="label">Voicemail Message</label>
            <textarea
              value={formData.prompts.voicemailMessage || ''}
              onChange={(e) => setFormData({
                ...formData,
                prompts: { ...formData.prompts, voicemailMessage: e.target.value }
              })}
              className="textarea h-20"
              placeholder="Hi, this is an automated message..."
            />
          </div>
        )}
      </div>
    </div>
  )
}


function VoiceTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  const voices = VOICE_OPTIONS[formData.voice.provider] || VOICE_OPTIONS.openai
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <option value="cartesia">Cartesia</option>
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
            {voices.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Speed: {(formData.voice.speed || 1).toFixed(1)}x</label>
        <input
          type="range" min="0.5" max="2" step="0.1"
          value={formData.voice.speed || 1}
          onChange={(e) => setFormData({
            ...formData,
            voice: { ...formData.voice, speed: parseFloat(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
      </div>

      <div>
        <label className="label">Pitch: {(formData.voice.pitch || 1).toFixed(1)}</label>
        <input
          type="range" min="0.5" max="2" step="0.1"
          value={formData.voice.pitch || 1}
          onChange={(e) => setFormData({
            ...formData,
            voice: { ...formData.voice, pitch: parseFloat(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
      </div>

      {formData.voice.provider === 'elevenlabs' && (
        <>
          <div>
            <label className="label">Stability: {(formData.voice.stability || 0.5).toFixed(1)}</label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={formData.voice.stability || 0.5}
              onChange={(e) => setFormData({
                ...formData,
                voice: { ...formData.voice, stability: parseFloat(e.target.value) }
              })}
              className="w-full accent-sky-500"
            />
          </div>
          <div>
            <label className="label">Similarity Boost: {(formData.voice.similarityBoost || 0.75).toFixed(1)}</label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={formData.voice.similarityBoost || 0.75}
              onChange={(e) => setFormData({
                ...formData,
                voice: { ...formData.voice, similarityBoost: parseFloat(e.target.value) }
              })}
              className="w-full accent-sky-500"
            />
          </div>
        </>
      )}

      <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-900/50 rounded-xl">
        <input
          type="checkbox"
          checked={formData.voice.fillerInjection || false}
          onChange={(e) => setFormData({
            ...formData,
            voice: { ...formData.voice, fillerInjection: e.target.checked }
          })}
          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
        />
        <div>
          <span className="font-medium">Filler Word Injection</span>
          <p className="text-xs text-slate-400">Add natural filler words like "um", "uh" for more human-like speech</p>
        </div>
      </label>
    </div>
  )
}

function TranscriberTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Transcriber Provider</label>
          <select
            value={formData.transcriber.provider}
            onChange={(e) => setFormData({
              ...formData,
              transcriber: { ...formData.transcriber, provider: e.target.value as any }
            })}
            className="select"
          >
            <option value="deepgram">Deepgram</option>
            <option value="openai">OpenAI Whisper</option>
            <option value="assemblyai">AssemblyAI</option>
            <option value="gladia">Gladia</option>
          </select>
        </div>
        <div>
          <label className="label">Model</label>
          <select
            value={formData.transcriber.model || 'nova-2'}
            onChange={(e) => setFormData({
              ...formData,
              transcriber: { ...formData.transcriber, model: e.target.value }
            })}
            className="select"
          >
            <option value="nova-2">Nova 2 (Recommended)</option>
            <option value="nova">Nova</option>
            <option value="enhanced">Enhanced</option>
            <option value="base">Base</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Language</label>
        <select
          value={formData.transcriber.language || 'en'}
          onChange={(e) => setFormData({
            ...formData,
            transcriber: { ...formData.transcriber, language: e.target.value }
          })}
          className="select"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="multi">Multi-language</option>
        </select>
      </div>

      <div>
        <label className="label">Endpointing (ms): {formData.transcriber.endpointingMs || 300}</label>
        <input
          type="range" min="100" max="1000" step="50"
          value={formData.transcriber.endpointingMs || 300}
          onChange={(e) => setFormData({
            ...formData,
            transcriber: { ...formData.transcriber, endpointingMs: parseInt(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          How long to wait after speech ends before processing. Lower = faster but may cut off speech.
        </p>
      </div>

      <div>
        <label className="label">Keywords (for boosting)</label>
        <input
          type="text"
          value={formData.transcriber.keywords?.join(', ') || ''}
          onChange={(e) => setFormData({
            ...formData,
            transcriber: { ...formData.transcriber, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
          })}
          className="input"
          placeholder="product names, technical terms, etc."
        />
        <p className="text-xs text-slate-500 mt-1">Comma-separated words to boost recognition accuracy.</p>
      </div>
    </div>
  )
}


function LLMTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  const models = LLM_MODELS[formData.llm.provider] || LLM_MODELS.openai
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <option value="custom">Custom LLM</option>
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
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.llm.provider === 'custom' && (
        <div>
          <label className="label">Custom LLM URL</label>
          <input
            type="url"
            value={formData.llm.customLLMUrl || ''}
            onChange={(e) => setFormData({
              ...formData,
              llm: { ...formData.llm, customLLMUrl: e.target.value }
            })}
            className="input"
            placeholder="https://your-llm-endpoint.com/v1/chat/completions"
          />
        </div>
      )}

      <div>
        <label className="label">Temperature: {(formData.llm.temperature || 0.7).toFixed(1)}</label>
        <input
          type="range" min="0" max="2" step="0.1"
          value={formData.llm.temperature || 0.7}
          onChange={(e) => setFormData({
            ...formData,
            llm: { ...formData.llm, temperature: parseFloat(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">Lower = more focused, Higher = more creative</p>
      </div>

      <div>
        <label className="label">Max Tokens</label>
        <input
          type="number"
          value={formData.llm.maxTokens || 256}
          onChange={(e) => setFormData({
            ...formData,
            llm: { ...formData.llm, maxTokens: parseInt(e.target.value) }
          })}
          className="input"
          min={64} max={4096}
        />
        <p className="text-xs text-slate-500 mt-1">Keep low (128-256) for faster responses in voice.</p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-900/50 rounded-xl">
        <input
          type="checkbox"
          checked={formData.llm.semanticCaching || false}
          onChange={(e) => setFormData({
            ...formData,
            llm: { ...formData.llm, semanticCaching: e.target.checked }
          })}
          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
        />
        <div>
          <span className="font-medium">Semantic Caching</span>
          <p className="text-xs text-slate-400">Cache similar queries to reduce latency and cost</p>
        </div>
      </label>
    </div>
  )
}

function ConversationTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="label">Interruption Sensitivity: {(formData.conversation.interruptionSensitivity).toFixed(1)}</label>
        <input
          type="range" min="0" max="1" step="0.1"
          value={formData.conversation.interruptionSensitivity}
          onChange={(e) => setFormData({
            ...formData,
            conversation: { ...formData.conversation, interruptionSensitivity: parseFloat(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">How easily the user can interrupt the agent. Higher = easier to interrupt.</p>
      </div>

      <div>
        <label className="label">Responsiveness: {(formData.conversation.responsiveness).toFixed(1)}</label>
        <input
          type="range" min="0" max="1" step="0.1"
          value={formData.conversation.responsiveness}
          onChange={(e) => setFormData({
            ...formData,
            conversation: { ...formData.conversation, responsiveness: parseFloat(e.target.value) }
          })}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">How quickly the agent responds. Higher = faster but may cut off user.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Silence Timeout (seconds)</label>
          <input
            type="number"
            value={formData.conversation.silenceTimeoutSeconds}
            onChange={(e) => setFormData({
              ...formData,
              conversation: { ...formData.conversation, silenceTimeoutSeconds: parseInt(e.target.value) }
            })}
            className="input"
            min={5} max={120}
          />
        </div>
        <div>
          <label className="label">Max Call Duration (seconds)</label>
          <input
            type="number"
            value={formData.conversation.maxDurationSeconds}
            onChange={(e) => setFormData({
              ...formData,
              conversation: { ...formData.conversation, maxDurationSeconds: parseInt(e.target.value) }
            })}
            className="input"
            min={60} max={7200}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-900/50 rounded-xl">
          <input
            type="checkbox"
            checked={formData.conversation.backchanneling || false}
            onChange={(e) => setFormData({
              ...formData,
              conversation: { ...formData.conversation, backchanneling: e.target.checked }
            })}
            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
          />
          <div>
            <span className="font-medium">Backchanneling</span>
            <p className="text-xs text-slate-400">Agent says "mhm", "I see" while listening</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-900/50 rounded-xl">
          <input
            type="checkbox"
            checked={formData.conversation.recordingEnabled}
            onChange={(e) => setFormData({
              ...formData,
              conversation: { ...formData.conversation, recordingEnabled: e.target.checked }
            })}
            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
          />
          <div>
            <span className="font-medium">Record Calls</span>
            <p className="text-xs text-slate-400">Save audio recordings of all calls</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-900/50 rounded-xl">
          <input
            type="checkbox"
            checked={formData.conversation.transcriptionEnabled}
            onChange={(e) => setFormData({
              ...formData,
              conversation: { ...formData.conversation, transcriptionEnabled: e.target.checked }
            })}
            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
          />
          <div>
            <span className="font-medium">Transcribe Calls</span>
            <p className="text-xs text-slate-400">Generate text transcripts of all calls</p>
          </div>
        </label>
      </div>
    </div>
  )
}


function FunctionsTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  const addFunction = () => {
    const newFn: AgentFunction = {
      id: `fn-${Date.now()}`,
      name: '',
      description: '',
      parameters: { type: 'object', properties: {}, required: [] },
      type: 'webhook',
      enabled: true,
    }
    setFormData({ ...formData, functions: [...formData.functions, newFn] })
  }

  const updateFunction = (idx: number, updates: Partial<AgentFunction>) => {
    const updated = [...formData.functions]
    updated[idx] = { ...updated[idx], ...updates }
    setFormData({ ...formData, functions: updated })
  }

  const removeFunction = (idx: number) => {
    setFormData({ ...formData, functions: formData.functions.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        Functions allow your agent to perform actions like calling APIs, transferring calls, or ending conversations.
      </p>

      {formData.functions.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
          <Wrench size={32} className="mx-auto mb-2 text-slate-600" />
          <p className="text-slate-500 text-sm mb-4">No functions configured</p>
          <button onClick={addFunction} className="btn-secondary btn-sm">
            <Plus size={16} />
            Add Function
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.functions.map((fn, idx) => (
            <div key={fn.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={fn.name}
                  onChange={(e) => updateFunction(idx, { name: e.target.value })}
                  className="input input-sm bg-transparent border-none p-0 font-mono font-medium"
                  placeholder="function_name"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={fn.enabled}
                      onChange={(e) => updateFunction(idx, { enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-sky-500"
                    />
                    Enabled
                  </label>
                  <button onClick={() => removeFunction(idx)} className="text-slate-400 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <input
                type="text"
                value={fn.description}
                onChange={(e) => updateFunction(idx, { description: e.target.value })}
                className="input input-sm mb-3"
                placeholder="Description of what this function does"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Type</label>
                  <select
                    value={fn.type}
                    onChange={(e) => updateFunction(idx, { type: e.target.value as any })}
                    className="select input-sm"
                  >
                    <option value="webhook">Webhook</option>
                    <option value="transfer">Transfer Call</option>
                    <option value="end_call">End Call</option>
                    <option value="dtmf">Send DTMF</option>
                  </select>
                </div>
                {fn.type === 'webhook' && (
                  <div>
                    <label className="text-xs text-slate-400">Webhook URL</label>
                    <input
                      type="url"
                      value={fn.webhookUrl || ''}
                      onChange={(e) => updateFunction(idx, { webhookUrl: e.target.value })}
                      className="input input-sm"
                      placeholder="https://..."
                    />
                  </div>
                )}
                {fn.type === 'transfer' && (
                  <div>
                    <label className="text-xs text-slate-400">Transfer Number</label>
                    <input
                      type="tel"
                      value={fn.transferNumber || ''}
                      onChange={(e) => updateFunction(idx, { transferNumber: e.target.value })}
                      className="input input-sm font-mono"
                      placeholder="+15551234567"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button onClick={addFunction} className="btn-secondary btn-sm w-full">
            <Plus size={16} />
            Add Another Function
          </button>
        </div>
      )}
    </div>
  )
}

function WebhooksTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  const EVENTS = [
    'call.started', 'call.answered', 'call.ended', 'call.failed',
    'transcript.final', 'function.called', 'recording.ready'
  ]

  const addWebhook = () => {
    const newWh: WebhookConfig = {
      id: `wh-${Date.now()}`,
      name: 'New Webhook',
      url: '',
      events: ['call.ended'],
      enabled: true,
    }
    setFormData({ ...formData, webhooks: [...formData.webhooks, newWh] })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        Receive real-time notifications about call events via webhooks.
      </p>

      {formData.webhooks.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
          <Webhook size={32} className="mx-auto mb-2 text-slate-600" />
          <p className="text-slate-500 text-sm mb-4">No webhooks configured</p>
          <button onClick={addWebhook} className="btn-secondary btn-sm">
            <Plus size={16} />
            Add Webhook
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.webhooks.map((wh, idx) => (
            <div key={wh.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={wh.name}
                  onChange={(e) => {
                    const updated = [...formData.webhooks]
                    updated[idx] = { ...wh, name: e.target.value }
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
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                type="url"
                value={wh.url}
                onChange={(e) => {
                  const updated = [...formData.webhooks]
                  updated[idx] = { ...wh, url: e.target.value }
                  setFormData({ ...formData, webhooks: updated })
                }}
                className="input input-sm mb-3"
                placeholder="https://your-server.com/webhook"
              />
              <div className="flex flex-wrap gap-2">
                {EVENTS.map((event) => (
                  <label key={event} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wh.events.includes(event as any)}
                      onChange={(e) => {
                        const updated = [...formData.webhooks]
                        if (e.target.checked) {
                          updated[idx] = { ...wh, events: [...wh.events, event as any] }
                        } else {
                          updated[idx] = { ...wh, events: wh.events.filter(ev => ev !== event) }
                        }
                        setFormData({ ...formData, webhooks: updated })
                      }}
                      className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-sky-500"
                    />
                    {event}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addWebhook} className="btn-secondary btn-sm w-full">
            <Plus size={16} />
            Add Another Webhook
          </button>
        </div>
      )}
    </div>
  )
}

function MCPTab({ formData, setFormData }: { formData: Agent; setFormData: (d: Agent) => void }) {
  const addMCP = () => {
    const newMcp: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: 'New MCP Server',
      type: 'http',
      enabled: true,
    }
    setFormData({ ...formData, mcpServers: [...formData.mcpServers, newMcp] })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        Connect MCP (Model Context Protocol) servers to give your agent access to external tools and data sources.
      </p>

      {formData.mcpServers.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
          <Server size={32} className="mx-auto mb-2 text-slate-600" />
          <p className="text-slate-500 text-sm mb-4">No MCP servers configured</p>
          <button onClick={addMCP} className="btn-secondary btn-sm">
            <Plus size={16} />
            Add MCP Server
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.mcpServers.map((mcp, idx) => (
            <div key={mcp.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={mcp.name}
                  onChange={(e) => {
                    const updated = [...formData.mcpServers]
                    updated[idx] = { ...mcp, name: e.target.value }
                    setFormData({ ...formData, mcpServers: updated })
                  }}
                  className="input input-sm bg-transparent border-none p-0 font-medium"
                  placeholder="Server name"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={mcp.enabled}
                      onChange={(e) => {
                        const updated = [...formData.mcpServers]
                        updated[idx] = { ...mcp, enabled: e.target.checked }
                        setFormData({ ...formData, mcpServers: updated })
                      }}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-sky-500"
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
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-400">Type</label>
                  <select
                    value={mcp.type}
                    onChange={(e) => {
                      const updated = [...formData.mcpServers]
                      updated[idx] = { ...mcp, type: e.target.value as any }
                      setFormData({ ...formData, mcpServers: updated })
                    }}
                    className="select input-sm"
                  >
                    <option value="http">HTTP</option>
                    <option value="websocket">WebSocket</option>
                    <option value="stdio">Stdio</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">
                    {mcp.type === 'stdio' ? 'Command' : 'URL'}
                  </label>
                  <input
                    type="text"
                    value={mcp.type === 'stdio' ? mcp.command || '' : mcp.url || ''}
                    onChange={(e) => {
                      const updated = [...formData.mcpServers]
                      if (mcp.type === 'stdio') {
                        updated[idx] = { ...mcp, command: e.target.value }
                      } else {
                        updated[idx] = { ...mcp, url: e.target.value }
                      }
                      setFormData({ ...formData, mcpServers: updated })
                    }}
                    className="input input-sm"
                    placeholder={mcp.type === 'stdio' ? 'npx @mcp/server' : 'https://mcp-server.com'}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">API Key (optional)</label>
                <input
                  type="password"
                  value={mcp.apiKey || ''}
                  onChange={(e) => {
                    const updated = [...formData.mcpServers]
                    updated[idx] = { ...mcp, apiKey: e.target.value }
                    setFormData({ ...formData, mcpServers: updated })
                  }}
                  className="input input-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          ))}
          <button onClick={addMCP} className="btn-secondary btn-sm w-full">
            <Plus size={16} />
            Add Another MCP Server
          </button>
        </div>
      )}
    </div>
  )
}