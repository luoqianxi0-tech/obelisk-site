import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, ExternalLink } from 'lucide-react'

const defaultResources = [
  { name: 'Frida Docs', url: 'https://frida.re/docs/home/', desc: 'Official Frida instrumentation documentation', category: 'docs', tags: ['frida', 'hook', 'runtime'] },
  { name: 'Android Security', url: 'https://developer.android.com/topic/security', desc: 'Official Android security best practices', category: 'docs', tags: ['android', 'security', 'google'] },
  { name: 'OWASP Mobile', url: 'https://owasp.org/www-project-mobile-security/', desc: 'OWASP Mobile Security Testing Guide', category: 'docs', tags: ['owasp', 'mobile', 'testing'] },
  { name: 'Hack The Box', url: 'https://www.hackthebox.com/', desc: 'Penetration testing labs and CTF challenges', category: 'ctf', tags: ['ctf', 'pentest', 'lab'] },
  { name: 'TryHackMe', url: 'https://tryhackme.com/', desc: 'Guided cybersecurity training platform', category: 'ctf', tags: ['training', 'ctf', 'beginner'] },
  { name: 'PortSwigger', url: 'https://portswigger.net/web-security', desc: 'Web security academy and Burp Suite docs', category: 'tool', tags: ['burp', 'web', 'proxy'] },
  { name: 'Ghidra', url: 'https://ghidra-sre.org/', desc: 'NSA reverse engineering framework', category: 'tool', tags: ['re', 'decompiler', 'nsa'] },
  { name: 'APKTool', url: 'https://ibotpeaches.github.io/Apktool/', desc: 'APK reverse engineering tool', category: 'tool', tags: ['apk', 'reverse', 'android'] },
  { name: 'Tor Project', url: 'https://www.torproject.org/', desc: 'Anonymous communication network', category: 'tor', tags: ['tor', 'privacy', 'anonymity'] },
  { name: 'Rapid7 Vulndb', url: 'https://www.rapid7.com/db/', desc: 'Vulnerability and exploit database', category: 'blog', tags: ['vuln', 'exploit', 'db'] },
]

const cats = ['all', 'blog', 'ctf', 'tool', 'docs', 'tor']

export default function DarkNav() {
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [resources] = useState(defaultResources)

  const filtered = resources.filter(r => {
    const matchCat = cat === 'all' || r.category === cat
    const q = (r.name + ' ' + r.desc + ' ' + r.tags.join(' ')).toLowerCase()
    const matchQ = q.includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="max-w-[900px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      <h1 className="text-[1.4rem] font-light tracking-[0.15em] mb-2 text-gradient">Dark Nav</h1>
      <div className="text-[0.75rem] text-white/30 tracking-[0.1em] mb-8">Security Resource Index & Tool Directory</div>

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-3 bg-obelisk-glass border border-obelisk-glassBorder text-white text-[0.85rem] outline-none focus:border-[rgba(100,255,150,0.6)] transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 text-[0.7rem] tracking-[0.1em] uppercase cursor-pointer transition-all border ${
              cat === c ? 'border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.6)] bg-[rgba(100,255,150,0.03)]' : 'border-obelisk-glassBorder text-white/40 hover:border-[rgba(100,255,150,0.6)] hover:text-[rgba(100,255,150,0.6)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((r, i) => {
          const domain = r.url.replace(/^https?:\/\//, '').split('/')[0]
          return (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 cursor-pointer hover:border-white/20 hover:-translate-y-0.5 hover:bg-white/5 transition-all group relative"
              onClick={() => window.open(r.url, '_blank')}
            >
              <div className="absolute top-0 left-0 w-0.5 h-0 bg-[rgba(80,180,255,0.6)] group-hover:h-full transition-all duration-400" />
              <div className="flex items-center gap-2.5 mb-1.5">
                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} width="16" height="16" className="rounded opacity-70" onError={(e) => e.target.style.display = 'none'} />
                <div className="text-[0.85rem] text-white/80 tracking-wide">{r.name}</div>
              </div>
              <div className="text-[0.65rem] text-[rgba(80,180,255,0.6)] font-mono mb-2 break-all">{r.url}</div>
              <div className="text-[0.65rem] text-white/30 leading-relaxed">{r.desc}</div>
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {r.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[0.6rem] text-white/40">{t}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="glass-btn text-[0.6rem] py-1.5 px-3" onClick={(e) => e.stopPropagation()}><Star size={12} /> Collect</button>
                <button className="glass-btn text-[0.6rem] py-1.5 px-3" onClick={(e) => e.stopPropagation()}><ExternalLink size={12} /> Arsenal</button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
