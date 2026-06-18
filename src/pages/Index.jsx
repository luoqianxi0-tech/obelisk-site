import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { db } from '../firebase.js'
import GlassCard from '../components/GlassCard.jsx'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Search, Wrench, BookOpen, Monitor, ExternalLink, Star, Tag } from 'lucide-react'

const TABS = [
  { id: 'tools', name: '工具', icon: Wrench },
  { id: 'docs', name: '文档', icon: BookOpen },
  { id: 'systems', name: '系统', icon: Monitor },
]

const DEFAULT_TOOLS = [
  { title: 'VS Code', url: 'https://code.visualstudio.com', category: 'tools', desc: '最流行的代码编辑器', tags: ['编辑器', 'IDE'] },
  { title: 'Figma', url: 'https://figma.com', category: 'tools', desc: '协作设计工具', tags: ['设计', 'UI'] },
  { title: 'Docker', url: 'https://docker.com', category: 'tools', desc: '容器化平台', tags: ['DevOps', '容器'] },
  { title: 'Postman', url: 'https://postman.com', category: 'tools', desc: 'API 测试工具', tags: ['API', '测试'] },
  { title: 'Git', url: 'https://git-scm.com', category: 'tools', desc: '版本控制系统', tags: ['版本控制'] },
  { title: 'Node.js', url: 'https://nodejs.org', category: 'tools', desc: 'JavaScript 运行时', tags: ['后端', 'JS'] },
  { title: 'React', url: 'https://react.dev', category: 'docs', desc: '前端 UI 库', tags: ['前端', '框架'] },
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com', category: 'docs', desc: '实用优先 CSS 框架', tags: ['CSS', '样式'] },
  { title: 'TypeScript', url: 'https://typescriptlang.org', category: 'docs', desc: '类型化 JavaScript', tags: ['类型', '语言'] },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'docs', desc: 'Web 技术文档', tags: ['文档', '参考'] },
  { title: 'Linux', url: 'https://kernel.org', category: 'systems', desc: '开源操作系统内核', tags: ['OS', '内核'] },
  { title: 'Nginx', url: 'https://nginx.org', category: 'systems', desc: '高性能 Web 服务器', tags: ['服务器', 'Web'] },
  { title: 'PostgreSQL', url: 'https://postgresql.org', category: 'systems', desc: '高级开源数据库', tags: ['数据库', 'SQL'] },
  { title: 'Redis', url: 'https://redis.io', category: 'systems', desc: '内存数据结构存储', tags: ['缓存', 'NoSQL'] },
  { title: 'Kubernetes', url: 'https://kubernetes.io', category: 'systems', desc: '容器编排平台', tags: ['K8s', '编排'] },
]

export default function Index() {
  const [activeTab, setActiveTab] = useState('tools')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'index_items'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const dbItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        let merged = [...DEFAULT_TOOLS.map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true })), ...dbItems]
        setItems(merged)
        setLoading(false)
      } catch (e) {
        console.error('Index fetch error:', e)
        setItems(DEFAULT_TOOLS.map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true })))
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const filtered = items.filter(item => {
    const matchesTab = item.category === activeTab
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">索引</h1>
          <p className="section-subtitle">工具、文档与系统资源汇总</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-obelisk-line text-white shadow-lg' 
                  : 'bg-white text-obelisk-textMuted hover:bg-obelisk-surfaceDark border border-obelisk-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`搜索${TABS.find(t => t.id === activeTab)?.name}...`}
            className="input-field pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted">未找到相关内容</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <GlassCard key={item.id} delay={i * 0.05}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-obelisk-surfaceDark flex items-center justify-center">
                    <Star className="w-5 h-5 text-obelisk-line" />
                  </div>
                  {item.isDefault && <span className="tag text-xs">推荐</span>}
                </div>

                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                  <h3 className="font-bold text-obelisk-line group-hover:underline flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                </a>

                <p className="text-sm text-obelisk-textMuted mt-2">{item.desc}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags?.map(t => (
                    <span key={t} className="tag text-xs">{t}</span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
