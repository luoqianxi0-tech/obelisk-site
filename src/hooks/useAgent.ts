import { useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'

export function useAgent() {
  const { connected, stats, history, connect, disconnect } = useAgentStore()

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { connected, stats, history }
}
