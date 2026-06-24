import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Search, Wrench, BookOpen, Monitor, ExternalLink, Star } from 'lucide-react'

const TABS = [
  { id: 'tools', name: '工具', icon: Wrench },
  { id: 'docs', name: '文档', icon: BookOpen },
  { id: 'systems', name: '系统', icon: Monitor },
]

const DEFAULT_TOOLS = [
  { title: 'VS Code', url: 'https://code.visualstudio.com', category: 'tools', desc: '最流行的代码编辑器', tags: ['编辑器', 'IDE'] },
  { title: 'WebStorm', url: 'https://jetbrains.com/webstorm', category: 'tools', desc: 'JetBrains 前端 IDE', tags: ['IDE', 'JetBrains'] },
  { title: 'Sublime Text', url: 'https://sublimetext.com', category: 'tools', desc: '轻量级代码编辑器', tags: ['编辑器', '轻量'] },
  { title: 'Vim', url: 'https://vim.org', category: 'tools', desc: '终端编辑器之神', tags: ['编辑器', '终端'] },
  { title: 'Emacs', url: 'https://gnu.org/software/emacs', category: 'tools', desc: '可扩展文本编辑器', tags: ['编辑器', 'GNU'] },
  { title: 'Figma', url: 'https://figma.com', category: 'tools', desc: '协作设计工具', tags: ['设计', 'UI'] },
  { title: 'Sketch', url: 'https://sketch.com', category: 'tools', desc: 'Mac 矢量设计', tags: ['设计', 'Mac'] },
  { title: 'Docker', url: 'https://docker.com', category: 'tools', desc: '容器化平台', tags: ['DevOps', '容器'] },
  { title: 'Postman', url: 'https://postman.com', category: 'tools', desc: 'API 测试工具', tags: ['API', '测试'] },
  { title: 'Insomnia', url: 'https://insomnia.rest', category: 'tools', desc: '现代 API 客户端', tags: ['API', 'REST'] },
  { title: 'Git', url: 'https://git-scm.com', category: 'tools', desc: '版本控制系统', tags: ['版本控制'] },
  { title: 'GitHub Desktop', url: 'https://desktop.github.com', category: 'tools', desc: 'Git 图形客户端', tags: ['Git', 'GUI'] },
  { title: 'Node.js', url: 'https://nodejs.org', category: 'tools', desc: 'JavaScript 运行时', tags: ['后端', 'JS'] },
  { title: 'Bun', url: 'https://bun.sh', category: 'tools', desc: '快速 JavaScript 运行时', tags: ['JS', '高性能'] },
  { title: 'Deno', url: 'https://deno.land', category: 'tools', desc: '安全 TypeScript 运行时', tags: ['TS', '安全'] },
  { title: 'React', url: 'https://react.dev', category: 'docs', desc: '前端 UI 库', tags: ['前端', '框架'] },
  { title: 'Vue.js', url: 'https://vuejs.org', category: 'docs', desc: '渐进式前端框架', tags: ['前端', '框架'] },
  { title: 'Angular', url: 'https://angular.io', category: 'docs', desc: 'Google 前端框架', tags: ['前端', '框架'] },
  { title: 'Svelte', url: 'https://svelte.dev', category: 'docs', desc: '编译型前端框架', tags: ['前端', '编译'] },
  { title: 'Tailwind CSS', url: 'https://tailwindcss.com', category: 'docs', desc: '实用优先 CSS 框架', tags: ['CSS', '样式'] },
  { title: 'Bootstrap', url: 'https://getbootstrap.com', category: 'docs', desc: '响应式 CSS 框架', tags: ['CSS', '响应式'] },
  { title: 'TypeScript', url: 'https://typescriptlang.org', category: 'docs', desc: '类型化 JavaScript', tags: ['类型', '语言'] },
  { title: 'Rust', url: 'https://rust-lang.org', category: 'docs', desc: '系统编程语言', tags: ['系统', '安全'] },
  { title: 'Go', url: 'https://go.dev', category: 'docs', desc: 'Google 后端语言', tags: ['后端', '并发'] },
  { title: 'Python', url: 'https://python.org', category: 'docs', desc: '通用编程语言', tags: ['通用', '数据'] },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'docs', desc: 'Web 技术文档', tags: ['文档', '参考'] },
  { title: 'Linux', url: 'https://kernel.org', category: 'systems', desc: '开源操作系统内核', tags: ['OS', '内核'] },
  { title: 'Ubuntu', url: 'https://ubuntu.com', category: 'systems', desc: '流行 Linux 发行版', tags: ['OS', 'Linux'] },
  { title: 'Arch Linux', url: 'https://archlinux.org', category: 'systems', desc: '滚动更新发行版', tags: ['OS', '滚动'] },
  { title: 'Nginx', url: 'https://nginx.org', category: 'systems', desc: '高性能 Web 服务器', tags: ['服务器', 'Web'] },
  { title: 'Apache', url: 'https://apache.org', category: 'systems', desc: '老牌 Web 服务器', tags: ['服务器', 'Web'] },
  { title: 'Caddy', url: 'https://caddyserver.com', category: 'systems', desc: '现代 Web 服务器', tags: ['服务器', '自动HTTPS'] },
  { title: 'PostgreSQL', url: 'https://postgresql.org', category: 'systems', desc: '高级开源数据库', tags: ['数据库', 'SQL'] },
  { title: 'MySQL', url: 'https://mysql.com', category: 'systems', desc: '流行关系数据库', tags: ['数据库', 'SQL'] },
  { title: 'MongoDB', url: 'https://mongodb.com', category: 'systems', desc: '文档型数据库', tags: ['数据库', 'NoSQL'] },
  { title: 'Redis', url: 'https://redis.io', category: 'systems', desc: '内存数据结构存储', tags: ['缓存', 'NoSQL'] },
  { title: 'Elasticsearch', url: 'https://elastic.co', category: 'systems', desc: '搜索与分析引擎', tags: ['搜索', '分析'] },
  { title: 'Kubernetes', url: 'https://kubernetes.io', category: 'systems', desc: '容器编排平台', tags: ['K8s', '编排'] },
  { title: 'Prometheus', url: 'https://prometheus.io', category: 'systems', desc: '监控与告警系统', tags: ['监控', '指标'] },
  { title: 'Grafana', url: 'https://grafana.com', category: 'systems', desc: '可视化监控面板', tags: ['监控', '可视化'] },
]

