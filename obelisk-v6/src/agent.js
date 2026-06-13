import { useObeliskStore } from './store.js'

let ws = null
let reconnectTimer = null

export function connectAgent() {
  if (ws?.readyState === WebSocket.OPEN) return

  try {
    ws = new WebSocket('ws://localhost:8765')

    ws.onopen = () => {
      useObeliskStore.getState().setAgentConnected(true)
      console.log('[AGENT] Connected')
      ws.send(JSON.stringify({ action: 'get_stats' }))
    }

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'stats') {
          useObeliskStore.getState().updateAgentStats(msg.data)
        }
      } catch (e) {}
    }

    ws.onclose = () => {
      useObeliskStore.getState().setAgentConnected(false)
      reconnectTimer = setTimeout(connectAgent, 3000)
    }

    ws.onerror = () => {
      useObeliskStore.getState().setAgentConnected(false)
    }
  } catch (e) {
    console.log('[AGENT] Connection failed:', e.message)
  }
}

export function disconnectAgent() {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  if (ws) { ws.close(); ws = null }
}

export function sendAgentCommand(cmd) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action: cmd }))
  }
}
