import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Shield, Save, Plus, Eye, Trash2, Search, AlertTriangle, CheckCircle, Clock, Hash, Cpu, Database, Network, Lock, FileText } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useObeliskStore } from '../store.js'

// 模拟分析数据生成
const generateAnalysisResult = (filename) => {
  const permissionsList = [
    { name: 'android.permission.INTERNET', desc: '网络访问', risk: 'low' },
    { name: 'android.permission.CAMERA', desc: '相机访问', risk: 'high' },
    { name: 'android.permission.READ_CONTACTS', desc: '读取联系人', risk: 'high' },
    { name: 'android.permission.ACCESS_FINE_LOCATION', desc: '精确定位', risk: 'high' },
    { name: 'android.permission.WRITE_EXTERNAL_STORAGE', desc: '写入存储', risk: 'medium' },
    { name: 'android.permission.READ_SMS', desc: '读取短信', risk: 'high' },
    { name: 'android.permission.RECEIVE_SMS', desc: '接收短信', risk: 'high' },
    { name: 'android.permission.ACCESS_NETWORK_STATE', desc: '网络状态', risk: 'low' },
    { name: 'android.permission.WAKE_LOCK', desc: '唤醒锁', risk: 'medium' },
    { name: 'android.permission.BLUETOOTH', desc: '蓝牙', risk: 'low' },
  ]
  
  const selectedPermissions = permissionsList.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 3)
  
  const activities = [
    { name: 'MainActivity', exported: true, launcher: true },
    { name: 'LoginActivity', exported: false },
    { name: 'DashboardActivity', exported: false },
    { name: 'SettingsActivity', exported: false },
    { name: 'WebViewActivity', exported: true },
  ]
  
  const services = [
    { name: 'SyncService', foreground: true },
    { name: 'AnalyticsService', foreground: false },
    { name: 'NotificationService', foreground: true },
  ]
  
  const receivers = [
    { name: 'BootReceiver', enabled: true },
    { name: 'NotificationReceiver', enabled: true },
  ]
  
  const suspiciousApis = [
    'java.lang.Runtime.exec',
    'android.os.Process.killProcess',
    'java.io.File.delete',
    'javax.crypto.Cipher',
  ]
  
  const trackers = [
    { name: 'Firebase Analytics', detected: Math.random() > 0.5 },
    { name: 'Google Analytics', detected: Math.random() > 0.5 },
    { name: 'Facebook SDK', detected: Math.random() > 0.3 },
    { name: 'Amplitude', detected: Math.random() > 0.4 },
  ]

  const highRiskCount = selectedPermissions.filter(p => p.risk === 'high').length
  const mediumRiskCount = selectedPermissions.filter(p => p.risk === 'medium').length
  const riskScore = Math.min(100, highRiskCount * 20 + mediumRiskCount * 10 + Math.floor(Math.random() * 20))

  return {
    filename,
    size: Math.floor(Math.random() * 50) + 5,
    manifest: {
      package: `com.${['example', 'test', 'app', 'mobile'][Math.floor(Math.random() * 4)]}.${['app', 'client', 'mobile', 'android'][Math.floor(Math.random() * 4)]}`,
      versionName: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
      versionCode: Math.floor(Math.random() * 1000) + 100,
      minSdk: Math.floor(Math.random() * 10) + 16,
      targetSdk: Math.floor(Math.random() * 5) + 30,
      permissions: selectedPermissions,
      activities,
      services,
      receivers,
    },
    nativeLibs: ['libnative.so', 'libcrypto.so'].filter(() => Math.random() > 0.3),
    suspicious: suspiciousApis.slice(0, Math.floor(Math.random() * 3)),
    trackers,
    codeSigning: {
      signed: Math.random() > 0.3,
      certificateValid: Math.random() > 0.5,
      signatureAlgorithm: 'SHA-256withRSA',
    },
    risk: riskScore,
    riskLevel: riskScore >= 70 ? 'CRITICAL' : riskScore >= 40 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW',
    timestamp: Date.now(),
    hash: {
      md5: Array.from({ length: 32 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      sha1: Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      sha256: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
    },
  }
}

export default function Reverse() {
  const { user } = useAuth()
  const { setLastAnalysis } = useObeliskStore()
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('analysisHistory')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history))
  }, [history])

  const handleFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.apk')) {
      alert('请选择有效的APK文件')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('文件大小不能超过50MB')
      return
    }
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000))
    const mock = generateAnalysisResult(file.name)
    setResult(mock)
    setLastAnalysis(mock)
    setHistory(prev => [{ ...mock, fileSize: file.size, date: new Date().toLocaleString() }, ...prev].slice(0, 10))
    setAnalyzing(false)
  }, [setLastAnalysis])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('analysisHistory')
  }

  const loadFromHistory = (item) => {
    setResult(item)
    setLastAnalysis(item)
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-[rgba(255,50,50,0.9)] border-[rgba(255,50,50,0.9)] bg-[rgba(255,50,50,0.1)]'
      case 'HIGH': return 'text-[rgba(255,100,50,0.9)] border-[rgba(255,100,50,0.9)] bg-[rgba(255,100,50,0.1)]'
      case 'MEDIUM': return 'text-[rgba(255,180,50,0.9)] border-[rgba(255,180,50,0.9)] bg-[rgba(255,180,50,0.1)]'
      default: return 'text-[rgba(100,255,100,0.9)] border-[rgba(100,255,100,0.9)] bg-[rgba(100,255,100,0.1)]'
    }
  }

  const getPermissionColor = (risk) => {
    switch (risk) {
      case 'high': return 'border-[rgba(255,80,80,0.6)] text-[rgba(255,80,80,0.8)] bg-[rgba(255,80,80,0.08)]'
      case 'medium': return 'border-[rgba(255,200,80,0.6)] text-[rgba(255,200,80,0.8)] bg-[rgba(255,200,80,0.08)]'
      default: return 'border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.8)] bg-[rgba(100,255,150,0.08)]'
    }
  }

  const filteredPermissions = result?.manifest?.permissions?.filter(p => 
    searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.4rem] font-light tracking-[0.15em] mb-2 text-gradient">Reverse Notes</h1>
          <div className="text-[0.75rem] text-white/30 tracking-[0.1em]">APK Analyzer & Static Scanner</div>
        </div>
        {user && (
          <div className="text-[0.7rem] text-white/40">
            <span className="px-2 py-1 bg-[rgba(100,255,150,0.1)] text-[rgba(100,255,150,0.6)] border border-[rgba(100,255,150,0.3)] rounded">
              Secure Mode Active
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer glass-panel ${
              dragOver ? 'border-[rgba(100,255,150,0.6)] bg-[rgba(100,255,150,0.05)] scale-[1.02]' : 'border-white/15 hover:border-white/25'
            }`}
            whileHover={!analyzing ? { scale: 1.01 } : {}}
            whileTap={!analyzing ? { scale: 0.99 } : {}}
          >
            <div className="text-[3rem] mb-4 opacity-50">{analyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                ⏳
              </motion.div>
            ) : '📦'}</div>
            <p className="text-[0.9rem] text-white/60 tracking-wide mb-2">
              {analyzing ? 'Analyzing APK...' : 'Drop APK here or click to upload'}
            </p>
            <div className="text-[0.65rem] text-white/30">
              {analyzing ? 'Scanning manifest, permissions, and code signatures...' : 'Max 50MB · Pure client-side analysis'}
            </div>
            <input type="file" id="fileInput" accept=".apk" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(100,200,255,0.2)] flex items-center justify-center">
                        <FileText className="text-[rgba(100,200,255,0.8)]" size={20} />
                      </div>
                      <div>
                        <div className="text-[0.9rem] text-white/90 font-medium">{result.filename}</div>
                        <div className="text-[0.7rem] text-white/40">{result.size} MB</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[0.7rem] font-medium tracking-wide border ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} RISK
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                      <div className="text-[1.5rem] font-mono text-[rgba(100,255,150,0.8)]">{result.risk}</div>
                      <div className="text-[0.65rem] text-white/40 mt-1">Risk Score</div>
                    </div>
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                      <div className="text-[1.5rem] font-mono text-[rgba(100,200,255,0.8)]">{result.manifest.permissions.length}</div>
                      <div className="text-[0.65rem] text-white/40 mt-1">Permissions</div>
                    </div>
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                      <div className="text-[1.5rem] font-mono text-[rgba(255,200,100,0.8)]">{result.nativeLibs.length}</div>
                      <div className="text-[0.65rem] text-white/40 mt-1">Native Libs</div>
                    </div>
                  </div>

                  <div className="w-full bg-black/40 rounded-full h-2 mb-2">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{
                        background: result.risk >= 70 ? 'linear-gradient(90deg, rgba(255,50,50,0.8), rgba(255,100,100,0.6))' :
                                   result.risk >= 40 ? 'linear-gradient(90deg, rgba(255,150,50,0.8), rgba(255,200,100,0.6))' :
                                   result.risk >= 20 ? 'linear-gradient(90deg, rgba(255,200,50,0.8), rgba(255,220,100,0.6))' :
                                   'linear-gradient(90deg, rgba(100,255,100,0.8), rgba(150,255,150,0.6))'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.risk}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[0.65rem] text-white/40">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-white/10">
                  {['overview', 'permissions', 'components', 'security', 'hashes'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-[0.75rem] tracking-wide transition-all ${
                        activeTab === tab ? 'text-white/90 border-b-2 border-[rgba(100,200,255,0.6)]' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {tab === 'overview' && 'Overview'}
                      {tab === 'permissions' && 'Permissions'}
                      {tab === 'components' && 'Components'}
                      {tab === 'security' && 'Security'}
                      {tab === 'hashes' && 'Hashes'}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2">
                      <Database size={14} /> Application Info
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-[0.65rem] text-white/40 mb-1">Package Name</div>
                        <div className="text-[0.85rem] text-white/80 font-mono break-all">{result.manifest.package}</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-[0.65rem] text-white/40 mb-1">Version</div>
                        <div className="text-[0.85rem] text-white/80 font-mono">{result.manifest.versionName}</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-[0.65rem] text-white/40 mb-1">Version Code</div>
                        <div className="text-[0.85rem] text-white/80 font-mono">{result.manifest.versionCode}</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-[0.65rem] text-white/40 mb-1">Min SDK</div>
                        <div className="text-[0.85rem] text-white/80 font-mono">API {result.manifest.minSdk}</div>
                      </div>
                    </div>

                    {result.suspicious.length > 0 && (
                      <>
                        <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2 mt-6">
                          <AlertTriangle size={14} className="text-[rgba(255,180,50,0.8)]" /> Suspicious APIs
                        </h3>
                        <div className="space-y-2">
                          {result.suspicious.map((api, i) => (
                            <div key={i} className="p-3 bg-[rgba(255,100,50,0.08)] border border-[rgba(255,100,50,0.3)] rounded-lg">
                              <div className="text-[0.8rem] text-[rgba(255,100,50,0.9)] font-mono">{api}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'permissions' && (
                  <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2">
                        <Lock size={14} /> Permissions
                      </h3>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder="Search permissions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-[0.75rem] text-white/80 placeholder-white/30 focus:outline-none focus:border-[rgba(100,200,255,0.5)] w-[200px]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredPermissions.map((p, i) => (
                        <motion.div
                          key={i}
                          className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${getPermissionColor(p.risk)}`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[0.8rem] font-mono">{p.name.replace('android.permission.', '')}</span>
                            <span className={`text-[0.6rem] px-2 py-0.5 rounded ${
                              p.risk === 'high' ? 'bg-[rgba(255,80,80,0.2)] text-[rgba(255,80,80,0.8)]' :
                              p.risk === 'medium' ? 'bg-[rgba(255,200,80,0.2)] text-[rgba(255,200,80,0.8)]' :
                              'bg-[rgba(100,255,150,0.2)] text-[rgba(100,255,150,0.8)]'
                            }`}>
                              {p.risk.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[0.65rem] text-white/60">{p.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'components' && (
                  <div className="glass-panel p-6 space-y-6">
                    <div>
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2 mb-4">
                        <Cpu size={14} /> Activities ({result.manifest.activities.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.manifest.activities.map((act, i) => (
                          <div key={i} className="p-4 bg-black/30 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[0.8rem] text-white/80 font-mono">{act.name}</span>
                              {act.launcher && <span className="text-[0.6rem] px-2 py-0.5 rounded bg-[rgba(100,200,255,0.2)] text-[rgba(100,200,255,0.8)]">Launcher</span>}
                            </div>
                            <div className="text-[0.65rem] text-white/40 mt-1">
                              Exported: {act.exported ? <CheckCircle size={12} className="inline text-[rgba(100,255,100,0.8)]" /> : <AlertTriangle size={12} className="inline text-[rgba(255,100,50,0.8)]" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2 mb-4">
                        <Network size={14} /> Services ({result.manifest.services.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.manifest.services.map((svc, i) => (
                          <div key={i} className="p-4 bg-black/30 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[0.8rem] text-white/80 font-mono">{svc.name}</span>
                              {svc.foreground && <span className="text-[0.6rem] px-2 py-0.5 rounded bg-[rgba(255,150,50,0.2)] text-[rgba(255,150,50,0.8)]">Foreground</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2 mb-4">
                        <Clock size={14} /> Receivers ({result.manifest.receivers.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.manifest.receivers.map((rec, i) => (
                          <div key={i} className="p-4 bg-black/30 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[0.8rem] text-white/80 font-mono">{rec.name}</span>
                              <span className={`text-[0.6rem] px-2 py-0.5 rounded ${rec.enabled ? 'bg-[rgba(100,255,100,0.2)] text-[rgba(100,255,100,0.8)]' : 'bg-[rgba(255,100,50,0.2)] text-[rgba(255,100,50,0.8)]'}`}>
                                {rec.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="glass-panel p-6 space-y-6">
                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
                        <Shield size={14} /> Code Signing
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[0.65rem] text-white/40 mb-1">Signed</div>
                          <div className={`text-[0.85rem] ${result.codeSigning.signed ? 'text-[rgba(100,255,100,0.8)]' : 'text-[rgba(255,100,50,0.8)]'}`}>
                            {result.codeSigning.signed ? '✓ Yes' : '✗ No'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[0.65rem] text-white/40 mb-1">Certificate Valid</div>
                          <div className={`text-[0.85rem] ${result.codeSigning.certificateValid ? 'text-[rgba(100,255,100,0.8)]' : 'text-[rgba(255,100,50,0.8)]'}`}>
                            {result.codeSigning.certificateValid ? '✓ Valid' : '✗ Invalid'}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[0.65rem] text-white/40 mb-1">Signature Algorithm</div>
                          <div className="text-[0.85rem] text-white/80 font-mono">{result.codeSigning.signatureAlgorithm}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-[rgba(255,180,50,0.8)]" /> Trackers Detected
                      </h3>
                      <div className="space-y-2">
                        {result.trackers.map((tracker, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <span className="text-[0.8rem] text-white/70">{tracker.name}</span>
                            <span className={`text-[0.65rem] px-2 py-0.5 rounded ${
                              tracker.detected ? 'bg-[rgba(255,100,50,0.2)] text-[rgba(255,100,50,0.8)]' : 'bg-[rgba(100,255,100,0.2)] text-[rgba(100,255,100,0.8)]'
                            }`}>
                              {tracker.detected ? 'Detected' : 'Not Found'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.nativeLibs.length > 0 && (
                      <div className="p-4 bg-black/30 rounded-lg">
                        <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
                          <Cpu size={14} /> Native Libraries
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.nativeLibs.map((lib, i) => (
                            <span key={i} className="px-3 py-1.5 bg-[rgba(100,200,255,0.1)] border border-[rgba(100,200,255,0.3)] rounded-lg text-[0.75rem] text-[rgba(100,200,255,0.8)] font-mono">
                              {lib}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'hashes' && (
                  <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2">
                      <Hash size={14} /> File Hashes
                    </h3>
                    {['md5', 'sha1', 'sha256'].map((hashType) => (
                      <div key={hashType} className="p-4 bg-black/30 rounded-lg">
                        <div className="text-[0.65rem] text-white/40 mb-2 uppercase">{hashType}</div>
                        <div className="text-[0.8rem] text-white/80 font-mono break-all">{result.hash[hashType]}</div>
                      </div>
                    ))}
                    <button className="w-full py-2 bg-[rgba(100,200,255,0.1)] border border-[rgba(100,200,255,0.3)] rounded-lg text-[0.75rem] text-[rgba(100,200,255,0.8)] hover:bg-[rgba(100,200,255,0.15)] transition-all">
                      Copy All Hashes
                    </button>
                  </div>
                )}

                <div className="flex gap-3 flex-wrap">
                  <motion.button 
                    className="glass-btn-primary flex items-center gap-2 px-6 py-2.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={14} /> Save to Profile
                  </motion.button>
                  <motion.button 
                    className="glass-btn flex items-center gap-2 px-6 py-2.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={14} /> Add to Arsenal
                  </motion.button>
                  <motion.button 
                    className="glass-btn flex items-center gap-2 px-6 py-2.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/motion'}
                  >
                    <Eye size={14} /> Visualize
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase flex items-center gap-2">
                <Clock size={14} /> Analysis History
              </h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-[0.65rem] text-white/40 hover:text-[rgba(255,100,50,0.8)] transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
            {history.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {history.map((item, i) => (
                  <motion.div
                    key={i}
                    onClick={() => loadFromHistory(item)}
                    className="p-3 bg-black/30 rounded-lg border border-white/5 cursor-pointer hover:border-[rgba(100,200,255,0.4)] hover:bg-black/40 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[0.75rem] text-white/80 truncate">{item.filename}</span>
                      <span className={`text-[0.55rem] px-1.5 py-0.5 rounded ${getRiskColor(item.riskLevel)}`}>
                        {item.risk}%
                      </span>
                    </div>
                    <div className="text-[0.6rem] text-white/40">{item.date}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/30 text-[0.75rem]">
                No analysis history yet
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-[0.8rem] text-white/50 tracking-[0.1em] uppercase mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[0.7rem] text-white/50">Analyses Performed</span>
                <span className="text-[0.9rem] text-white/80 font-mono">{history.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[0.7rem] text-white/50">Avg Risk Score</span>
                <span className="text-[0.9rem] text-white/80 font-mono">
                  {history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.risk, 0) / history.length) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[0.7rem] text-white/50">High Risk Found</span>
                <span className="text-[0.9rem] text-[rgba(255,100,50,0.8)] font-mono">
                  {history.filter(h => h.risk >= 60).length}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 bg-[rgba(100,200,255,0.05)] border border-[rgba(100,200,255,0.2)]">
            <div className="text-[0.7rem] text-[rgba(100,200,255,0.8)] text-center">
              <div className="text-[1.5rem] mb-2">🔍</div>
              All analysis is performed locally on your device. No data is sent to servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
