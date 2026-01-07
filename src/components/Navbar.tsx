'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Phone, Bot, Users, Menu, X, Sparkles, 
  BarChart3, History, Home, Settings,
  PhoneOutgoing, ChevronDown
} from 'lucide-react'

const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard', label: 'Analytics', icon: BarChart3 },
]

const telephonyLinks = [
  { href: '/phone-numbers', label: 'Phone Numbers', icon: Phone },
  { href: '/outbound', label: 'Outbound Calls', icon: PhoneOutgoing },
  { href: '/calls', label: 'Call History', icon: History },
]

const adminLinks = [
  { href: '/users', label: 'Users', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTelephony, setShowTelephony] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white hidden sm:block">VoiceAgent</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Main Links */}
            {mainLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}

            {/* Telephony Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTelephony(!showTelephony)}
                onBlur={() => setTimeout(() => setShowTelephony(false), 150)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  telephonyLinks.some(l => isActive(l.href))
                    ? 'bg-sky-500/15 text-sky-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Phone size={16} />
                Telephony
                <ChevronDown size={14} className={`transition-transform ${showTelephony ? 'rotate-180' : ''}`} />
              </button>
              {showTelephony && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl py-1 animate-fade-in">
                  {telephonyLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive(link.href)
                            ? 'bg-sky-500/15 text-sky-400'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon size={16} />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-700 mx-2" />

            {/* Admin Links */}
            {adminLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800/50 animate-slide-down">
            <div className="space-y-1">
              {/* Main */}
              {mainLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-500/15 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}

              <div className="border-t border-slate-800/50 my-2 pt-2">
                <p className="px-3 py-1 text-xs text-slate-500 uppercase tracking-wider">Telephony</p>
              </div>

              {telephonyLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-500/15 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}

              <div className="border-t border-slate-800/50 my-2 pt-2">
                <p className="px-3 py-1 text-xs text-slate-500 uppercase tracking-wider">Admin</p>
              </div>

              {adminLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-500/15 text-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
