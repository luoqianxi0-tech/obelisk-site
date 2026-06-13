import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useObeliskStore } from '../store.js'

function WaveCanvas({ data, color }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth
    const h = canvas.height = 80
    ctx.clearRect(0, 0, w, h)
    if (data.length < 2) return
    ctx.beginPath()
    ctx.moveTo(0, h - data[0] * 2)
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo((i / (data.length - 1)) * w, h - data[i] * 2)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      ctx.lineTo((i / (data.length - 1)) * w, h - data[i] * 2)
    }
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fillStyle = color.replace('0.6', '0.05')
    ctx.fill()
  }, [data, color])
  return <canvas ref={canvasRef} className="w-full h-20 mt-2" />
}

export default function Dashboard() {
  const { agentStats, agentHistory, agentConnected } = useObeliskStore()

  const cards = [
    { id: 'traffic', label: 'Network Traffic', value: agentStats.traffic_mbps.toFixed(2), unit: 'MB/s', wide: true, data: agentHistory.traffic, color: 'rgba(100,255,150,0.6)' },
    { id: 'hooks', label: 'Hooks Intercepted', value: agentStats.hooks_intercepted, sub: 'real-time' },
    { id: 'risk', label: 'Risk Score', value: Math.min(agentStats.risk_score, 100), isGauge: true },
    { id: 'packets', label: 'Packets Captured', value: agentStats.packets_total, sub: 'today' },
    { id: 'scans', label: 'Scans Completed', value: agentStats.scans || 0, sub: 'this week' },
    { id: 'nodes', label: 'Active Nodes', value: agentStats.active_nodes, sub: 'live' },
    { id: 'load', label: 'System Load', value: Math.round(agentStats.cpu_percent), unit: '%', full: true, data: agentHistory.load, color: 'rgba(80,180,255,0.6)' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <motion.div
          key={c.id}
          className={`glass-panel p-6 relative overflow-hidden cursor-pointer hover:border-white/15 transition-all ${c.wide ? 'col-span-2' : ''} ${c.full ? 'col-span-3' : ''}`}
          whileHover={{ y: -2 }}
          onClick={() => {}}
        >
          <div className="text-[0.65rem] text-white/30 tracking-[0.1em] uppercase mb-3">{c.label}</div>
          {c.isGauge ? (
            <div className="flex items-center justify-center h-20 relative">
              <svg className="w-[70px] h-[70px] -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(100,255,150,0.6)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={176} strokeDashoffset={176 * (1 - c.value / 100)} className="transition-all duration-1000" />
              </svg>
              <span className="absolute text-[0.75rem] text-white font-mono">{c.value}%</span>
            </div>
          ) : (
            <>
              <div className="text-[1.6rem] font-light text-white font-mono tracking-tight">
                {c.value}{c.unit && <span className="text-[0.6rem] text-white/30 ml-1">{c.unit}</span>}
              </div>
              {c.sub && <div className="text-[0.65rem] text-white/20 mt-1 font-mono">{c.sub}</div>}
            </>
          )}
          {c.data && <WaveCanvas data={c.data} color={c.color} />}
          <div className="absolute top-2.5 right-3.5 text-[0.6rem] text-[rgba(100,255,150,0.6)] font-mono opacity-70">
            {agentConnected ? '● LIVE' : '○ OFF'}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
