import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { Shield, Users, Layers, Plus, Upload, FileJson, Trash2, X, Globe, Wrench, Palette, BookOpen } from 'lucide-react'

const ADMIN_UID = 'nCZLU2r9YfXVTrQ79EJqWJxPPT03'

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resources')
  const [stats, setStats] = useState({ users: 0, posts: 0, resources: 0, designs: 0 })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('dev')
  const [newDesc, setNewDesc] = useState('')
  const [newTags, setNewTags] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [importTarget, setImportTarget] = useState('resources')

  useEffect(() => { if (!isAdmin) { navigate('/'); return } fetchStats(); fetchItems('resources') }, [isAdmin, navigate])

  const fetchStats = async () => {
    try {
      const [users, posts, resources, designs] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'stele_posts'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'resources'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'design_items'), orderBy('createdAt', 'desc')))
      ])
      setStats({ users: users.size, posts: posts.size, resources: resources.size, designs: designs.size })
    } catch (e) { console.error(e) }
  }

  const fetchItems = async (type) => {
    setLoading(true)
    try {
      let col = type
      if (type === 'index') col = 'index_items'
      const q = query(collection(db, col), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    } catch (e) { console.error(e); setLoading(false) }
  }

  const handleTabChange = (tab) => { setActiveTab(tab); fetchItems(tab) }

  const handleAdd = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return
    try {
      const data = { title: newTitle, url: newUrl, category: newCategory, description: newDesc, tags: newTags.split(/[,\s]+/).filter(Boolean), authorId: user.uid, authorName: user.displayName || 'Admin', likes: [], collects: [], createdAt: serverTimestamp() }
      let col = activeTab
      if (activeTab === 'index') col = 'index_items'
      await addDoc(collection(db, col), data)
      setNewTitle(''); setNewUrl(''); setNewDesc(''); setNewTags(''); setShowAddModal(false)
      fetchItems(activeTab); fetchStats()
    } catch (e) { alert(t('common.error') + ': ' + e.message) }
  }

  const handleImport = async () => {
    try {
      const lines = importText.trim().split('\n')
      const imported = []
      for (const line of lines) {
        const parts = line.split(',').map(s => s.trim())
        if (parts.length >= 2) imported.push({ title: parts[0], url: parts[1], category: parts[2] || 'dev', description: parts[3] || '', tags: parts[4] ? parts[4].split(/[,\s]+/) : [], authorId: user.uid, authorName: user.displayName || 'Admin', likes: [], collects: [], createdAt: serverTimestamp() })
      }
      let col = importTarget
      if (importTarget === 'index') col = 'index_items'
      for (const item of imported) await addDoc(collection(db, col), item)
      setImportText(''); setShowImportModal(false); alert(`Imported ${imported.length}`)
      fetchItems(activeTab); fetchStats()
    } catch (e) { alert(t('common.error') + ': ' + e.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.delete') + '?')) return
    try { let col = activeTab; if (activeTab === 'index') col = 'index_items'; await deleteDoc(doc(db, col, id)); setItems(prev => prev.filter(i => i.id !== id)); fetchStats() } catch (e) { alert(t('common.error')) }
  }

  const tabs = [
    { id: 'resources', name: '聚合资源', icon: Globe },
    { id: 'index_items', name: '索引条目', icon: Wrench },
    { id: 'design_items', name: '设计内容', icon: Palette },
    { id: 'stele_posts', name: '碑刻帖子', icon: BookOpen },
  ]

  if (!isAdmin) return null

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-obelisk-line flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          <div><h1 className="section-title">{t('nav.admin')}</h1><p className="text-xs text-obelisk-textMuted">ADMIN ACCESS GRANTED</p></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard><div className="flex items-center gap-3"><Users className="w-5 h-5 text-obelisk-textMuted" /><div><p className="text-2xl font-bold">{stats.users}</p><p className="text-xs text-obelisk-textMuted">Users</p></div></div></GlassCard>
          <GlassCard><div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-obelisk-textMuted" /><div><p className="text-2xl font-bold">{stats.posts}</p><p className="text-xs text-obelisk-textMuted">Posts</p></div></div></GlassCard>
          <GlassCard><div className="flex items-center gap-3"><Layers className="w-5 h-5 text-obelisk-textMuted" /><div><p className="text-2xl font-bold">{stats.resources}</p><p className="text-xs text-obelisk-textMuted">Resources</p></div></div></GlassCard>
          <GlassCard><div className="flex items-center gap-3"><Palette className="w-5 h-5 text-obelisk-textMuted" /><div><p className="text-2xl font-bold">{stats.designs}</p><p className="text-xs text-obelisk-textMuted">Design</p></div></div></GlassCard>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id === 'index_items' ? 'index' : tab.id === 'design_items' ? 'design' : tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === (tab.id === 'index_items' ? 'index' : tab.id === 'design_items' ? 'design' : tab.id) ? 'bg-obelisk-line text-white' : 'bg-white text-obelisk-textMuted hover:bg-obelisk-surfaceDark border border-obelisk-border'}`}><tab.icon className="w-4 h-4" />{tab.name}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
          <button onClick={() => setShowImportModal(true)} className="btn-secondary text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Import</button>
        </div>
        {loading ? <div className="text-center py-12"><div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" /></div> : items.length === 0 ? <GlassCard><div className="text-center py-12"><Layers className="w-12 h-12 mx-auto mb-3 text-obelisk-border" /><p className="text-obelisk-textMuted">{t('common.empty')}</p></div></GlassCard> : (
          <div className="space-y-3">
            {items.map(item => (
              <GlassCard key={item.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="tag text-xs">{item.category || item.type || 'general'}</span>{item.tags?.map(t => <span key={t} className="tag text-xs">{t}</span>)}</div>
                  <p className="font-medium text-sm text-obelisk-line">{item.title}</p>
                  <p className="text-xs text-obelisk-textMuted truncate">{item.url || item.content || item.desc}</p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold">Add</h3><button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Name" className="input-field" />
              <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL" className="input-field" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-field"><option value="dev">Dev</option><option value="design">Design</option><option value="docs">Docs</option><option value="media">Media</option><option value="ai">AI</option><option value="infra">Infra</option><option value="learn">Learn</option></select>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" rows={3} className="input-field resize-none" />
              <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="Tags" className="input-field" />
              <div className="flex gap-3"><button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button><button onClick={handleAdd} disabled={!newTitle.trim() || !newUrl.trim()} className="btn-primary flex-1">{t('common.save')}</button></div>
            </div>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><FileJson className="w-5 h-5" /> Import</h3><button onClick={() => setShowImportModal(false)}><X className="w-5 h-5" /></button></div>
            <select value={importTarget} onChange={e => setImportTarget(e.target.value)} className="input-field mb-3"><option value="resources">Resources</option><option value="index">Index</option><option value="design">Design</option></select>
            <p className="text-xs text-obelisk-textMuted mb-2">Format: Name, URL, Category, Desc, Tags</p>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={8} className="input-field resize-none font-mono text-sm" />
            <div className="flex gap-3 mt-4"><button onClick={() => setShowImportModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button><button onClick={handleImport} disabled={!importText.trim()} className="btn-primary flex-1">Import</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
