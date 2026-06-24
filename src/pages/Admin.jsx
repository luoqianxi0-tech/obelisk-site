import { useI18n } from '../i18n.jsx'

export default function Admin() {
  const { t } = useI18n()

  const stats = [
    { label: t('home.totalUsers'), value: '2,847' },
    { label: t('home.totalPosts'), value: '1,932' },
    { label: t('home.totalResources'), value: '342' },
    { label: t('home.totalProjects'), value: '86' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('admin.title')}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-obelisk-line">{s.value}</div>
            <div className="text-xs text-obelisk-textMuted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-obelisk-line mb-4">{t('admin.users')}</h2>
          <div className="space-y-3">
            {['0xACE', 'ReverserX', 'Web3Hunter', 'ForensicsGuru'].map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-obelisk-line to-gray-600 flex items-center justify-center text-white font-bold text-xs">{u[0]}</div>
                <div className="flex-1 text-sm font-medium">{u}</div>
                <span className="text-xs text-obelisk-textMuted">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-obelisk-line mb-4">{t('admin.resources')}</h2>
          <div className="space-y-3">
            {['Ghidra', 'Burp Suite', 'Frida', 'Metasploit'].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                <span className="text-sm font-medium">{r}</span>
                <span className="text-xs text-obelisk-textMuted">{100 + i * 50} bookmarks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
