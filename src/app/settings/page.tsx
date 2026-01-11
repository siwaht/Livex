'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
  Settings, Key, CreditCard, Bell, Shield, 
  Copy, Check, ExternalLink, Phone, Eye, EyeOff,
  Save, TestTube, Loader2, AlertCircle, CheckCircle2, X
} from 'lucide-react'

type Tab = 'livekit' | 'telephony' | 'billing' | 'notifications' | 'security'

interface PlatformSettings {
  livekit: {
    apiKey: string
    apiSecret: string
    wsUrl: string
  } | null
  twilioAccountSid?: string
  twilioAuthToken?: string
  telnyxApiKey?: string
  vonageApiKey?: string
  vonageApiSecret?: string
  updatedAt: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('livekit')
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // LiveKit form state
  const [livekitApiKey, setLivekitApiKey] = useState('')
  const [livekitApiSecret, setLivekitApiSecret] = useState('')
  const [livekitWsUrl, setLivekitWsUrl] = useState('')
  const [showLivekitSecret, setShowLivekitSecret] = useState(false)

  // Twilio form state
  const [twilioAccountSid, setTwilioAccountSid] = useState('')
  const [twilioAuthToken, setTwilioAuthToken] = useState('')
  const [showTwilioToken, setShowTwilioToken] = useState(false)

  // Telnyx form state
  const [telnyxApiKey, setTelnyxApiKey] = useState('')
  const [showTelnyxKey, setShowTelnyxKey] = useState(false)

  // Vonage form state
  const [vonageApiKey, setVonageApiKey] = useState('')
  const [vonageApiSecret, setVonageApiSecret] = useState('')
  const [showVonageSecret, setShowVonageSecret] = useState(false)

  const tabs = [
    { id: 'livekit' as Tab, label: 'LiveKit', icon: Key },
    { id: 'telephony' as Tab, label: 'Telephony', icon: Phone },
    { id: 'billing' as Tab, label: 'Billing', icon: CreditCard },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        // Populate form fields
        if (data.livekit) {
          setLivekitApiKey(data.livekit.apiKey || '')
          setLivekitWsUrl(data.livekit.wsUrl || '')
        }
        if (data.twilioAccountSid) setTwilioAccountSid(data.twilioAccountSid)
      }
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveLiveKit() {
    if (!livekitApiKey || !livekitApiSecret || !livekitWsUrl) {
      setError('All LiveKit fields are required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings/livekit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: livekitApiKey,
          apiSecret: livekitApiSecret,
          wsUrl: livekitWsUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save')
      }

      setSuccess('LiveKit credentials saved successfully')
      setLivekitApiSecret('') // Clear secret after save
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save LiveKit credentials')
    } finally {
      setSaving(false)
    }
  }

  async function handleTestLiveKit() {
    setTesting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings/livekit/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: livekitApiKey,
          apiSecret: livekitApiSecret || undefined,
          wsUrl: livekitWsUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Connection test failed')
      }

