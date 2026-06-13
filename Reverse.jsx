import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Shield, Save, Plus, Eye } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useObeliskStore } from '../store.js'

export default function Reverse() {
  const { user } = useAuth()
  const { setLastAnalysis } = useObeliskStore()
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.apk')) return
    if (file.size > 50 * 1024 * 1024) return
    setAnalyzing(true)
    // Simulate analysis (replace with WASM later)
    await new Promise(r => setTimeout(r, 1500))
    const mock = {
      filename: file.name,
      manifest: { package: 'com.example.app', versionName: '1.0.0', permissions: ['android.permission.INTERNET', 'android.permission.CAMERA', 'android.permission.READ_CONTACTS'] },
      nativeLibs: ['libnative.so'],
      suspicious: ['https://api.target.com', 'secret_key'],
      risk: 65,
      timestamp: Date.now()
    }
    setResult(mock)
    setLastAnalysis(mock)
    setAnalyzing(false)
  }, [setLastAnalysis])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className="max-w-[900px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      <h1 className="text-[1.4rem] font-light tracking-[0.15em] mb-2 text-gradient">Reverse Notes</h1>
      <div className="text-[0.75rem] text-white/30 tracking-[0.1em] mb-8">APK Analyzer & Static Scanner</div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`border-2 border-dashed ${dragOver ? 'border-[rgba(100,255,150,0.6)] bg-[rgba(100,255,150,0.02)]' : 'border-white/15'} p-16 text-center transition-all cursor-pointer glass-panel`}
      >
        <div className="text-[2.5rem] mb-4 opacity-50">{analyzing ? '⏳' : '▲'}</div>
        <p className="text-[0.85rem] text-white/50 tracking-wide">
          {analyzing ? 'Analyzing...' : 'Drop APK here or click to upload'}
        </p>
        <div className="text-[0.65rem] text-white/25 mt-2">Max 50MB · Pure client-side analysis</div>
        <input type="file" id="fileInput" accept=".apk" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {result && (
        <motion.div className="mt-8 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {[
            { label: 'Package Name', val: result.manifest.package },
            { label: 'Version', val: result.manifest.versionName },
            { label: 'Risk Assessment', val: `${result.risk}/100`, badge: result.risk >= 60 ? 'HIGH RISK' : result.risk >= 30 ? 'MEDIUM RISK' : 'LOW RISK', badgeColor: result.risk >= 60 ? 'text-[rgba(255,80,80,0.6)] border-[rgba(255,80,80,0.6)]' : result.risk >= 30 ? 'text-[rgba(255,200,80,0.7)] border-[rgba(255,200,80,0.7)]' : 'text-[rgba(100,255,150,0.6)] border-[rgba(100,255,150,0.6)]' },
          ].map((r) => (
            <div key={r.label} className="glass-panel p-6 hover:border-white/15 transition-all">
              <div className="text-[0.75rem] text-white/40 tracking-[0.1em] uppercase mb-3">{r.label}</div>
              <div className="text-[1rem] text-white/80 font-mono break-all">{r.val}</div>
              {r.badge && <span className={`inline-block px-3 py-1 text-[0.75rem] tracking-[0.1em] border mt-2 ${r.badgeColor}`}>{r.badge}</span>}
            </div>
          ))}
          <div className="glass-panel p-6">
            <div className="text-[0.75rem] text-white/40 tracking-[0.1em] uppercase mb-3">Permissions</div>
            <div className="flex flex-wrap gap-1.5">
              {result.manifest.permissions.map((p) => {
                const danger = p.includes('CONTACTS') || p.includes('CAMERA') || p.includes('LOCATION') || p.includes('SMS')
                const warn = p.includes('STORAGE')
                return (
                  <span key={p} className={`px-2.5 py-1 bg-white/5 border text-[0.65rem] font-mono ${danger ? 'border-[rgba(255,80,80,0.6)] text-[rgba(255,80,80,0.8)]' : warn ? 'border-[rgba(255,200,80,0.7)] text-[rgba(255,200,80,0.8)]' : 'border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.6)]'}`}>
                    {p.replace('android.permission.', '')}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="glass-btn-primary flex items-center gap-2" onClick={() => {}}><Save size={14} /> Save to Profile</button>
            <button className="glass-btn flex items-center gap-2" onClick={() => {}}><Plus size={14} /> Add to Arsenal</button>
            <button className="glass-btn flex items-center gap-2" onClick={() => window.location.href = '/motion'}><Eye size={14} /> Visualize</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
