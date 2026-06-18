import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { Globe, Bell, Lock, Trash2, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const { user, logout } = useAuth()
  const { t, toggleLang, lang } = useI18n()
  const [notifications, setNotifications] = useState(true)
  const [privacy, setPrivacy] = useState('public')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="section-title mb-8">{t('nav.settings')}</h1>
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-obelisk-textMuted" /><div><p className="font-medium text-sm">{t('settings.language')}</p><p className="text-xs text-obelisk-textMuted">Switch language</p></div></div>
              <button onClick={toggleLang} className="btn-secondary text-sm py-2 px-4">{lang === 'zh' ? '中文' : 'English'}</button>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Bell className="w-5 h-5 text-obelisk-textMuted" /><div><p className="font-medium text-sm">{t('settings.notifications')}</p><p className="text-xs text-obelisk-textMuted">Receive notifications</p></div></div>
              <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-obelisk-line' : 'bg-obelisk-border'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'left-7' : 'left-1'}`} /></button>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-4"><Lock className="w-5 h-5 text-obelisk-textMuted" /><div><p className="font-medium text-sm">{t('settings.privacy')}</p><p className="text-xs text-obelisk-textMuted">Control profile visibility</p></div></div>
            <div className="flex gap-2">
              {['public', 'followers', 'private'].map(opt => (
                <button key={opt} onClick={() => setPrivacy(opt)} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${privacy === opt ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted'}`}>
                  {opt === 'public' ? t('settings.public') : opt === 'followers' ? t('settings.followersOnly') : t('settings.private')}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-5 h-5 text-red-400" /><div><p className="font-medium text-sm">Account</p><p className="text-xs text-obelisk-textMuted">Manage account data</p></div></div>
            <div className="space-y-2">
              <button onClick={() => logout()} className="w-full btn-secondary text-sm py-2">{t('auth.logout')}</button>
              <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 px-4 rounded-lg text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors">{t('common.delete')}</button>
            </div>
          </GlassCard>
        </div>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
            <div className="glass-panel rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-4"><AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2" /><h3 className="font-bold">{t('common.confirm')}?</h3><p className="text-sm text-obelisk-textMuted mt-2">This action cannot be undone.</p></div>
              <div className="flex gap-3"><button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">{t('common.cancel')}</button><button onClick={() => { logout(); setShowDeleteConfirm(false); }} className="flex-1 py-2 px-4 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">{t('common.confirm')}</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
