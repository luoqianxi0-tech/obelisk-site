import { Link } from 'react-router-dom'
import { t } from '../i18n.js'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-obelisk-border bg-obelisk-surface/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-obelisk-line rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="font-bold text-lg">{t('siteName')}</span>
            </div>
            <p className="text-sm text-obelisk-textMuted leading-relaxed max-w-sm">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">{t('nav.stele')}</h4>
            <div className="space-y-2 text-sm text-obelisk-textMuted">
              <p>话题讨论</p>
              <p>圈子社群</p>
              <p>资源分享</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">{t('nav.aggregate')}</h4>
            <div className="space-y-2 text-sm text-obelisk-textMuted">
              <p>工具索引</p>
              <p>设计资源</p>
              <p>技术文档</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-obelisk-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-obelisk-textLight">
            © 2026 OBELISK. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-obelisk-textLight">
            <Link to="/settings" className="hover:text-obelisk-line transition-colors">{t('nav.settings')}</Link>
            <span>·</span>
            <span>v8.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
