'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastData {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void
}

const ANIMATION_DURATION = 300
const DEFAULT_TOAST_DURATION = 5000

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-400',
    containerClass: 'border-green-500/30 bg-green-500/10',
    ariaLabel: 'Success notification',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-red-400',
    containerClass: 'border-red-500/30 bg-red-500/10',
    ariaLabel: 'Error notification',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-400',
    containerClass: 'border-blue-500/30 bg-blue-500/10',
    ariaLabel: 'Information notification',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-400',
    containerClass: 'border-yellow-500/30 bg-yellow-500/10',
    ariaLabel: 'Warning notification',
  },
} as const

export function Toast({ id, message, type, duration = DEFAULT_TOAST_DURATION, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => onClose(id), ANIMATION_DURATION)
  }, [id, onClose])

  useEffect(() => {
    // Trigger enter animation
    const showTimer = requestAnimationFrame(() => setIsVisible(true))
    
    // Auto-dismiss after duration
    const dismissTimer = setTimeout(handleClose, duration)
    
    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [duration, handleClose])

  const config = TOAST_CONFIG[type]
  const Icon = config.icon

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-label={config.ariaLabel}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
        shadow-lg transition-all duration-300 ease-out ${config.containerClass}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
      `}
    >
      <Icon className={`${config.iconClass} shrink-0`} size={20} aria-hidden="true" />
      <span className="text-white text-sm flex-1 break-words">{message}</span>
      <button
        type="button"
        onClick={handleClose}
        className="text-gray-400 hover:text-white transition-colors shrink-0 p-1 -m-1 rounded focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Dismiss notification"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onClose: (id: string) => void
  maxToasts?: number
}

export function ToastContainer({ toasts, onClose, maxToasts = 5 }: ToastContainerProps) {
  const visibleToasts = useMemo(
    () => toasts.slice(-maxToasts),
    [toasts, maxToasts]
  )

  if (visibleToasts.length === 0) return null

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full sm:w-auto"
      aria-label="Notifications"
    >
      {visibleToasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
