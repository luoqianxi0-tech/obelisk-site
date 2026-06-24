import { useState, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useAgent } from '../hooks/useAgent.jsx'
import GlassCard from '../components/GlassCard.jsx'
import StatChart from '../components/StatChart.jsx'
import { Zap, Plug, Unplug, RefreshCw, Cpu, MemoryStick, Network, Clock } from 'lucide-react'

export default function AgentPanel() {
  const { t } = useTranslation()
  const { status, data, history, connect, disconnect } = useAgent()
  const [host, setHost] = useState('localhost')
  const [port, setPort] = useState(8765)

  useEffect(() => {
    const saved = localStorage.getItem('obelisk-agent-host')
    if (saved) setHost(saved)
    const savedPort = localStorage.getItem('obelisk-agent-port')
    if (savedPort) setPort(Number(savedPort))
  }, [])

  const handleConnect = () => {
    localStorage.setItem('obelisk-agent-host', host)
    localStorage.setItem('obelisk-agent-port', String(port))
    connect(host, port)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">{t('agent.title')}</h1>
        <p className="text-sm text-obelisk-muted">{t('agent.desc')}</p>
      </div>

      <GlassCard strong>
        <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-1 block">{t('agent.host')}</label>
            <input value={host} onChange={e => setHost(e.target.value)} className="input-struct text-sm" placeholder="localhost or IP" />
          </div>
          <div className="w-24">
            <label className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-1 block">{t('agent.port')}</label>
            <input value={port} onChange={e => setPort(Number(e.target.value))} type="number" className="input-struct text-sm" />
          </div>
          <div className="flex gap-2">
            {status === 'offline' || status === 'error' ? (
              <button onClick={handleConnect} className="btn-primary flex items-center gap-1"><Plug size={14} /> {t('agent.connect')}</button>
            ) : (
              <button onClick={disconnect} className="btn-secondary flex items-center gap-1"><Unplug size={14} /> {t('agent.disconnect')}</button>
            )}
            <button onClick={handleConnect} className="btn-secondary px-3"><RefreshCw size={14} /></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className={status === 'online' ? 'text-green-600' : 'text-gray-400'} />
          <span className="text-xs font-mono uppercase">{t('agent.status')}: {status}</span>
          {status !== 'online' && <span className="text-[10px] text-obelisk-muted">({t('agent.localMode')})</span>}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard className="text-center">
          <Cpu size={18} className="mx-auto mb-2 text-obelisk-muted" />
          <p className="text-2xl font-bold font-mono">{data.cpu.toFixed(1)}%</p>
          <p className="text-[10px] text-obelisk-muted">{t('agent.cpuUsage')}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <MemoryStick size={18} className="mx-auto mb-2 text-obelisk-muted" />
          <p className="text-2xl font-bold font-mono">{data.memory.toFixed(1)}%</p>
          <p className="text-[10px] text-obelisk-muted">{t('agent.memUsage')}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Network size={18} className="mx-auto mb-2 text-obelisk-muted" />
          <p className="text-2xl font-bold font-mono">{data.connections}</p>
          <p className="text-[10px] text-obelisk-muted">{t('agent.connections')}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Clock size={18} className="mx-auto mb-2 text-obelisk-muted" />
          <p className="text-2xl font-bold font-mono">{Math.floor(data.uptime / 60)}m</p>
          <p className="text-[10px] text-obelisk-muted">{t('agent.processes')}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard>
          <p className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-2">CPU History</p>
          <StatChart data={history} dataKey="cpu" color="#111" />
        </GlassCard>
        <GlassCard>
          <p className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-2">Memory History</p>
          <StatChart data={history} dataKey="mem" color="#c9a227" />
        </GlassCard>
      </div>

      {status !== 'online' && (
        <GlassCard>
          <p className="text-sm text-obelisk-muted text-center">{t('agent.localModeDesc')}</p>
        </GlassCard>
      )}
    </div>
  )
}
