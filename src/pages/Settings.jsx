import { useI18n } from '../i18n.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Settings() {
  const { t, lang, setLang } = useI18n()
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('settings.title')}</h1>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-4">
        <h2 className="font-bold text-obelisk-line mb-4">{t('settings.language')}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setLang('zh')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              lang === 'zh' ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            中文
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              lang === 'en' ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-4">
        <h2 className="font-bold text-obelisk-line mb-4">{t('settings.privacy')}</h2>
        <div className="space-y-3">
          {['public', 'followersOnly', 'private'].map(p => (
            <label key={p} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 cursor-pointer">
              <input type="radio" name="privacy" defaultChecked={p === 'public'} className="w-4 h-4" />
              <span className="text-sm">{t(`settings.${p}`)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-obelisk-line mb-4">{t('settings.notifications')}</h2>
        <div className="space-y-3">
          {['Email notifications', 'Push notifications', 'Weekly digest'].map(n => (
            <label key={n} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm">{n}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
