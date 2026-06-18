import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { Palette, BookOpen, Image, Plus, Search, ExternalLink, X, Trash2 } from 'lucide-react'

const DESIGN_TABS = [
  { id: 'resources', name: '资源库', icon: Palette },
  { id: 'articles', name: '文章', icon: BookOpen },
  { id: 'works', name: '作品', icon: Image },
]

const DEFAULT_RESOURCES = [
  { title: 'Google Fonts', url: 'https://fonts.google.com', type: 'resources', desc: '免费开源字体库，1000+ 字体', tags: ['字体'] },
  { title: 'Font Squirrel', url: 'https://fontsquirrel.com', type: 'resources', desc: '免费商用字体', tags: ['字体', '商用'] },
  { title: 'Unsplash', url: 'https://unsplash.com', type: 'resources', desc: '高质量免费图片', tags: ['图片'] },
  { title: 'Pexels', url: 'https://pexels.com', type: 'resources', desc: '免费素材图片视频', tags: ['图片', '视频'] },
  { title: 'Dribbble', url: 'https://dribbble.com', type: 'resources', desc: '设计师作品展示', tags: ['灵感'] },
  { title: 'Behance', url: 'https://behance.net', type: 'resources', desc: '创意作品展示平台', tags: ['作品集'] },
  { title: 'Awwwards', url: 'https://awwwards.com', type: 'resources', desc: '网站设计奖项', tags: ['网站', '灵感'] },
  { title: 'Coolors', url: 'https://coolors.co', type: 'resources', desc: '配色方案生成器', tags: ['配色'] },
  { title: 'Color Hunt', url: 'https://colorhunt.co', type: 'resources', desc: '精选配色方案', tags: ['配色'] },
  { title: 'Material Design', url: 'https://m3.material.io', type: 'resources', desc: 'Google 设计系统', tags: ['设计系统'] },
  { title: 'Apple Design', url: 'https://developer.apple.com/design', type: 'resources', desc: 'Apple 人机界面指南', tags: ['设计系统'] },
  { title: 'Ant Design', url: 'https://ant.design', type: 'resources', desc: '蚂蚁设计系统', tags: ['设计系统', 'React'] },
  { title: 'Humaaans', url: 'https://humaaans.com', type: 'resources', desc: '人物插画库', tags: ['插画'] },
  { title: 'Undraw', url: 'https://undraw.co', type: 'resources', desc: '开源插画', tags: ['插画', '开源'] },
  { title: 'Blush', url: 'https://blush.design', type: 'resources', desc: '可定制插画', tags: ['插画'] },
  { title: 'Figma Community', url: 'https://figma.com/community', type: 'resources', desc: 'Figma 插件与模板', tags: ['Figma', '插件'] },
  { title: 'UI8', url: 'https://ui8.net', type: 'resources', desc: 'UI 套件市场', tags: ['UI', '套件'] },
  { title: 'Sketch Repo', url: 'https://sketchrepo.com', type: 'resources', desc: 'Sketch 免费资源', tags: ['Sketch', '免费'] },
]

const DEFAULT_ARTICLES = [
  { title: '极简设计原则', content: '少即是多。通过去除多余的元素，让核心内容更加突出。留白、对齐、对比是极简设计的三大支柱。好的设计不是添加更多，而是移除直到不能再移除。', type: 'articles', author: 'OBELISK', tags: ['设计理论'] },
  { title: '网格系统的力量', content: '网格不仅仅是辅助线，它是信息架构的基础。好的网格系统能让页面既有秩序又富有变化。从古典印刷到数字界面，网格始终是设计的骨架。', type: 'articles', author: 'OBELISK', tags: ['排版'] },
  { title: '色彩心理学入门', content: '颜色不仅仅是视觉元素，它们承载着情感和意义。红色代表激情与紧迫，蓝色传达信任与专业，绿色象征自然与成长。了解色彩心理学能帮助你做出更有影响力的设计决策。', type: 'articles', author: 'OBELISK', tags: ['色彩'] },
  { title: '字体排印的艺术', content: '字体是设计的灵魂。衬线体传达传统与优雅，无衬线体表现现代与简洁。字重、字距、行高的微妙调整，能让同样的文字产生完全不同的阅读体验。', type: 'articles', author: 'OBELISK', tags: ['字体'] },
  { title: '响应式设计思维', content: '设计不是为设备而设计，而是为内容而设计。流体布局、弹性图片、媒体查询——响应式的核心是让内容在任何屏幕上都能优雅呈现。', type: 'articles', author: 'OBELISK', tags: ['响应式'] },
  { title: '微交互的价值', content: '按钮的悬停效果、加载动画、操作反馈——这些微小的交互细节构成了产品的温度。好的微交互让用户感到被理解，让界面充满生命力。', type: 'articles', author: 'OBELISK', tags: ['交互'] },
  { title: '设计系统的构建', content: '从原子设计到组件库，设计系统是将设计决策系统化的过程。它不仅是 UI 组件的集合，更是团队共享的设计语言。', type: 'articles', author: 'OBELISK', tags: ['系统'] },
  { title: '无障碍设计指南', content: '设计应该服务于所有人。足够的对比度、清晰的焦点状态、语义化标签——无障碍不是附加功能，而是设计的基本责任。', type: 'articles', author: 'OBELISK', tags: ['无障碍'] },
]

