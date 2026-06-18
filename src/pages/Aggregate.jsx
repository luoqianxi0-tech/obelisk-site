import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { 
  collection, addDoc, getDocs, query, orderBy, where, 
  serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore'
import { 
  Search, Plus, Globe, ExternalLink, Bookmark, BookmarkCheck, 
  Grid, List, X, Upload, FileJson, Trash2, Star
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all', name: '全部', icon: Grid },
  { id: 'dev', name: '开发工具', icon: Star },
  { id: 'design', name: '设计资源', icon: Star },
  { id: 'docs', name: '技术文档', icon: Star },
  { id: 'media', name: '媒体素材', icon: Star },
  { id: 'ai', name: 'AI 工具', icon: Star },
  { id: 'infra', name: '基础设施', icon: Star },
  { id: 'learn', name: '学习资源', icon: Star },
]

const DEFAULT_RESOURCES = [
  { title: 'GitHub', url: 'https://github.com', category: 'dev', desc: '全球最大的代码托管平台', tags: ['git', '开源'] },
  { title: 'GitLab', url: 'https://gitlab.com', category: 'dev', desc: 'DevOps 一体化平台', tags: ['git', 'CI/CD'] },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'dev', desc: '开发者问答社区', tags: ['问答', '社区'] },
  { title: 'Vercel', url: 'https://vercel.com', category: 'dev', desc: '前端部署平台', tags: ['部署', 'Serverless'] },
  { title: 'Netlify', url: 'https://netlify.com', category: 'dev', desc: '静态网站托管', tags: ['部署', 'JAMstack'] },
  { title: 'CodePen', url: 'https://codepen.io', category: 'dev', desc: '前端代码演示', tags: ['演示', 'CSS'] },
  { title: 'JSFiddle', url: 'https://jsfiddle.net', category: 'dev', desc: '在线代码编辑器', tags: ['编辑器', '测试'] },
  { title: 'Figma', url: 'https://figma.com', category: 'design', desc: '协作界面设计工具', tags: ['UI', '设计'] },
  { title: 'Sketch', url: 'https://sketch.com', category: 'design', desc: 'Mac 矢量设计工具', tags: ['UI', '矢量'] },
  { title: 'Adobe XD', url: 'https://adobe.com/products/xd.html', category: 'design', desc: 'Adobe 原型设计工具', tags: ['原型', 'Adobe'] },
  { title: 'Canva', url: 'https://canva.com', category: 'design', desc: '在线平面设计工具', tags: ['平面', '模板'] },
  { title: 'Dribbble', url: 'https://dribbble.com', category: 'design', desc: '设计师作品展示', tags: ['灵感', '社区'] },
  { title: 'Behance', url: 'https://behance.net', category: 'design', desc: '创意作品展示平台', tags: ['作品集', 'Adobe'] },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'docs', desc: 'Web 技术权威文档', tags: ['文档', '参考'] },
  { title: 'DevDocs', url: 'https://devdocs.io', category: 'docs', desc: '聚合 API 文档', tags: ['API', '速查'] },
  { title: 'W3Schools', url: 'https://w3schools.com', category: 'docs', desc: 'Web 开发教程', tags: ['教程', '入门'] },
  { title: 'CSS-Tricks', url: 'https://css-tricks.com', category: 'docs', desc: 'CSS 技巧与教程', tags: ['CSS', '技巧'] },
  { title: 'Smashing Magazine', url: 'https://smashingmagazine.com', category: 'docs', desc: '前端与设计杂志', tags: ['杂志', '前端'] },
  { title: 'Unsplash', url: 'https://unsplash.com', category: 'media', desc: '高质量免费图片', tags: ['图片', '免费'] },
  { title: 'Pexels', url: 'https://pexels.com', category: 'media', desc: '免费素材图片视频', tags: ['图片', '视频'] },
  { title: 'Pixabay', url: 'https://pixabay.com', category: 'media', desc: '免版税素材库', tags: ['图片', '矢量'] },
  { title: 'Flaticon', url: 'https://flaticon.com', category: 'media', desc: '免费矢量图标', tags: ['图标', '矢量'] },
  { title: 'Iconfont', url: 'https://iconfont.cn', category: 'media', desc: '阿里巴巴矢量图标库', tags: ['图标', '中文'] },
  { title: 'ChatGPT', url: 'https://chat.openai.com', category: 'ai', desc: 'OpenAI 对话模型', tags: ['AI', '对话'] },
  { title: 'Claude', url: 'https://claude.ai', category: 'ai', desc: 'Anthropic AI 助手', tags: ['AI', '助手'] },
  { title: 'Midjourney', url: 'https://midjourney.com', category: 'ai', desc: 'AI 图像生成', tags: ['AI', '图像'] },
  { title: 'Stable Diffusion', url: 'https://stability.ai', category: 'ai', desc: '开源 AI 绘画模型', tags: ['AI', '开源'] },
  { title: 'Hugging Face', url: 'https://huggingface.co', category: 'ai', desc: 'AI 模型与数据集社区', tags: ['AI', 'ML'] },
  { title: 'Docker Hub', url: 'https://hub.docker.com', category: 'infra', desc: '容器镜像仓库', tags: ['Docker', '容器'] },
  { title: 'Kubernetes', url: 'https://kubernetes.io', category: 'infra', desc: '容器编排平台', tags: ['K8s', '编排'] },
  { title: 'Terraform', url: 'https://terraform.io', category: 'infra', desc: '基础设施即代码', tags: ['IaC', '云'] },
  { title: 'AWS', url: 'https://aws.amazon.com', category: 'infra', desc: '亚马逊云服务', tags: ['云', 'AWS'] },
  { title: 'Cloudflare', url: 'https://cloudflare.com', category: 'infra', desc: 'CDN 与边缘计算', tags: ['CDN', 'DNS'] },
  { title: 'freeCodeCamp', url: 'https://freecodecamp.org', category: 'learn', desc: '免费编程学习平台', tags: ['学习', '免费'] },
  { title: 'Coursera', url: 'https://coursera.org', category: 'learn', desc: '在线课程平台', tags: ['课程', '大学'] },
  { title: 'LeetCode', url: 'https://leetcode.com', category: 'learn', desc: '算法刷题平台', tags: ['算法', '面试'] },
  { title: 'HackerRank', url: 'https://hackerrank.com', category: 'learn', desc: '编程挑战平台', tags: ['挑战', '技能'] },
  { title: 'Exercism', url: 'https://exercism.org', category: 'learn', desc: '免费编程练习', tags: ['练习', '导师'] },
]

