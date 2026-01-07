'use client'

import { useState, useCallback, useEffect } from 'react'

interface UseApiOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: options.initialData ?? null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchFn()
      setState({ data, loading: false, error: null })
      options.onSuccess?.(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setState(prev => ({ ...prev, loading: false, error }))
      options.onError?.(error)
      throw error
    }
  }, [fetchFn, options])

  const refetch = useCallback(() => execute(), [execute])

  useEffect(() => {
    execute()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch }
}

// Mutation hook for POST/PUT/DELETE operations
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: Error, variables: V) => void
}

export function useMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
) {
  const [state, setState] = useState<{
    loading: boolean
    error: Error | null
  }>({
    loading: false,
    error: null,
  })

  const mutate = useCallback(async (variables: V) => {
    setState({ loading: true, error: null })
    try {
      const data = await mutationFn(variables)
      setState({ loading: false, error: null })
      options.onSuccess?.(data, variables)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setState({ loading: false, error })
      options.onError?.(error, variables)
      throw error
    }
  }, [mutationFn, options])

  return { ...state, mutate }
}

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Local storage hook with SSR safety
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Toast notification hook
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
