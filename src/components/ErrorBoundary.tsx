'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
            <p className="text-gray-400 text-sm mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional error fallback for use with Suspense
export function ErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl">
        <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
        <p className="text-gray-400 text-sm mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        {resetError && (
          <button
            onClick={resetError}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
