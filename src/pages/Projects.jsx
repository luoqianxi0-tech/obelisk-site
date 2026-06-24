import { useState } from 'react'
import { useI18n } from '../i18n.jsx'

export default function Projects() {
  const { t } = useI18n()
  const [filter, setFilter] = useState('all')

  const projects = [
    { id: '1', name: 'OBELISK Platform', desc: '极客资源整合与社交平台，支持 Agent 联动、靶场记录、漏洞复现笔记。', tech: ['React', 'Firebase', 'Python', 'WebSocket'], status: 'inProgress', demo: '#', source: 'https://github.com' },
    { id: '2', name: 'Frida-iOS-Dump', desc: '基于 Frida 的 iOS 应用脱壳工具，支持加密二进制自动解密与重打包。', tech: ['Python', 'Frida', 'Objective-C'], status: 'completed', demo: '#', source: 'https://github.com' },
    { id: '3', name: 'APK-Analyzer-Pro', desc: 'Android APK 自动化分析平台，提取权限、组件、字符串、风险评分。', tech: ['Node.js', 'Androguard', 'React'], status: 'completed', demo: '#', source: 'https://github.com' },
    { id: '4', name: 'SmartContract-Auditor', desc: 'Solidity 智能合约静态分析与自动化审计工具集。', tech: ['Python', 'Slither', 'Mythril'], status: 'inProgress', demo: '#', source: 'https://github.com' },
    { id: '5', name: 'C2-Framework-POC', desc: '红队 C2 通信框架概念验证，支持 DNS/HTTPS/ICMP 隐蔽通道。', tech: ['Go', 'Python', 'Cryptography'], status: 'planned', demo: '#', source: 'https://github.com' },
    { id: '6', name: 'Memory-Forensics-Kit', desc: 'Volatility3 插件集合，自动化内存取证分析与威胁狩猎。', tech: ['Python', 'Volatility3', 'YARA'], status: 'completed', demo: '#', source: 'https://github.com' },
  ]

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  const statusColors = {
    completed: 'bg-emerald-50 text-emerald-700', inProgress: 'bg-blue-50 text-blue-700', planned: 'bg-gray-50 text-gray-700'
  }

  const statusLabels = {
    completed: t('projects.completed'), inProgress: t('projects.inProgress'), planned: t('projects.planned')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('projects.title')}</h1>
        <p className="text-sm text-obelisk-textMuted mt-1">{t('projects.subtitle')}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'completed', 'inProgress', 'planned'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-obelisk-line text-white' : 'bg-white border border-obelisk-border text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            {s === 'all' ? t('aggregate.all') : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="glass-card rounded-2xl p-6 hover:bg-white/80 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg text-obelisk-line">{p.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
            </div>
            <p className="text-sm text-obelisk-textMuted mb-4">{p.desc}</p>
            <div className="mb-4">
              <div className="text-xs font-medium text-obelisk-textMuted mb-2">{t('projects.techStack')}</div>
              <div className="flex flex-wrap gap-2">
                {p.tech.map(tech => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-obelisk-surfaceDark text-obelisk-text">{tech}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <a href={p.demo} className="flex-1 text-center py-2 rounded-lg bg-obelisk-line text-white text-sm font-medium hover:bg-black transition-colors">{t('projects.demo')}</a>
              <a href={p.source} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 rounded-lg border border-obelisk-border text-sm font-medium hover:bg-black/5 transition-colors">{t('projects.source')}</a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-obelisk-textMuted">{t('projects.noProjects')}</div>
      )}
    </div>
  )
}
