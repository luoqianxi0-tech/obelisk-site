import { create } from 'zustand'
import type { AgentMessage, Stats } from '../types'

interface AgentState {
  connected: boolean
  stats: Stats
  history: { traffic: number[]; load: number[] }
  ws: WebSocket | null
  connect: () => void
  disconnect: () => void
  send: (msg: any) => void
}

const defaultStats: Stats = {
  hooks: 0, packets: 0, scans: 0, nodes: 0, risk: 0,
  traffic_mbps: 0, cpu_percent: 0, memory_percent: 0
}

export const useAgentStore = create<AgentState>((set, get) => ({
  connected: false,
  stats: defaultStats,
  history: { traffic: [], load: [] },
  ws: null,

  connect: () => {
    if (get().ws?.readyState === WebSocket.OPEN) return
    try {
      const ws = new WebSocket('ws://localhost:8765')
      ws.onopen = () => {
        set({ connected: true, ws })
        ws.send(JSON.stringify({ action: 'get_stats' }))
      }
      ws.onmessage = (ev) => {
        try {
          const msg: AgentMessage = JSON.parse(ev.data)
          if (msg.type === 'stats') {
            const stats = msg.data as Stats
            set((s) => ({
              stats,
              history: {
                traffic: [...s.history.traffic, stats.traffic_mbps].slice(-60),
                load: [...s.history.load, stats.cpu_percent].slice(-60)
              }
            }))
          }
        } catch (e) {}
      }
      ws.onclose = () => set({ connected: false, ws: null })
      ws.onerror = () => set({ connected: false, ws: null })
    } catch (e) {}
  },

  disconnect: () => {
    const ws = get().ws
    if (ws) { ws.close(); set({ connected: false, ws: null }) }
  },

  send: (msg) => {
    const ws = get().ws
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
  }
}))
