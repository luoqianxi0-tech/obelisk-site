import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { 
  collection, addDoc, getDocs, query, orderBy, where, 
  serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore'
import { 
  Search, Plus, Globe, ExternalLink, Bookmark, BookmarkCheck, 
  Grid, List, Tag, Filter, X, Upload, FileJson, Trash2, Star
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

export default function Aggregate() {
  const { user } = useAuth()
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
        if (activeCategory !== 'all') {
          q = query(q, where('category', '==', activeCategory))
        }
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setResources(items)
        setLoading(false)
      } catch (e) {
        console.error('Aggregate fetch error:', e)
        setLoading(false)
      }
    }
    fetchResources()
  }, [activeCategory])

  const handleAddResource = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return
    try {
      await addDoc(collection(db, 'resources'), {
        title: newTitle,
        url: newUrl,
        category: newCategory,
        description: newDesc,
        tags: newTags.split(/[,\s]+/).filter(Boolean),
        authorId: user?.uid || '',
        authorName: user?.displayName || '匿名',
        likes: [],
        collects: [],
        createdAt: serverTimestamp()
      })

      setNewTitle('')
      setNewUrl('')
      setNewDesc('')
      setNewTags('')
      setShowAddModal(false)

      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      alert('添加失败: ' + e.message)
    }
  }

  const handleImport = async () => {
    try {
      const lines = importText.trim().split('\n')
      const items = []
      for (const line of lines) {
        const parts = line.split(',').map(s => s.trim())
        if (parts.length >= 2) {
          items.push({
            title: parts[0],
            url: parts[1],
            category: parts[2] || 'dev',
            description: parts[3] || '',
            tags: parts[4] ? parts[4].split(/[,\s]+/) : [],
            authorId: user?.uid || '',
            authorName: user?.displayName || '匿名',
            likes: [],
            collects: [],
            createdAt: serverTimestamp()
          })
        }
      }

      for (const item of items) {
        await addDoc(collection(db, 'resources'), item)
      }

      setImportText('')
      setShowImportModal(false)
      alert(`成功导入 ${items.length} 条资源`)

      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      alert('导入失败: ' + e.message)
    }
  }

  const handleCollect = async (id, isCollected) => {
    if (!user) { alert('请先登录'); return }
    try {
      const ref = doc(db, 'resources', id)
      await updateDoc(ref, {
        collects: isCollected ? arrayRemove(user.uid) : arrayUnion(user.uid)
      })
      setResources(prev => prev.map(r => r.id === id ? { ...r, collects: isCollected ? (r.collects || []).filter(u => u !== user.uid) : [...(r.collects || []), user.uid] } : r))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try {
      await deleteDoc(doc(db, 'resources', id))
      setResources(prev => prev.filter(r => r.id !== id))
    } catch (e) {
      alert('删除失败')
    }
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
            <h1 className="section-title">聚合入口</h1>
            <p className="section-subtitle">精选资源索引与导航</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="btn-secondary text-sm py-2 px-3">
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            {user && (
              <>
                <button onClick={() => setShowImportModal(true)} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
                  <Upload className="w-4 h-4" /> 导入
                </button>
                <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> 添加
                </button>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索资源..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    activeCategory === cat.id ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Globe className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted">暂无资源</p>
              {user && (
                <button onClick={() => setShowAddModal(true)} className="btn-primary mt-4">
                  添加第一条资源
                </button>
              )}
            </div>
          </GlassCard>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filtered.map((res, i) => (
              <GlassCard key={res.id} delay={i * 0.05} className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="tag text-xs">{res.category}</span>
                      {res.tags?.map(t => <span key={t} className="tag text-xs">{t}</span>)}
                    </div>
                  </div>

                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h3 className="font-bold text-obelisk-line group-hover:underline flex items-center gap-2">
                      {res.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </a>

                  <p className="text-sm text-obelisk-textMuted mt-1 line-clamp-2">{res.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-obelisk-border">
                    <div className="flex items-center gap-3 text-xs text-obelisk-textLight">
                      <span>{res.authorName}</span>
                      <span>{res.collects?.length || 0} 收藏</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleCollect(res.id, res.collects?.includes(user?.uid))}
                        className="p-1.5 rounded-lg hover:bg-obelisk-surfaceDark transition-colors"
                      >
                        {res.collects?.includes(user?.uid) ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-obelisk-textLight" />
                        )}
                      </button>
                      {(user?.uid === res.authorId || user?.uid === 'nCZLU2r9YfXVTrQ79EJqWJxPPT03') && (
                        <button onClick={() => handleDelete(res.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
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
              <h3 className="font-bold">添加资源</h3>
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
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">取消</button>
                <button onClick={handleAddResource} disabled={!newTitle.trim() || !newUrl.trim()} className="btn-primary flex-1">添加</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2"><FileJson className="w-5 h-5" /> 批量导入</h3>
              <button onClick={() => setShowImportModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-obelisk-textMuted mb-3">
              每行格式：名称, URL, 分类, 描述, 标签<br/>
              例：GitHub, https://github.com, dev, 代码托管平台, git,开源
            </p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="粘贴数据..."
              rows={8}
              className="input-field resize-none font-mono text-sm"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowImportModal(false)} className="btn-secondary flex-1">取消</button>
              <button onClick={handleImport} disabled={!importText.trim()} className="btn-primary flex-1">导入</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
