import { useState, useCallback } from 'react'
import { useWebSocket } from './useWebSocket.js'

export function useAgent() {
  const [host, setHost] = useState(localStorage.getItem('agentHost') || 'localhost')
  const [port, setPort] = useState(Number(localStorage.getItem('agentPort')) || 8765)
  const [history, setHistory] = useState([])

  const wsUrl = `ws://${host}:${port}`
  const { status, data, error, connect, disconnect, send } = useWebSocket(wsUrl)

  const updateEndpoint = useCallback((newHost, newPort) => {
    const h = newHost || 'localhost'
    const p = Number(newPort) || 8765
    setHost(h)
    setPort(p)
    localStorage.setItem('agentHost', h)
    localStorage.setItem('agentPort', String(p))
  }, [])

  const connectAgent = useCallback(() => {
    connect()
  }, [connect])

  const disconnectAgent = useCallback(() => {
    disconnect()
  }, [disconnect])

  const getLatestData = useCallback(() => {
    return data
  }, [data])

  return {
    host, port, status, data, error, history,
    connectAgent, disconnectAgent, updateEndpoint, send,
    getLatestData
  }
}
