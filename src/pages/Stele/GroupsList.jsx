import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function GroupsList() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [joined, setJoined] = useState(['1', '3'])

  const groups = [
    { id: '1', name: 'Reverse Engineering', desc: '二进制分析、逆向工程、恶意软件分析', members: 1284, posts: 3420, activity: 98, color: 'from-orange-400 to-red-500', tags: ['IDA', 'Ghidra', 'x64dbg'] },
    { id: '2', name: 'CTF / Pwn', desc: 'CTF 竞赛、二进制漏洞利用、内核安全', members: 956, posts: 2180, activity: 95, color: 'from-blue-400 to-indigo-500', tags: ['Heap', 'Stack', 'Kernel'] },
    { id: '3', name: 'Mobile Security', desc: 'Android/iOS 逆向、Frida、越狱开发', members: 742, posts: 1560, activity: 88, color: 'from-emerald-400 to-teal-500', tags: ['Frida', 'APK', 'Jailbreak'] },
    { id: '4', name: 'Web3 Security', desc: '智能合约审计、DeFi 安全、区块链取证', members: 621, posts: 980, activity: 82, color: 'from-purple-400 to-pink-500', tags: ['Solidity', 'EVM', 'MEV'] },
    { id: '5', name: 'Web Penetration', desc: 'Web 渗透测试、红队技术、漏洞挖掘', members: 1890, posts: 5620, activity: 96, color: 'from-cyan-400 to-blue-500', tags: ['SQLi', 'XSS', 'SSRF'] },
    { id: '6', name: 'OSINT & Forensics', desc: '开源情报、数字取证、威胁情报', members: 534, posts: 1200, activity: 75, color: 'from-amber-400 to-orange-500', tags: ['OSINT', 'DFIR', 'Volatility'] },
  ]

  function toggleJoin(id) {
    if (!user) return
    setJoined(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl text-obelisk-line">{t('stele.groups')}</h2>
            <p className="text-sm text-obelisk-textMuted mt-1">{groups.length} {t('stele.groups')} · {groups.reduce((a,g) => a + g.members, 0)} {t('stele.members')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(g => (
          <div key={g.id} className="glass-card rounded-2xl overflow-hidden group">
            <div className={`h-24 bg-gradient-to-r ${g.color} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-bold text-lg">{g.name}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-obelisk-textMuted mb-3">{g.desc}</p>
              <div className="flex items-center gap-4 text-xs text-obelisk-textMuted mb-3">
                <span>{g.members} {t('stele.members')}</span>
                <span>{g.posts} {t('stele.title')}</span>
                <span>{t('stele.groupActivity')}: {g.activity}%</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {g.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/stele/groups/${g.id}`} className="flex-1 text-center py-2 rounded-lg bg-obelisk-surfaceDark text-sm font-medium hover:bg-black/10 transition-colors">
                  {t('common.more')}
                </Link>
                {user && (
                  <button
                    onClick={() => toggleJoin(g.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      joined.includes(g.id)
                        ? 'bg-obelisk-line text-white hover:bg-black'
                        : 'bg-obelisk-surfaceDark text-obelisk-text hover:bg-black/10'
                    }`}
                  >
                    {joined.includes(g.id) ? t('stele.leaveGroup') : t('stele.joinGroup')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
