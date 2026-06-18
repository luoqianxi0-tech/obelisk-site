import { useState, useEffect, useRef, useCallback } from 'react'

export function useWebSocket(url) {
  const [status, setStatus] = useState('disconnected')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)
  const attemptRef = useRef(0)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      setStatus('connecting')
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('connected')
        setError(null)
        attemptRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          setData(parsed)
        } catch (e) {
          setData({ raw: event.data })
        }
      }

      ws.onerror = (e) => {
        setStatus('error')
        setError('Connection failed')
      }

      ws.onclose = () => {
        setStatus('disconnected')
        wsRef.current = null
        const delay = Math.min(1000 * Math.pow(2, attemptRef.current), 30000)
        attemptRef.current += 1
        reconnectRef.current = setTimeout(() => connect(), delay)
      }
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current)
      reconnectRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setStatus('disconnected')
    attemptRef.current = 0
  }, [])

  const send = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof msg === 'string' ? msg : JSON.stringify(msg))
      return true
    }
    return false
  }, [])

  useEffect(() => {
    return () => disconnect()
  }, [disconnect])

  return { status, data, error, connect, disconnect, send }
}