      setSuccess('LiveKit connection successful! Credentials are valid.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed')
    } finally {
      setTesting(false)
    }
  }

  async function handleSaveTwilio() {
    if (!twilioAccountSid || !twilioAuthToken) {
      setError('Twilio Account SID and Auth Token are required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twilio: { accountSid: twilioAccountSid, authToken: twilioAuthToken },
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSuccess('Twilio credentials saved successfully')
      setTwilioAuthToken('')
      await fetchSettings()
    } catch (err) {
      setError('Failed to save Twilio credentials')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveTelnyx() {
    if (!telnyxApiKey) {
      setError('Telnyx API Key is required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telnyx: { apiKey: telnyxApiKey },
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSuccess('Telnyx credentials saved successfully')
      setTelnyxApiKey('')
      await fetchSettings()
    } catch (err) {
      setError('Failed to save Telnyx credentials')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveVonage() {
    if (!vonageApiKey || !vonageApiSecret) {
      setError('Vonage API Key and Secret are required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vonage: { apiKey: vonageApiKey, apiSecret: vonageApiSecret },
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSuccess('Vonage credentials saved successfully')
      setVonageApiSecret('')
      await fetchSettings()
    } catch (err) {
      setError('Failed to save Vonage credentials')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-3">
            <Settings className="text-sky-400" size={28} />
            Settings
          </h1>
          <p className="page-subtitle">Configure your platform credentials and preferences</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert-error animate-slide-down mb-6">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <span className="text-red-400 flex-1">{error}</span>
            <button onClick={() => setError(null)} className="btn-icon text-red-400">
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6 animate-slide-down">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <span className="text-emerald-400 flex-1">{success}</span>
            <button onClick={() => setSuccess(null)} className="btn-icon text-emerald-400">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="spinner w-10 h-10" />
              </div>
            ) : (
              <>
                {activeTab === 'livekit' && (
                  <div className="space-y-6">
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-2">LiveKit Configuration</h3>
                      <p className="text-sm text-slate-400 mb-6">
                        Connect your LiveKit Cloud project to enable real-time voice communication.
                        Get your credentials from{' '}
                        <a 
                          href="https://cloud.livekit.io" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline"
                        >
                          cloud.livekit.io
                        </a>
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="label">API Key</label>
                          <input
                            type="text"
                            value={livekitApiKey}
                            onChange={(e) => setLivekitApiKey(e.target.value)}
                            className="input font-mono text-sm"
                            placeholder="APIxxxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="label">API Secret</label>
                          <div className="relative">
                            <input
                              type={showLivekitSecret ? 'text' : 'password'}
                              value={livekitApiSecret}
                              onChange={(e) => setLivekitApiSecret(e.target.value)}
                              className="input font-mono text-sm pr-12"
                              placeholder={settings?.livekit ? '(unchanged - enter new value to update)' : 'Enter your API secret'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowLivekitSecret(!showLivekitSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                              {showLivekitSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="label">WebSocket URL</label>
                          <input
                            type="text"
                            value={livekitWsUrl}
                            onChange={(e) => setLivekitWsUrl(e.target.value)}
                            className="input font-mono text-sm"
                            placeholder="wss://your-project.livekit.cloud"
                          />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            onClick={handleTestLiveKit}
                            disabled={testing || !livekitApiKey || !livekitWsUrl}
                            className="btn-secondary"
                          >
                            {testing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <TestTube size={16} />
                            )}
                            Test Connection
                          </button>
                          <button
                            onClick={handleSaveLiveKit}
                            disabled={saving || !livekitApiKey || !livekitApiSecret || !livekitWsUrl}
                            className="btn-primary"
                          >
                            {saving ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Save size={16} />
                            )}
                            Save Credentials
                          </button>
                        </div>
                      </div>

                      {settings?.livekit && (
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <CheckCircle2 size={18} />
                            <span className="font-medium">LiveKit Connected</span>
                          </div>
                          <p className="text-sm text-slate-400">
                            API Key: <code className="text-slate-300">{settings.livekit.apiKey}</code>
                          </p>
                          <p className="text-sm text-slate-400">
                            URL: <code className="text-slate-300">{settings.livekit.wsUrl}</code>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Learn how to set up LiveKit for voice agents.
                      </p>
                      <a 
                        href="https://docs.livekit.io/agents/overview/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex"
                      >
                        <ExternalLink size={16} />
                        LiveKit Agents Docs
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === 'telephony' && (
                  <div className="space-y-6">
                    {/* Twilio */}
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-2">Twilio</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Connect Twilio for phone number provisioning and SIP trunking.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="label">Account SID</label>
                          <input
                            type="text"
                            value={twilioAccountSid}
                            onChange={(e) => setTwilioAccountSid(e.target.value)}
                            className="input font-mono text-sm"
                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="label">Auth Token</label>
                          <div className="relative">
                            <input
                              type={showTwilioToken ? 'text' : 'password'}
                              value={twilioAuthToken}
                              onChange={(e) => setTwilioAuthToken(e.target.value)}
                              className="input font-mono text-sm pr-12"
                              placeholder={settings?.twilioAuthToken ? '(unchanged)' : 'Enter auth token'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowTwilioToken(!showTwilioToken)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showTwilioToken ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleSaveTwilio}
                          disabled={saving}
                          className="btn-primary"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          Save Twilio
                        </button>
                      </div>

                      {settings?.twilioAccountSid && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <p className="text-sm text-emerald-400">
                            ✓ Twilio configured: {settings.twilioAccountSid}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Telnyx */}
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-2">Telnyx</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Connect Telnyx for phone numbers and SIP connectivity.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="label">API Key</label>
                          <div className="relative">
                            <input
                              type={showTelnyxKey ? 'text' : 'password'}
                              value={telnyxApiKey}
                              onChange={(e) => setTelnyxApiKey(e.target.value)}
                              className="input font-mono text-sm pr-12"
                              placeholder={settings?.telnyxApiKey ? '(unchanged)' : 'Enter API key'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowTelnyxKey(!showTelnyxKey)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showTelnyxKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleSaveTelnyx}
                          disabled={saving}
                          className="btn-primary"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          Save Telnyx
                        </button>
                      </div>

                      {settings?.telnyxApiKey && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <p className="text-sm text-emerald-400">✓ Telnyx configured</p>
                        </div>
                      )}
                    </div>

                    {/* Vonage */}
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-2">Vonage</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Connect Vonage for phone numbers and voice services.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="label">API Key</label>
                          <input
                            type="text"
                            value={vonageApiKey}
                            onChange={(e) => setVonageApiKey(e.target.value)}
                            className="input font-mono text-sm"
                            placeholder="Enter API key"
                          />
                        </div>

                        <div>
                          <label className="label">API Secret</label>
                          <div className="relative">
                            <input
                              type={showVonageSecret ? 'text' : 'password'}
                              value={vonageApiSecret}
                              onChange={(e) => setVonageApiSecret(e.target.value)}
                              className="input font-mono text-sm pr-12"
                              placeholder={settings?.vonageApiSecret ? '(unchanged)' : 'Enter API secret'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowVonageSecret(!showVonageSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showVonageSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleSaveVonage}
                          disabled={saving}
                          className="btn-primary"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          Save Vonage
                        </button>
                      </div>

                      {settings?.vonageApiKey && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <p className="text-sm text-emerald-400">✓ Vonage configured</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">Current Plan</h3>
                          <p className="text-sm text-slate-400">Pro Plan - $99/month</p>
                        </div>
                        <span className="badge-success">Active</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-slate-900/50 rounded-xl">
                          <p className="text-2xl font-bold">10</p>
                          <p className="text-xs text-slate-400">Agents</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl">
                          <p className="text-2xl font-bold">5,000</p>
                          <p className="text-xs text-slate-400">Minutes/mo</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl">
                          <p className="text-2xl font-bold">5</p>
                          <p className="text-xs text-slate-400">Phone Numbers</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl">
                          <p className="text-2xl font-bold">∞</p>
                          <p className="text-xs text-slate-400">Webhooks</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="btn-primary">Upgrade Plan</button>
                        <button className="btn-secondary">Manage Billing</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Call completed', desc: 'Get notified when a call ends' },
                        { label: 'Call failed', desc: 'Get notified when a call fails' },
                        { label: 'Usage alerts', desc: 'Get notified when approaching limits' },
                        { label: 'Weekly reports', desc: 'Receive weekly analytics summary' },
                      ].map((item, i) => (
                        <label key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked={i < 2}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-sky-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Add an extra layer of security to your account.
                      </p>
                      <button className="btn-primary">Enable 2FA</button>
                    </div>

                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-slate-400">Chrome on Windows • Active now</p>
                          </div>
                          <span className="badge-success">Current</span>
                        </div>
                      </div>
                    </div>

                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Permanently delete your account and all associated data.
                      </p>
                      <button className="btn-danger">Delete Account</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