export default function Index() {
  const { t } = useI18n()
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
        const defaults = DEFAULT_TOOLS.map((t, i) => ({ ...t, id: `default-${i}`, isDefault: true }))
        setItems([...defaults, ...dbItems])
        setLoading(false)
      } catch (e) {
        console.error(e)
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
          <h1 className="section-title">{t('nav.index')}</h1>
          <p className="section-subtitle">工具、文档与系统资源汇总</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-obelisk-line text-white shadow-lg' : 'bg-white text-obelisk-textMuted hover:bg-obelisk-surfaceDark border border-obelisk-border'}`}>
              <tab.icon className="w-4 h-4" />{tab.name}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('index.search')} className="input-field pl-10" />
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted">{t('common.empty')}</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <GlassCard key={item.id} delay={i * 0.03}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-obelisk-surfaceDark flex items-center justify-center">
                    <Star className="w-5 h-5 text-obelisk-line" />
                  </div>
                  {item.isDefault && <span className="tag text-xs bg-obelisk-line text-white">推荐</span>}
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                  <h3 className="font-bold text-obelisk-line group-hover:underline flex items-center gap-2">{item.title}<ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                </a>
                <p className="text-sm text-obelisk-textMuted mt-2">{item.desc}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags?.map(t => <span key={t} className="tag text-xs">{t}</span>)}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
