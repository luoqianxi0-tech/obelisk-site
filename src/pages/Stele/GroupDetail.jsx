import { useParams, Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useState } from 'react'

export default function GroupDetail() {
  const { id } = useParams()
  const { t } = useI18n()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('feed')
  const [joined, setJoined] = useState(false)

  const groupData = {
    '1': { name: 'Reverse Engineering', desc: '二进制分析、逆向工程、恶意软件分析', members: 1284, posts: 3420, activity: 98, color: 'from-orange-400 to-red-500', rules: '禁止发布恶意软件样本链接，分享分析思路而非成品武器。' },
    '2': { name: 'CTF / Pwn', desc: 'CTF 竞赛、二进制漏洞利用、内核安全', members: 956, posts: 2180, activity: 95, color: 'from-blue-400 to-indigo-500', rules: 'Writeup 必须打满 72 小时后才可发布。' },
    '3': { name: 'Mobile Security', desc: 'Android/iOS 逆向、Frida、越狱开发', members: 742, posts: 1560, activity: 88, color: 'from-emerald-400 to-teal-500', rules: 'iOS 越狱工具分享需标注系统版本兼容性。' },
    '4': { name: 'Web3 Security', desc: '智能合约审计、DeFi 安全、区块链取证', members: 621, posts: 980, activity: 82, color: 'from-purple-400 to-pink-500', rules: '审计报告需脱敏处理，禁止直接披露未修复漏洞。' },
  }[id] || { name: 'Unknown Group', desc: '', members: 0, posts: 0, activity: 0, color: 'from-gray-400 to-gray-600', rules: '' }

  const demoPosts = [
    { id: 'p1', authorName: '0xACE', content: '刚刚完成了一个 ARM64 架构的漏洞利用链，从用户态到内核态提权，全程零交互。', likes: 234, comments: 45, time: '2h ago' },
    { id: 'p2', authorName: 'ReverserX', content: '分享一个绕过 iOS 16 PAC 的新思路，利用 JIT 编译器的侧信道泄漏...', likes: 189, comments: 32, time: '5h ago' },
    { id: 'p3', authorName: 'MalwareHunter', content: '分析了最新出现的勒索软件样本，C2 通信使用了 DNS-over-HTTPS 隐蔽通道。', likes: 156, comments: 28, time: '1d ago' },
  ]

  const members = [
    { name: '0xACE', role: 'Admin' }, { name: 'ReverserX', role: 'Mod' },
    { name: 'MalwareHunter', role: 'Member' }, { name: 'PwnMaster', role: 'Member' },
    { name: 'CryptoWizard', role: 'Member' },
  ]

  return (
    <div className="space-y-4">
      <div className={`h-40 rounded-2xl bg-gradient-to-r ${groupData.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-2xl font-bold">{groupData.name}</h1>
          <p className="text-sm opacity-90 mt-1">{groupData.desc}</p>
        </div>
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <div className="text-right text-white">
            <div className="text-lg font-bold">{groupData.members}</div>
            <div className="text-xs opacity-80">{t('stele.members')}</div>
          </div>
          {user && (
            <button
              onClick={() => setJoined(!joined)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                joined ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white text-obelisk-line hover:bg-white/90'
              }`}
            >
              {joined ? t('stele.leaveGroup') : t('stele.joinGroup')}
            </button>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-2">
        <div className="flex gap-1">
          {[
            { key: 'feed', label: t('stele.all') },
            { key: 'rules', label: t('stele.groupRules') },
            { key: 'members', label: t('stele.members') },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-obelisk-line text-white' : 'text-obelisk-textMuted hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="space-y-4">
          {demoPosts.map(post => (
            <div key={post.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-obelisk-line to-gray-600 flex items-center justify-center text-white font-bold text-xs">
                  {post.authorName[0]}
                </div>
                <span className="text-sm font-medium">{post.authorName}</span>
                <span className="text-xs text-obelisk-textMuted">{post.time}</span>
              </div>
              <p className="text-sm text-obelisk-text mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-obelisk-textMuted">
                <span>{post.likes} {t('stele.like')}</span>
                <span>{post.comments} {t('stele.comment')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-obelisk-line mb-3">{t('stele.groupRules')}</h3>
          <p className="text-sm text-obelisk-text leading-relaxed whitespace-pre-line">{groupData.rules || t('settings.empty')}</p>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-obelisk-line mb-4">{t('stele.members')} ({members.length})</h3>
          <div className="space-y-3">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-obelisk-line to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                  {m.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{m.name}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${m.role === 'Admin' ? 'bg-red-100 text-red-600' : m.role === 'Mod' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
