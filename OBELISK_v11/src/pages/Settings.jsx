import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Globe, Bell, Lock, Monitor, Download } from 'lucide-react';

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.settings')}</h1>
        <p className="text-black/40">Configure your OBELISK experience</p>
      </motion.div>

      <div className="space-y-4">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-black/30" />
            <h3 className="text-sm font-medium">{t('settings.language')}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => i18n.changeLanguage('zh')} className={`px-4 py-2 text-sm border transition-colors ${i18n.language==='zh'?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>中文</button>
            <button onClick={() => i18n.changeLanguage('en')} className={`px-4 py-2 text-sm border transition-colors ${i18n.language==='en'?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>English</button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-black/30" />
            <h3 className="text-sm font-medium">{t('settings.notifications')}</h3>
          </div>
          <p className="text-xs text-black/40">{t('settings.notificationsDesc')}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-black/30" />
            <h3 className="text-sm font-medium">{t('settings.privacy')}</h3>
          </div>
          <p className="text-xs text-black/40">{t('settings.privacyDesc')}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-5 h-5 text-black/30" />
            <h3 className="text-sm font-medium">{t('settings.pwa')}</h3>
          </div>
          {installed ? (
            <div className="flex items-center gap-2 text-sm text-black/40"><Download className="w-4 h-4" />{t('settings.installed')}</div>
          ) : deferredPrompt ? (
            <button onClick={installPWA} className="btn-primary text-sm flex items-center gap-2"><Download className="w-4 h-4" />{t('settings.install')}</button>
          ) : (
            <p className="text-xs text-black/40">Install this app to your device for offline access. Use browser menu "Add to Home Screen" if button is unavailable.</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
};