'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { 
  Settings, Key, CreditCard, Bell, Shield, Globe, 
  Copy, RefreshCw, Check, ExternalLink, Phone
} from 'lucide-react'

type Tab = 'api' | 'billing' | 'notifications' | 'security' | 'phone'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('api')
  const [copied, setCopied] = useState(false)

  const tabs = [
    { id: 'api' as Tab, label: 'API Keys', icon: Key },
    { id: 'billing' as Tab, label: 'Billing', icon: CreditCard },
    { id: 'phone' as Tab, label: 'Phone Numbers', icon: Phone },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          <p className="page-subtitle">Manage your account and platform settings</p>
        </div>

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
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">API Keys</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Use these keys to authenticate API requests to the VoiceAgent platform.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Live API Key</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="va_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          readOnly
                          className="input font-mono text-sm flex-1"
                        />
                        <button
                          onClick={() => handleCopy('va_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')}
                          className="btn-secondary"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="label">Test API Key</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="va_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          readOnly
                          className="input font-mono text-sm flex-1"
                        />
                        <button
                          onClick={() => handleCopy('va_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')}
                          className="btn-secondary"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>

                    <button className="btn-danger btn-sm">
                      <RefreshCw size={16} />
                      Regenerate Keys
                    </button>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">API Documentation</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Learn how to integrate VoiceAgent into your applications.
                  </p>
                  <a href="#" className="btn-secondary inline-flex">
                    <ExternalLink size={16} />
                    View Documentation
                  </a>
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

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Minutes Used</span>
                        <span>2,450 / 5,000</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '49%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">API Calls</span>
                        <span>12,500 / 50,000</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">Phone Numbers</h3>
                      <p className="text-sm text-slate-400">Manage your inbound phone numbers</p>
                    </div>
                    <button className="btn-primary btn-sm">
                      <Plus size={16} />
                      Buy Number
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { number: '+1 (555) 123-4567', agent: 'Customer Support', provider: 'Twilio' },
                      { number: '+1 (555) 987-6543', agent: 'Sales Assistant', provider: 'Twilio' },
                    ].map((phone, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                        <div>
                          <p className="font-mono font-medium">{phone.number}</p>
                          <p className="text-sm text-slate-400">
                            Assigned to: {phone.agent} • {phone.provider}
                          </p>
                        </div>
                        <button className="btn-ghost btn-sm">Configure</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Telephony Providers</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Connect your telephony provider to enable phone calls.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Twilio', 'Vonage', 'Telnyx'].map((provider) => (
                      <button
                        key={provider}
                        className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-sky-500/50 transition-colors text-left"
                      >
                        <p className="font-medium mb-1">{provider}</p>
                        <p className="text-xs text-slate-400">Click to configure</p>
                      </button>
                    ))}
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
          </div>
        </div>
      </main>
    </div>
  )
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
