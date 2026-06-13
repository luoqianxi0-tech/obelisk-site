import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useObeliskStore } from '../store.js'

export default function Motion() {
  const { lastAnalysis } = useObeliskStore()
  const permCanvasRef = useRef(null)
  const netCanvasRef = useRef(null)

  useEffect(() => {
    const canvas = permCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth
    const h = canvas.height = 300
    const perms = lastAnalysis?.manifest?.permissions || []
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.35

    if (perms.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '0.8rem sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('No APK data', cx, cy)
      return
    }

    const nodes = perms.map((p, i) => {
      const a = (i / perms.length) * Math.PI * 2 - Math.PI / 2
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, label: p.replace('android.permission.', ''), a }
    })

    let frame = 0, lastTime = 0
    const draw = (t) => {
      if (t - lastTime < 33) { requestAnimationFrame(draw); return }
      lastTime = t; frame++
      ctx.clearRect(0, 0, w, h)
      nodes.forEach((n) => {
        const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = `rgba(100,255,150,${0.1 * pulse})`; ctx.lineWidth = 1; ctx.stroke()
      })
      ctx.beginPath(); ctx.arc(cx, cy, 8 + Math.sin(frame * 0.05) * 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(100,255,150,0.6)'; ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '0.65rem monospace'; ctx.textAlign = 'center'
      ctx.fillText('APK', cx, cy + 20)
      nodes.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '0.6rem monospace'; ctx.textAlign = 'center'
        ctx.fillText(n.label, n.x + Math.cos(n.a) * 20, n.y + Math.sin(n.a) * 20)
      })
      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
  }, [lastAnalysis])

  return (
    <div className="max-w-[900px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      <h1 className="text-[1.4rem] font-light tracking-[0.15em] mb-2 text-gradient">Motion Lab</h1>
      <div className="text-[0.75rem] text-white/30 tracking-[0.1em] mb-8">APK Structure Visualizer & Network Topology</div>

      <div className="glass-panel p-6 mb-6">
        <div className="text-[0.75rem] text-white/40 tracking-[0.1em] uppercase mb-4">APK File Structure</div>
        {lastAnalysis ? (
          <div className="space-y-1">
            <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(80,180,255,0.6)] font-mono text-[0.75rem] text-white/60">{lastAnalysis.filename}</div>
            <div className="pl-5 border-l border-white/5 ml-1 space-y-1">
              <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(100,255,150,0.6)] font-mono text-[0.75rem] text-white/60">AndroidManifest.xml</div>
              <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(100,255,150,0.6)] font-mono text-[0.75rem] text-white/60">classes.dex</div>
              <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(100,255,150,0.6)] font-mono text-[0.75rem] text-white/60">lib/ ({lastAnalysis.nativeLibs?.length || 0} .so)</div>
              <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(100,255,150,0.6)] font-mono text-[0.75rem] text-white/60">res/ (resources)</div>
              <div className="px-3 py-2 bg-white/[0.03] border-l-2 border-[rgba(100,255,150,0.6)] font-mono text-[0.75rem] text-white/60">META-INF/ (signatures)</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-white/20 text-sm">No APK data. Upload in Reverse Notes to visualize.</div>
        )}
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="text-[0.75rem] text-white/40 tracking-[0.1em] uppercase mb-4">Permission Relationship Graph</div>
        <canvas ref={permCanvasRef} className="w-full h-[300px] bg-black/30 border border-white/5" />
      </div>

      <div className="glass-panel p-6">
        <div className="text-[0.75rem] text-white/40 tracking-[0.1em] uppercase mb-4">Network Traffic Topology</div>
        <canvas ref={netCanvasRef} className="w-full h-[300px] bg-black/30 border border-white/5" />
      </div>
    </div>
  )
}
