import { useState, useCallback, useRef, useEffect } from 'react'

export function useAgent() {
  const [status, setStatus] = useState('offline')
  const [data, setData] = useState({
    cpu: 0, memory: 0, traffic: 0, processes: 0, connections: 0, uptime: 0
  })
  const [history, setHistory] = useState([])
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)
  const hostRef = useRef('localhost')
  const portRef = useRef(8765)

  const connect = useCallback((host, port) => {
    const h = host || 'localhost'
    const p = port || 8765
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return
    hostRef.current = h
    portRef.current = p
    setStatus('connecting')
    try {
      const ws = new WebSocket('ws://' + h + ':' + p)
      wsRef.current = ws
      ws.onopen = () => {
        setStatus('online')
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'system' }))
      }
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg.type === 'system_stats') {
            const d = msg.data || msg
            setData({
              cpu: d.cpu_percent || d.cpu || 0,
              memory: d.memory_percent || d.memory || 0,
              traffic: d.bytes_sent || d.traffic || 0,
              processes: d.process_count || d.processes || 0,
              connections: d.connection_count || d.connections || 0,
              uptime: d.uptime || 0
            })
            setHistory(prev => {
              const next = [...prev, { time: Date.now(), cpu: d.cpu_percent || d.cpu || 0, mem: d.memory_percent || d.memory || 0 }]
              return next.slice(-30)
            })
          }
        } catch (e) {}
      }
      ws.onerror = () => setStatus('error')
      ws.onclose = () => {
        setStatus('offline')
        wsRef.current = null
        reconnectRef.current = setTimeout(() => connect(hostRef.current, portRef.current), 5000)
      }
    } catch (e) {
      setStatus('error')
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectRef.current) clearTimeout(reconnectRef.current)
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null }
    setStatus('offline')
  }, [])

  useEffect(() => () => disconnect(), [disconnect])

  return { status, data, history, connect, disconnect, host: hostRef.current, port: portRef.current }