export default function Aggregate() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('dev')
  const [newDesc, setNewDesc] = useState('')
  const [newTags, setNewTags] = useState('')
  const [importText, setImportText] = useState('')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        let q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
        if (activeCategory !== 'all') q = query(q, where('category', '==', activeCategory))
        const snap = await getDocs(q)
        const dbItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        // 合并默认数据
        const defaults = DEFAULT_RESOURCES.map((r, i) => ({ ...r, id: `default-${i}`, isDefault: true }))
        const merged = activeCategory === 'all' ? [...defaults, ...dbItems] : dbItems
        setResources(merged)
        setLoading(false)
      } catch (e) {
        console.error(e)
        setResources(DEFAULT_RESOURCES.map((r, i) => ({ ...r, id: `default-${i}`, isDefault: true })))
        setLoading(false)
      }
    }
    fetchResources()
  }, [activeCategory])

  const handleAddResource = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return
    try {
      await addDoc(collection(db, 'resources'), {
        title: newTitle, url: newUrl, category: newCategory, description: newDesc,
        tags: newTags.split(/[,\s]+/).filter(Boolean),
        authorId: user?.uid || '', authorName: user?.displayName || '匿名',
        likes: [], collects: [], createdAt: serverTimestamp()
      })
      setNewTitle(''); setNewUrl(''); setNewDesc(''); setNewTags(''); setShowAddModal(false)
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setResources([...DEFAULT_RESOURCES.map((r, i) => ({ ...r, id: `default-${i}`, isDefault: true })), ...snap.docs.map(d => ({ id: d.id, ...d.data() }))])
    } catch (e) { alert('添加失败: ' + e.message) }
  }

  const handleImport = async () => {
    try {
      const lines = importText.trim().split('\n')
      const items = []
      for (const line of lines) {
        const parts = line.split(',').map(s => s.trim())
        if (parts.length >= 2) {
          items.push({ title: parts[0], url: parts[1], category: parts[2] || 'dev', description: parts[3] || '', tags: parts[4] ? parts[4].split(/[,\s]+/) : [], authorId: user?.uid || '', authorName: user?.displayName || '匿名', likes: [], collects: [], createdAt: serverTimestamp() })
        }
      }
      for (const item of items) await addDoc(collection(db, 'resources'), item)
      setImportText(''); setShowImportModal(false); alert(`成功导入 ${items.length} 条资源`)
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setResources([...DEFAULT_RESOURCES.map((r, i) => ({ ...r, id: `default-${i}`, isDefault: true })), ...snap.docs.map(d => ({ id: d.id, ...d.data() }))])
    } catch (e) { alert('导入失败: ' + e.message) }
  }

  const handleCollect = async (id, isCollected) => {
    if (!user) { alert('请先登录'); return }
    try {
      const ref = doc(db, 'resources', id)
      await updateDoc(ref, { collects: isCollected ? arrayRemove(user.uid) : arrayUnion(user.uid) })
      setResources(prev => prev.map(r => r.id === id ? { ...r, collects: isCollected ? (r.collects || []).filter(u => u !== user.uid) : [...(r.collects || []), user.uid] } : r))
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try { await deleteDoc(doc(db, 'resources', id)); setResources(prev => prev.filter(r => r.id !== id)) } catch (e) { alert('删除失败') }
  }

  const filtered = resources.filter(r => {
    const q = searchQuery.toLowerCase()
    return !q || (r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q)))
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('nav.aggregate')}</h1>
            <p className="section-subtitle">精选资源索引与导航</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="btn-secondary text-sm py-2 px-3">
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            {user && (
              <>
                <button onClick={() => setShowImportModal(true)} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"><Upload className="w-4 h-4" /> 导入</button>
                <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1"><Plus className="w-4 h-4" /> 添加</button>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('aggregate.search')} className="input-field pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Globe className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted">{t('common.empty')}</p>
            </div>
          </GlassCard>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filtered.map((res, i) => (
              <GlassCard key={res.id} delay={i * 0.03} className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="tag text-xs">{res.category}</span>
                      {res.isDefault && <span className="tag text-xs bg-obelisk-line text-white">推荐</span>}
                      {res.tags?.map(t => <span key={t} className="tag text-xs">{t}</span>)}
                    </div>
                  </div>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className="font-bold text-obelisk-line group-hover:underline flex items-center gap-2">{res.title}<ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                  </a>
                  <p className="text-sm text-obelisk-textMuted mt-1 line-clamp-2">{res.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-obelisk-border">
                    <div className="flex items-center gap-3 text-xs text-obelisk-textLight">
                      <span>{res.authorName || 'OBELISK'}</span>
                      <span>{res.collects?.length || 0} 收藏</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleCollect(res.id, res.collects?.includes(user?.uid))} className="p-1.5 rounded-lg hover:bg-obelisk-surfaceDark transition-colors">
                        {res.collects?.includes(user?.uid) ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4 text-obelisk-textLight" />}
                      </button>
                      {(user?.uid === res.authorId || user?.uid === 'nCZLU2r9YfXVTrQ79EJqWJxPPT03') && !res.isDefault && (
                        <button onClick={() => handleDelete(res.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t('aggregate.add')}</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="资源名称" className="input-field" />
              <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL 地址" className="input-field" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-field">
                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="描述" rows={3} className="input-field resize-none" />
              <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="标签，用逗号分隔" className="input-field" />
              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={handleAddResource} disabled={!newTitle.trim() || !newUrl.trim()} className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2"><FileJson className="w-5 h-5" /> {t('aggregate.import')}</h3>
              <button onClick={() => setShowImportModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-obelisk-textMuted mb-3">格式：名称, URL, 分类, 描述, 标签</p>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="粘贴数据..." rows={8} className="input-field resize-none font-mono text-sm" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowImportModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
              <button onClick={handleImport} disabled={!importText.trim()} className="btn-primary flex-1">{t('aggregate.import')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
