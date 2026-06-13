import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Activity, Package, ScrollText, FileText, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useObeliskStore } from '../store.js'
import Dashboard from '../components/Dashboard.jsx'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'arsenal', label: 'Arsenal', icon: Shield },
  { id: 'recent', label: 'Recent', icon: Package },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'posts', label: 'My Posts', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const defaultArsenal = [
  { name: 'Frida', cat: 'Instrumentation', desc: 'Dynamic code injection', url: 'https://frida.re' },
  { name: 'Burp Suite', cat: 'Proxy', desc: 'Web proxy & HTTPS interception', url: 'https://portswigger.net/burp' },
  { name: 'JADX', cat: 'Decompiler', desc: 'Dex to Java decompiler', url: 'https://github.com/skylot/jadx' },
  { name: 'Apktool', cat: 'Reverse', desc: 'APK reverse engineering', url: 'https://ibotpeaches.github.io/Apktool/' },
  { name: 'Objection', cat: 'Runtime', desc: 'Mobile runtime exploration', url: 'https://github.com/sensepost/objection' },
  { name: 'Magisk', cat: 'Root', desc: 'Root & module framework', url: 'https://github.com/topjohnwu/Magisk' },
  { name: 'Termux', cat: 'Terminal', desc: 'Linux terminal emulator', url: 'https://termux.dev' },
  { name: 'Ghidra', cat: 'RE', desc: 'Software reverse engineering', url: 'https://ghidra-sre.org' },
  { name: 'Wireshark', cat: 'Network', desc: 'Network protocol analyzer', url: 'https://www.wireshark.org' },
  { name: 'Nuclei', cat: 'Scanner', desc: 'Fast vulnerability scanner', url: 'https://nuclei.projectdiscovery.io' },
]

export default function Profile() {
  const { user, isAdmin } = useAuth()
  const { agentConnected } = useObeliskStore()
  const [activeTab, setActiveTab] = useState(0)
  const [indicatorStyle, setIndicatorStyle] = useState({})

  useEffect(() => {
    const el = document.getElementById(`tab-${activeTab}`)
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [activeTab])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-sm">
        Please sign in to view your Prism Profile
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      {/* ID Card */}
      <div className="glass-panel p-10 flex gap-8 items-center relative overflow-hidden mt-6">
        <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(100,255,150,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative flex-shrink-0">
          {isAdmin && <div className="absolute -inset-1 rounded-full border-2 border-transparent border-t-[rgba(100,255,150,0.6)] border-r-[rgba(100,255,150,0.6)] animate-spin-slow" />}
          <img src={user.photoURL || ''} alt="avatar" className="w-20 h-20 rounded-full border border-white/20 object-cover relative z-10" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="text-[1.4rem] font-light tracking-[0.1em] mb-1 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            {user.displayName || 'Unknown'}
          </div>
          <div className="text-[0.75rem] text-[rgba(100,255,150,0.6)] tracking-[0.15em] font-mono mb-3">
            CODENAME: UNSET
          </div>
          <div className="flex gap-6 text-[0.7rem] text-white/30 tracking-wide items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgba(100,255,150,0.6)] animate-pulse-dot" />
              Active
            </span>
            <span>Analyst</span>
            <span>{new Date(user.metadata?.creationTime).toISOString().slice(0,10).replace(/-/g,'.')}</span>
            {isAdmin && (
              <span className="px-2 py-[3px] bg-[rgba(100,255,150,0.08)] border border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.8)] text-[0.6rem] tracking-[0.1em] uppercase font-mono animate-pulse-admin">
                ★ ADMIN
              </span>
            )}
            <span className="text-[0.6rem] text-white/20 font-mono">AGENT: {agentConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* Level */}
      <div className="glass-panel p-8 mt-6">
        <div className="flex justify-between items-baseline mb-4">
          <div className="text-[0.8rem] tracking-[0.15em] text-white/60 uppercase">System Clearance</div>
          <div className="text-[1.2rem] font-light text-[rgba(100,255,150,0.6)] font-mono">LV.01</div>
        </div>
        <div className="relative h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[rgba(100,255,150,0.6)] to-[rgba(80,180,255,0.6)] w-[0%] transition-all duration-1000" />
        </div>
        <div className="flex justify-between mt-2 text-[0.65rem] text-white/25 font-mono">
          <span>0 XP</span><span>1000 XP</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative flex mt-8 border-b border-white/8">
        {tabs.map((t, i) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              id={`tab-${i}`}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3.5 bg-transparent border-none text-[0.7rem] tracking-[0.1em] uppercase cursor-pointer transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === i ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
        <motion.div
          className="absolute bottom-[-1px] h-[1px] bg-[rgba(100,255,150,0.6)]"
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Tab Panels */}
      <div className="pt-6 min-h-[400px]">
        {activeTab === 0 && <Dashboard />}
        {activeTab === 1 && (
          <div className="grid grid-cols-4 gap-3">
            {defaultArsenal.map((tool, i) => (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-5 block no-underline text-inherit cursor-pointer hover:border-white/20 hover:-translate-y-0.5 hover:bg-white/5 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="absolute top-0 left-0 w-0.5 h-0 bg-[rgba(100,255,150,0.6)] group-hover:h-full transition-all duration-400" />
                <div className="text-[0.8rem] text-white/80 tracking-wide mb-1">{tool.name}</div>
                <div className="text-[0.6rem] text-[rgba(100,255,150,0.6)] tracking-[0.1em] uppercase mb-2">{tool.cat}</div>
                <div className="text-[0.65rem] text-white/30 leading-relaxed">{tool.desc}</div>
                <div className="text-[0.6rem] text-[rgba(80,180,255,0.6)] mt-2 font-mono break-all">{tool.url}</div>
              </motion.a>
            ))}
          </div>
        )}
        {activeTab === 2 && (
          <div className="text-center py-20 text-white/20 text-sm">No recent analysis targets</div>
        )}
        {activeTab === 3 && (
          <div className="text-center py-20 text-white/20 text-sm">No activity recorded</div>
        )}
        {activeTab === 4 && (
          <div className="text-center py-20 text-white/20 text-sm">No posts yet. Go to Inspo Ruins to publish!</div>
        )}
        {activeTab === 5 && (
          <div className="flex flex-col gap-3 max-w-[600px]">
            {['Codename', 'Language', 'Data Persistence', 'Clear Local Data'].map((s) => (
              <div key={s} className="glass-panel p-5 flex justify-between items-center hover:border-white/15 transition-all">
                <div>
                  <div className="text-[0.8rem] text-white/70 tracking-wide">{s}</div>
                  <div className="text-[0.65rem] text-white/25 mt-1">{s === 'Data Persistence' ? 'Synced to Firestore' : 'Edit your settings'}</div>
                </div>
                <button className="glass-btn">Edit</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
