import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Eye, Plus, Code, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

const defaultSnippets = [
  { title: 'SSL Pinning Bypass', lang: 'javascript', code: `Java.perform(function() {\n  var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');\n  var TrustManager = Java.registerClass({\n    implements: [X509TrustManager],\n    methods: {\n      checkClientTrusted: function() {},\n      checkServerTrusted: function() {},\n      getAcceptedIssuers: function() { return null; }\n    }\n  });\n});` },
  { title: 'Frida Hook Template', lang: 'javascript', code: `Interceptor.attach(Module.findExportByName(null, 'strcmp'), {\n  onEnter: function(args) {\n    console.log('strcmp: ' + Memory.readUtf8String(args[0]));\n  }\n});` },
  { title: 'ADB Pull APK', lang: 'bash', code: `# Get APK path\nadb shell pm path com.target.app\n\n# Pull APK\nadb pull /data/app/com.target.app/base.apk ./target.apk` },
  { title: 'Python Proxy Scanner', lang: 'python', code: `import requests\nproxies = {'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'}\nresp = requests.get('https://target.com/api', proxies=proxies, verify=False)\nprint(resp.status_code)` },
  { title: 'Objection Explore', lang: 'bash', code: `# Start objection session\nobjection -g com.target.app explore\n\n# Common commands\nandroid hooking list activities\nandroid root disable` },
  { title: 'APK Sign Check', lang: 'bash', code: `# Check certificate\nkeytool -printcert -jarfile target.apk\n\n# Verify signature\napksigner verify -v target.apk` },
]

const defaultPosts = [
  { id: '1', title: 'SSL Pinning Bypass Collection', type: 'insight', authorName: 'Anonymous', content: 'Collection of methods to bypass SSL pinning on Android apps using Frida and Objection.', likes: 42, comments: [], views: 128, createdAt: new Date() },
  { id: '2', title: 'Frida Hook Best Practices', type: 'tool', authorName: 'ReverseKing', content: 'Best practices for writing Frida hooks including error handling and performance optimization.', likes: 35, comments: [], views: 96, createdAt: new Date() },
]

export default function Inspo() {
  const { user } = useAuth()
  const [tab, setTab] = useState('posts')
  const [posts] = useState(defaultPosts)
  const [snippets] = useState(defaultSnippets)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showSnippetModal, setShowSnippetModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-16 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[1.4rem] font-light tracking-[0.15em] mb-2 text-gradient">Inspo Ruins</h1>
          <div className="text-[0.75rem] text-white/30 tracking-[0.1em]">Code Snippets & Community Share</div>
        </div>
        <button onClick={() => setShowPostModal(true)} className="glass-btn-primary flex items-center gap-2">
          <Plus size={14} /> New Post
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['posts', 'snippets'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[0.7rem] tracking-[0.1em] uppercase cursor-pointer transition-all border ${
              tab === t ? 'border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.6)] bg-[rgba(100,255,150,0.03)]' : 'border-obelisk-glassBorder text-white/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="space-y-3">
          {posts.map((p) => (
            <motion.div
              key={p.id}
              className="glass-panel p-5 cursor-pointer hover:border-white/15 hover:bg-white/[0.04] hover:translate-x-1 transition-all"
              onClick={() => setSelectedPost(p)}
            >
              <div className="text-[1rem] text-white/90 tracking-wide mb-1.5">{p.title}</div>
              <div className="flex gap-3 text-[0.65rem] text-white/30 mb-2">
                <span className="text-[rgba(100,255,150,0.6)] font-mono">{p.authorName}</span>
                <span className="font-mono">{p.createdAt.toLocaleDateString()}</span>
                <span className="px-2 py-0.5 bg-[rgba(100,255,150,0.08)] border border-[rgba(100,255,150,0.2)] text-[rgba(100,255,150,0.6)] text-[0.6rem] uppercase">{p.type}</span>
              </div>
              <div className="text-[0.8rem] text-white/50 leading-relaxed">{p.content.slice(0, 200)}...</div>
              <div className="flex gap-4 mt-3 text-[0.65rem] text-white/30">
                <span className="flex items-center gap-1"><Heart size={12} /> {p.likes}</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} /> {p.comments.length}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {p.views}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'snippets' && (
        <div className="grid grid-cols-2 gap-3">
          {snippets.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 hover:border-white/15 hover:bg-white/[0.04] transition-all"
            >
              <div className="text-[0.8rem] text-white/80 mb-1">{s.title}</div>
              <div className="text-[0.6rem] text-[rgba(100,255,150,0.6)] tracking-[0.1em] uppercase mb-2">{s.lang}</div>
              <pre className="bg-black/40 p-2.5 border border-white/5 font-mono text-[0.65rem] text-white/40 overflow-x-auto whitespace-pre max-h-[100px] overflow-y-auto">{s.code}</pre>
              <div className="flex gap-2 mt-2.5">
                <button className="glass-btn text-[0.6rem] py-1 px-2" onClick={() => navigator.clipboard.writeText(s.code)}>Copy</button>
                <button className="glass-btn text-[0.6rem] py-1 px-2">Arsenal</button>
              </div>
            </motion.div>
          ))}
          <button onClick={() => setShowSnippetModal(true)} className="glass-panel p-4 flex items-center justify-center gap-2 border-dashed border-white/15 text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer col-span-2">
            <Plus size={14} /> Add Snippet
          </button>
        </div>
      )}

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/92 backdrop-blur-xl z-[20000] flex items-center justify-center p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              className="glass-panel p-10 max-w-[700px] w-full max-h-[85vh] overflow-y-auto"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 w-8 h-8 border border-white/10 text-white/40 flex items-center justify-center hover:border-white/30 hover:text-white transition-all"><X size={16} /></button>
              <h3 className="text-[1rem] font-light tracking-[0.15em] mb-4 text-white">{selectedPost.title}</h3>
              <div className="flex gap-3 text-[0.65rem] text-white/30 mb-4">
                <span className="text-[rgba(100,255,150,0.6)] font-mono">{selectedPost.authorName}</span>
                <span className="font-mono">{selectedPost.createdAt.toLocaleString()}</span>
                <span className="px-2 py-0.5 bg-[rgba(100,255,150,0.08)] border border-[rgba(100,255,150,0.2)] text-[rgba(100,255,150,0.6)] text-[0.6rem] uppercase">{selectedPost.type}</span>
              </div>
              <div className="text-[0.85rem] text-white/70 leading-relaxed">{selectedPost.content}</div>
              <div className="flex gap-3 mt-6">
                <button className="glass-btn-primary flex items-center gap-2"><Heart size={14} /> Like</button>
                <button className="glass-btn flex items-center gap-2"><MessageCircle size={14} /> Comment</button>
                <button className="glass-btn flex items-center gap-2"><Star size={14} /> Collect</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