const DEFAULT_WORKS = [
  { title: '结构主义海报', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '黑白线条与几何构成', tags: ['海报'] },
  { title: '极简界面', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '白灰渐变与玻璃质感', tags: ['UI'] },
  { title: '字体排印实验', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '衬线体与无衬线体的对话', tags: ['排版'] },
  { title: '品牌视觉系统', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '统一的品牌识别设计', tags: ['品牌'] },
  { title: '暗色模式探索', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '低光环境下的界面设计', tags: ['暗色'] },
  { title: '数据可视化', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', type: 'works', author: 'OBELISK', desc: '信息图表与数据美学', tags: ['数据'] },
]

export default function Design() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('resources')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const [formTitle, setFormTitle] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formTags, setFormTags] = useState('')
  const [formDesc, setFormDesc] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'design_items'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const dbItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        const defaults = [...DEFAULT_RESOURCES, ...DEFAULT_ARTICLES, ...DEFAULT_WORKS].map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true }))
        setItems([...defaults, ...dbItems])
        setLoading(false)
      } catch (e) {
        console.error(e)
        const defaults = [...DEFAULT_RESOURCES, ...DEFAULT_ARTICLES, ...DEFAULT_WORKS].map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true }))
        setItems(defaults)
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const handleAdd = async () => {
    if (!formTitle.trim()) return
    try {
      const data = { title: formTitle, type: activeTab, authorId: user?.uid || '', authorName: user?.displayName || '匿名', tags: formTags.split(/[,\s]+/).filter(Boolean), createdAt: serverTimestamp() }
      if (activeTab === 'resources') { data.url = formUrl; data.desc = formDesc }
      else if (activeTab === 'articles') { data.content = formContent }
      else if (activeTab === 'works') { data.image = formImage; data.desc = formDesc }
      await addDoc(collection(db, 'design_items'), data)
      setFormTitle(''); setFormUrl(''); setFormContent(''); setFormImage(''); setFormTags(''); setFormDesc(''); setShowAddModal(false)
      const q = query(collection(db, 'design_items'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const dbItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const defaults = [...DEFAULT_RESOURCES, ...DEFAULT_ARTICLES, ...DEFAULT_WORKS].map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true }))
      setItems([...defaults, ...dbItems])
    } catch (e) { alert('添加失败: ' + e.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try { await deleteDoc(doc(db, 'design_items', id)); setItems(prev => prev.filter(i => i.id !== id)) } catch (e) { alert('删除失败') }
  }

  const filtered = items.filter(item => {
    const matchesTab = item.type === activeTab
    const matchesSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) || item.content?.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('nav.design')}</h1>
            <p className="section-subtitle">资源库 · 文章 · 作品展示</p>
          </div>
          {user && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t('common.add')}</button>
          )}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {DESIGN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-obelisk-line text-white shadow-lg' : 'bg-white text-obelisk-textMuted hover:bg-obelisk-surfaceDark border border-obelisk-border'}`}>
              <tab.icon className="w-4 h-4" />{tab.name}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('design.search')} className="input-field pl-10" />
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Palette className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted">{t('common.empty')}</p>
            </div>
          </GlassCard>
        ) : (
          <div className={activeTab === 'works' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {filtered.map((item, i) => (
              <GlassCard key={item.id} delay={i * 0.03}>
                {activeTab === 'works' && item.image && (
                  <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-obelisk-surfaceDark">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.isDefault && <span className="tag text-xs bg-obelisk-line text-white">精选</span>}
                    {item.tags?.map(t => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                  {(user?.uid === item.authorId || user?.uid === 'nCZLU2r9YfXVTrQ79EJqWJxPPT03') && !item.isDefault && (
                    <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  )}
                </div>
                {activeTab === 'resources' && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="font-bold text-obelisk-line group-hover:underline flex items-center gap-2">{item.title}<ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                  </a>
                )}
                {activeTab !== 'resources' && <h3 className="font-bold text-obelisk-line">{item.title}</h3>}
                {item.desc && <p className="text-sm text-obelisk-textMuted mt-2">{item.desc}</p>}
                {item.content && <p className="text-sm text-obelisk-text mt-2 line-clamp-4">{item.content}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-obelisk-border">
                  <span className="text-xs text-obelisk-textLight">{item.authorName || item.author || 'OBELISK'}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">添加{DESIGN_TABS.find(t => t.id === activeTab)?.name}</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="标题" className="input-field" />
              {activeTab === 'resources' && <input type="url" value={formUrl} onChange={e => setFormUrl(e.target.value)} placeholder="URL" className="input-field" />}
              {activeTab === 'works' && <input type="url" value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="图片 URL" className="input-field" />}
              {activeTab === 'articles' && <textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="文章内容" rows={5} className="input-field resize-none" />}
              {(activeTab === 'resources' || activeTab === 'works') && <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="描述" rows={3} className="input-field resize-none" />}
              <input type="text" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="标签，逗号分隔" className="input-field" />
              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={handleAdd} disabled={!formTitle.trim()} className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
