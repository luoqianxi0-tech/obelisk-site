import { useEffect, useRef, useState } from 'react'
import { useObeliskStore } from '../store.js'

const LOGS = [
  { cmd: 'hook.monitor', out: 'intercepting SSL pinning...', type: 'out' },
  { cmd: 'network.scan', out: '127.0.0.1:8080 proxy active', type: 'out' },
  { cmd: 'dex.dump', out: 'extracted 3 classes.dex', type: 'out' },
  { cmd: 'frida.server', out: 'connection refused', type: 'err' },
  { cmd: 'adb.devices', out: 'emulator-5554 device', type: 'out' },
  { cmd: 'jadx.decompile', out: 'resources decoded', type: 'out' },
  { cmd: 'permission.check', out: 'READ_CONTACTS flagged', type: 'err' },
  { cmd: 'burp.proxy', out: 'intercepting HTTPS traffic', type: 'out' },
]

export default function Terminal() {
  const [lines, setLines] = useState([])
  const bodyRef = useRef(null)
  const { user, isAdmin } = useObeliskStore()
  const [input, setInput] = useState('')

  useEffect(() => {
    const init = [
      { t: '[00:00:00]', cmd: 'system.init', out: 'OBELISK core loaded', type: 'out' },
      { t: '[00:00:01]', cmd: 'particle.engine', out: '30 nodes active', type: 'out' },
      { t: '[00:00:02]', cmd: 'auth.firebase', out: 'waiting for provider...', type: 'out' },
      { t: '[00:00:03]', cmd: 'monitor.hook', out: 'permission denied (expected)', type: 'err' },
    ]
    setLines(init)

    let idx = 0
    const interval = setInterval(() => {
      const log = LOGS[idx % LOGS.length]
      const time = new Date().toLocaleTimeString('en-US', { hour12: false })
      setLines(prev => {
        const next = [...prev, { t: `[${time}]`, cmd: log.cmd, out: log.out, type: log.type }]
        return next.length > 20 ? next.slice(1) : next
      })
      idx++
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const handleCommand = (cmd) => {
    const base = cmd.trim().split(' ')[0].toLowerCase()
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    let out = '', type = 'out'
    if (base === 'help') out = 'COMMANDS: help | status | clear | scan <pkg> | whoami | agent | connect | lang'
    else if (base === 'status') out = `Auth: ${user ? 'authenticated' : 'guest'} ${isAdmin ? '[ADMIN]' : ''} | Agent: ${useObeliskStore.getState().agentConnected ? 'online' : 'offline'}`
    else if (base === 'clear') { setLines([]); return }
    else if (base === 'whoami') out = user ? `${user.displayName} (${user.uid})` : 'Guest - Sign in required'
    else if (base === 'agent') out = useObeliskStore.getState().agentConnected ? 'Agent ws://localhost:8765 connected' : 'Agent offline - start local agent'
    else if (base === 'connect') { out = 'Attempting agent connection...'; type = 'out' }
    else if (base === 'lang') { useObeliskStore.getState().setLang(useObeliskStore.getState().lang === 'en' ? 'zh' : 'en'); out = 'Language switched' }
    else { out = `Unknown command: ${cmd}`; type = 'err' }
    setLines(prev => [...prev, { t: `[${time}]`, cmd: 'user.exec', out: cmd, type: 'out' }, { t: `[${time}]`, cmd: 'system', out, type }])
  }

  return (
    <div className="relative z-5 max-w-[880px] w-[calc(100%-80px)] mx-auto my-6 bg-black/60 border border-white/6 rounded overflow-hidden backdrop-blur-xl">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.03] border-b border-white/6">
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <span className="text-[0.65rem] text-white/30 tracking-[0.1em] ml-2 font-mono">obelisk@system ~ /var/log</span>
      </div>
      <div ref={bodyRef} className="px-3.5 py-3.5 font-mono text-[0.72rem] leading-[1.8] text-white/40 max-h-[120px] overflow-y-auto">
        {lines.map((l, i) => (
          <div key={i}>
            <span className="text-white/20">{l.t}</span>{' '}
            <span className="text-white/60">{l.cmd}</span>{' '}
            <span className={l.type === 'err' ? 'text-[rgba(255,80,80,0.5)]' : l.type === 'admin' ? 'text-[rgba(255,80,80,0.9)] font-bold' : 'text-[rgba(100,255,150,0.5)]'}>
              → {l.out}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center px-3.5 py-2 border-t border-white/6 gap-2">
        <span className="text-[rgba(100,255,150,0.5)] font-mono text-[0.72rem]">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleCommand(input); setInput('') } }}
          placeholder="Type help and press Enter..."
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent border-none text-white/60 font-mono text-[0.72rem] outline-none caret-[rgba(100,255,150,0.6)]"
        />
      </div>
    </div>
  )
}
