import { useTranslation } from 'react-i18next';
import { GlassCard } from '../components/GlassCard';
import { Globe, Bell, Shield, Moon, Monitor, User } from 'lucide-react';

export const Settings = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light tracking-wide mb-8">{t('nav.settings')}</h1>

      <div className="space-y-4">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-black/30" />
            <h3 className="font-medium">{t('settings.language')}</h3>
          </div>
          <div className="flex gap-3">
            <button onClick={() => i18n.changeLanguage('zh')}
              className={`px-6 py-2.5 text-sm border transition-colors ${i18n.language === 'zh' ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
              中文
            </button>
            <button onClick={() => i18n.changeLanguage('en')}
              className={`px-6 py-2.5 text-sm border transition-colors ${i18n.language === 'en' ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
              English
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-black/30" />
            <h3 className="font-medium">{t('settings.notifications')}</h3>
          </div>
          <p className="text-sm text-black/40">{t('settings.notificationsDesc')}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-black/30" />
            <h3 className="font-medium">{t('settings.privacy')}</h3>
          </div>
          <p className="text-sm text-black/40">{t('settings.privacyDesc')}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-5 h-5 text-black/30" />
            <h3 className="font-medium">Display</h3>
          </div>
          <p className="text-sm text-black/40">Display settings coming soon.</p>
        </GlassCard>
      </div>
    </div>
  );
};
