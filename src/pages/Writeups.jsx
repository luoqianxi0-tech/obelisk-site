import { useState } from 'react'
import { useI18n } from '../i18n.jsx'

export default function Writeups() {
  const { t } = useI18n()
  const [filter, setFilter] = useState('all')

  const writeups = [
    { id: '1', title: 'CVE-2024-21626 runc 容器逃逸复现', cve: 'CVE-2024-21626', severity: 'high', cvss: 7.8, tags: ['Container', 'Escape', 'runc'], status: 'completed' },
    { id: '2', title: 'CVE-2023-38408 OpenSSH 代理转发漏洞分析', cve: 'CVE-2023-38408', severity: 'critical', cvss: 9.8, tags: ['OpenSSH', 'RCE'], status: 'completed' },
    { id: '3', title: 'CVE-2024-24557 Docker BuildKit 权限提升', cve: 'CVE-2024-24557', severity: 'medium', cvss: 6.5, tags: ['Docker', 'BuildKit'], status: 'completed' },
    { id: '4', title: 'CVE-2023-44487 HTTP/2 Rapid Reset DDoS', cve: 'CVE-2023-44487', severity: 'high', cvss: 7.5, tags: ['HTTP/2', 'DDoS'], status: 'completed' },
    { id: '5', title: 'CVE-2024-21733 Apache Tomcat 拒绝服务', cve: 'CVE-2024-21733', severity: 'medium', cvss: 5.3, tags: ['Tomcat', 'DoS'], status: 'inProgress' },
    { id: '6', title: 'CVE-2023-4911 glibc ld.so 本地提权', cve: 'CVE-2023-4911', severity: 'high', cvss: 7.8, tags: ['glibc', 'LPE'], status: 'completed' },
    { id: '7', title: 'CVE-2024-21413 Microsoft Outlook RCE', cve: 'CVE-2024-21413', severity: 'critical', cvss: 9.8, tags: ['Outlook', 'RCE'], status: 'completed' },
    { id: '8', title: 'CVE-2023-3676 Kubernetes RCE 分析', cve: 'CVE-2023-3676', severity: 'high', cvss: 8.8, tags: ['K8s', 'RCE'], status: 'inProgress' },
  ]

  const filtered = filter === 'all' ? writeups : writeups.filter(w => w.severity === filter)

  const severityColors = {
    critical: 'bg-red-50 text-red-700 border-red-200', high: 'bg-orange-50 text-orange-700 border-orange-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200', low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const severityLabels = {
    critical: t('writeups.critical'), high: t('writeups.high'), medium: t('writeups.medium'), low: t('writeups.low')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('writeups.title')}</h1>
        <p className="text-sm text-obelisk-textMuted mt-1">{t('writeups.subtitle')}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-obelisk-line text-white' : 'bg-white border border-obelisk-border text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            {s === 'all' ? t('aggregate.all') : severityLabels[s]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(w => (
          <div key={w.id} className="glass-card rounded-2xl p-6 hover:bg-white/80 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${severityColors[w.severity]}`}>
                  {severityLabels[w.severity]}
                </span>
                <span className="text-xs text-obelisk-textMuted">CVSS: {w.cvss}</span>
              </div>
              <span className="text-xs text-obelisk-textMuted font-mono">{w.cve}</span>
            </div>
            <h3 className="font-bold text-lg text-obelisk-line mb-2">{w.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {w.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-obelisk-textMuted">
              <span>{t('writeups.reproduction')}: {w.status === 'completed' ? '✅' : '🔄'}</span>
              <span>{t('writeups.poc')}: {w.status === 'completed' ? '✅' : '⏳'}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-obelisk-textMuted">{t('writeups.noWriteups')}</div>
      )}
    </div>
  )
}
