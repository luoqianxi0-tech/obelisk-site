import { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useAgentStore } from '../store/agentStore'

interface LogLine {
  time: string
  cmd: string
  out: string
  type: 'out' | 'err' | 'admin'
}

export function Terminal() {
  const [logs, setLogs] = useState<LogLine[]>([
    { time: '[00:00:00]', cmd: 'system.init', out: 'OBELISK v6 core loaded', type: 'out' },
    { time: '[00:00:01]', cmd: 'particle.engine', out: '30 nodes active', type: 'out' },
    { time: '[00:00:02]', cmd: 'auth.firebase', out: 'waiting for provider...', type: 'out' },
    { time: '[00:00:03]', cmd: 'monitor.hook', out: 'permission denied (expected)', type: 'err' },
  ])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const user = useAuthStore((s) => s.user)
  const connected = useAgentStore((s) => s.connected)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [logs])

  const addLog = (cmd: string, out: string, type: LogLine['type'] = 'out') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    setLogs((prev) => [...prev.slice(-20), { time: `[${time}]`, cmd, out, type }])
  }

  const handleCommand = (cmd: string) => {
    const base = cmd.trim().split(' ')[0].toLowerCase()
    addLog('user.exec', cmd, 'out')

    setTimeout(() => {
      switch (base) {
        case 'help':
          addLog('system', 'COMMANDS: help | status | clear | scan <pkg> | whoami | agent | connect | lang | goto <page>', 'out')
          break
        case 'status':
          addLog('system', `Auth: ${user ? 'authenticated' : 'guest'} | Agent: ${connected ? 'connected' : 'offline'} | Platform: web`, 'out')
          break
        case 'clear':
          setLogs([])
          break
        case 'whoami':
          addLog('system', user ? `${user.displayName} [${user.uid}]` : 'Guest - Sign in required', 'out')
          break
        case 'agent':
          addLog('system', `Agent WS: ${connected ? 'ws://localhost:8765 connected' : 'offline - start local agent'}`, 'out')
          break
        case 'connect':
          useAgentStore.getState().connect()
          addLog('system', 'Attempting agent connection...', 'out')
          break
        case 'goto':
          const page = cmd.split(' ')[1]
          if (page) {
            addLog('system', `Navigating to /${page}...`, 'out')
          } else {
            addLog('system', 'Usage: goto <home|reverse|darknav|inspo|motion|profile>', 'err')
          }
          break
        default:
          addLog('system', `Unknown command: ${cmd}. Type help for list.`, 'err')
      }
    }, 200)
  }

  return (
    <div className="relative z-5 max-w-[880px] w-[calc(100%-80px)] mx-auto mt-6 mb-4 bg-black/60 border border-white/[0.06] rounded overflow-hidden backdrop-blur-[20px]">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <span className="text-[0.65rem] text-white/30 tracking-[0.1em] ml-2 font-mono">obelisk@system ~ /var/log</span>
      </div>
      <div ref={bodyRef} className="px-3.5 py-3.5 font-mono text-[0.72rem] leading-[1.8] text-white/40 max-h-[120px] overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i}>
            <span className="text-white/20">{log.time}</span>{' '}
            <span className="text-white/60">{log.cmd}</span>{' '}
            <span className={log.type === 'err' ? 'text-obelisk-danger' : log.type === 'admin' ? 'text-obelisk-danger font-bold' : 'text-obelisk-accent'}>
              → {log.out}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-t border-white/[0.06]">
        <span className="text-obelisk-accent font-mono text-[0.72rem]">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(input)
              setInput('')
            }
          }}
          placeholder="Type help and press Enter..."
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent border-none text-white/60 font-mono text-[0.72rem] outline-none caret-obelisk-accent"
        />
      </div>
    </div>
  )
}
