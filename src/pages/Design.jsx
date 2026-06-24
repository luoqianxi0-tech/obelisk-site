import { useState } from 'react'
import { useI18n } from '../i18n.jsx'

export default function Design() {
  const { t } = useI18n()
  const [tab, setTab] = useState('resources')

  const resources = [
    { name: 'Figma', url: 'https://figma.com', desc: '协作界面设计' },
    { name: 'Dribbble', url: 'https://dribbble.com', desc: '设计灵感社区' },
    { name: 'Unsplash', url: 'https://unsplash.com', desc: '免费高质量图库' },
    { name: 'Font Awesome', url: 'https://fontawesome.com', desc: '矢量图标库' },
    { name: 'Google Fonts', url: 'https://fonts.google.com', desc: '开源字体库' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com', desc: '原子化 CSS 框架' },
    { name: 'Shadcn UI', url: 'https://ui.shadcn.com', desc: '可复用组件库' },
    { name: 'Framer Motion', url: 'https://framer.com/motion', desc: 'React 动画库' },
  ]

  const articles = [
    { title: 'Design Systems 101', author: 'OBELISK Team', date: '2024-06-01' },
    { title: 'Glassmorphism 设计指南', author: '0xDesigner', date: '2024-05-20' },
    { title: '暗色模式配色实践', author: 'NightOwl', date: '2024-05-15' },
  ]

  const works = [
    { title: 'OBELISK v9 UI Kit', author: 'OBELISK Team', likes: 342 },
    { title: 'Cyberpunk Dashboard', author: 'NeonDev', likes: 189 },
    { title: 'Minimal Terminal Theme', author: 'TmuxLover', likes: 156 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('design.title')}</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'resources', label: t('design.resources') },
          { key: 'articles', label: t('design.articles') },
          { key: 'works', label: t('design.works') },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === item.key ? 'bg-obelisk-line text-white' : 'bg-white border border-obelisk-border text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" className="glass-card rounded-2xl p-5 hover:bg-white/80 transition-colors block">
              <div className="font-semibold text-obelisk-line mb-1">{r.name}</div>
              <div className="text-xs text-obelisk-textMuted">{r.desc}</div>
            </a>
          ))}
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-4">
          {articles.map((a, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-obelisk-line">{a.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-obelisk-textMuted">
                <span>{a.author}</span>
                <span>{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'works' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {works.map((w, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="h-32 rounded-xl bg-gradient-to-br from-obelisk-line to-gray-600 mb-3 flex items-center justify-center text-white font-bold">
                {w.title[0]}
              </div>
              <h3 className="font-semibold text-obelisk-line">{w.title}</h3>
              <div className="flex items-center justify-between mt-2 text-xs text-obelisk-textMuted">
                <span>{w.author}</span>
                <span>{w.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
