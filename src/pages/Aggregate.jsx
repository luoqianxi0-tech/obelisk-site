import { useState } from 'react'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Aggregate() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState(new Set())

  const resources = [
    // Dev Tools
    { name: 'VS Code', url: 'https://code.visualstudio.com', cat: 'dev', desc: '微软开源编辑器，插件生态丰富' },
    { name: 'JetBrains Suite', url: 'https://jetbrains.com', cat: 'dev', desc: 'IDEA/PyCharm/GoLand 全家桶' },
    { name: 'Sublime Text', url: 'https://sublimetext.com', cat: 'dev', desc: '轻量级高速文本编辑器' },
    { name: 'Neovim', url: 'https://neovim.io', cat: 'dev', desc: 'Vim 重构版，Lua 配置' },
    { name: 'Docker', url: 'https://docker.com', cat: 'dev', desc: '容器化平台' },
    { name: 'Kubernetes', url: 'https://kubernetes.io', cat: 'dev', desc: '容器编排系统' },
    { name: 'Git', url: 'https://git-scm.com', cat: 'dev', desc: '分布式版本控制' },
    { name: 'GitHub', url: 'https://github.com', cat: 'dev', desc: '代码托管与协作' },
    { name: 'GitLab', url: 'https://gitlab.com', cat: 'dev', desc: '自托管 DevOps 平台' },
    { name: 'Postman', url: 'https://postman.com', cat: 'dev', desc: 'API 开发与测试' },
    { name: 'Insomnia', url: 'https://insomnia.rest', cat: 'dev', desc: '开源 API 客户端' },
    { name: 'Wireshark', url: 'https://wireshark.org', cat: 'dev', desc: '网络协议分析器' },
    { name: 'tcpdump', url: 'https://tcpdump.org', cat: 'dev', desc: '命令行抓包工具' },
    { name: 'Nmap', url: 'https://nmap.org', cat: 'dev', desc: '网络扫描与发现' },
    { name: 'Masscan', url: 'https://github.com/robertdavidgraham/masscan', cat: 'dev', desc: '互联网规模端口扫描' },

    // Security
    { name: 'Ghidra', url: 'https://ghidra-sre.org', cat: 'security', desc: 'NSA 开源逆向工程框架' },
    { name: 'IDA Pro', url: 'https://hex-rays.com', cat: 'security', desc: '行业标杆反汇编器' },
    { name: 'Binary Ninja', url: 'https://binary.ninja', cat: 'security', desc: '现代逆向工程平台' },
    { name: 'x64dbg', url: 'https://x64dbg.com', cat: 'security', desc: 'Windows 开源调试器' },
    { name: 'OllyDbg', url: 'https://ollydbg.de', cat: 'security', desc: '经典 Ring3 调试器' },
    { name: 'Frida', url: 'https://frida.re', cat: 'security', desc: '动态代码插桩工具包' },
    { name: ' objection', url: 'https://github.com/sensepost/objection', cat: 'security', desc: 'Frida 移动端运行时探索' },
    { name: 'Burp Suite', url: 'https://portswigger.net/burp', cat: 'security', desc: 'Web 渗透测试平台' },
    { name: 'OWASP ZAP', url: 'https://zaproxy.org', cat: 'security', desc: '开源 Web 漏洞扫描器' },
    { name: 'Metasploit', url: 'https://metasploit.com', cat: 'security', desc: '渗透测试框架' },
    { name: 'Cobalt Strike', url: 'https://cobaltstrike.com', cat: 'security', desc: '红队协同作战平台' },
    { name: 'BloodHound', url: 'https://bloodhound.readthedocs.io', cat: 'security', desc: 'Active Directory 攻击路径分析' },
    { name: 'Mimikatz', url: 'https://github.com/gentilkiwi/mimikatz', cat: 'security', desc: 'Windows 凭证提取神器' },
    { name: 'Volatility', url: 'https://volatilityfoundation.org', cat: 'security', desc: '内存取证框架' },
    { name: 'YARA', url: 'https://virustotal.github.io/yara', cat: 'security', desc: '恶意软件模式匹配' },
    { name: 'Cuckoo Sandbox', url: 'https://cuckoosandbox.org', cat: 'security', desc: '自动化恶意软件分析' },
    { name: 'REMnux', url: 'https://remnux.org', cat: 'security', desc: '恶意软件分析 Linux 发行版' },
    { name: 'Kali Linux', url: 'https://kali.org', cat: 'security', desc: '渗透测试发行版' },
    { name: 'Parrot OS', url: 'https://parrotsec.org', cat: 'security', desc: '安全与隐私发行版' },
    { name: 'BlackArch', url: 'https://blackarch.org', cat: 'security', desc: 'Arch 安全工具仓库' },

    // AI
    { name: 'ChatGPT', url: 'https://chat.openai.com', cat: 'ai', desc: 'OpenAI 对话模型' },
    { name: 'Claude', url: 'https://claude.ai', cat: 'ai', desc: 'Anthropic AI 助手' },
    { name: 'GitHub Copilot', url: 'https://github.com/copilot', cat: 'ai', desc: 'AI 编程助手' },
    { name: 'Cursor', url: 'https://cursor.sh', cat: 'ai', desc: 'AI 优先代码编辑器' },
    { name: 'Hugging Face', url: 'https://huggingface.co', cat: 'ai', desc: 'ML 模型与数据集社区' },
    { name: 'Ollama', url: 'https://ollama.com', cat: 'ai', desc: '本地大模型运行' },
    { name: 'LM Studio', url: 'https://lmstudio.ai', cat: 'ai', desc: '本地 LLM 桌面客户端' },
    { name: 'Midjourney', url: 'https://midjourney.com', cat: 'ai', desc: 'AI 图像生成' },
    { name: 'Stable Diffusion', url: 'https://stability.ai', cat: 'ai', desc: '开源文生图模型' },
    { name: 'Runway', url: 'https://runwayml.com', cat: 'ai', desc: 'AI 视频生成与编辑' },

    // Design
    { name: 'Figma', url: 'https://figma.com', cat: 'design', desc: '协作界面设计工具' },
    { name: 'Sketch', url: 'https://sketch.com', cat: 'design', desc: 'macOS 矢量设计' },
    { name: 'Adobe XD', url: 'https://adobe.com/xd', cat: 'design', desc: 'UX/UI 设计原型' },
    { name: 'Blender', url: 'https://blender.org', cat: 'design', desc: '开源 3D 创作套件' },
    { name: 'Dribbble', url: 'https://dribbble.com', cat: 'design', desc: '设计师作品社区' },
    { name: 'Behance', url: 'https://behance.net', cat: 'design', desc: 'Adobe 创意作品展示' },
    { name: 'Unsplash', url: 'https://unsplash.com', cat: 'design', desc: '高质量免费图库' },
    { name: 'Iconify', url: 'https://iconify.design', cat: 'design', desc: '统一图标框架' },

    // Docs
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', cat: 'docs', desc: 'Web 技术权威文档' },
    { name: 'DevDocs.io', url: 'https://devdocs.io', cat: 'docs', desc: '聚合 API 文档速查' },
    { name: 'OWASP', url: 'https://owasp.org', cat: 'docs', desc: 'Web 安全标准与指南' },
    { name: 'CVE Details', url: 'https://cvedetails.com', cat: 'docs', desc: 'CVE 漏洞数据库' },
    { name: 'NIST', url: 'https://nvd.nist.gov', cat: 'docs', desc: '美国国家漏洞库' },
    { name: 'Exploit-DB', url: 'https://exploit-db.com', cat: 'docs', desc: '漏洞利用代码库' },
    { name: 'PayloadsAllTheThings', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings', cat: 'docs', desc: '渗透测试 Payload 集合' },
    { name: 'HackTricks', url: 'https://book.hacktricks.xyz', cat: 'docs', desc: '渗透测试知识库' },
    { name: 'CTF Wiki', url: 'https://ctf-wiki.org', cat: 'docs', desc: 'CTF 竞赛知识百科' },
    { name: 'Linux Kernel Docs', url: 'https://docs.kernel.org', cat: 'docs', desc: 'Linux 内核官方文档' },

    // Learning
    { name: 'TryHackMe', url: 'https://tryhackme.com', cat: 'learn', desc: '网络安全学习平台' },
    { name: 'HackTheBox', url: 'https://hackthebox.com', cat: 'learn', desc: '渗透训练实验室' },
    { name: 'Pwnable.kr', url: 'https://pwnable.kr', cat: 'learn', desc: 'Pwn 入门靶场' },
    { name: 'Pwnable.tw', url: 'https://pwnable.tw', cat: 'learn', desc: '台湾 Pwn 靶场' },
    { name: 'Root-Me', url: 'https://root-me.org', cat: 'learn', desc: '法国网络安全挑战' },
    { name: 'OverTheWire', url: 'https://overthewire.org', cat: 'learn', desc: 'Linux 安全游戏' },
    { name: 'Cryptohack', url: 'https://cryptohack.org', cat: 'learn', desc: '密码学学习平台' },
    { name: 'PicoCTF', url: 'https://picoctf.org', cat: 'learn', desc: 'Carnegie Mellon CTF' },
    { name: 'CTFtime', url: 'https://ctftime.org', cat: 'learn', desc: 'CTF 赛事日历' },
    { name: 'PortSwigger Academy', url: 'https://portswigger.net/web-security', cat: 'learn', desc: 'Web 安全免费课程' },
    { name: 'OffSec', url: 'https://offsec.com', cat: 'learn', desc: 'OSCP/OSWE 认证培训' },
    { name: 'SANS', url: 'https://sans.org', cat: 'learn', desc: '信息安全培训与认证' },
    { name: 'Coursera', url: 'https://coursera.org', cat: 'learn', desc: '在线课程平台' },
    { name: 'freeCodeCamp', url: 'https://freecodecamp.org', cat: 'learn', desc: '免费编程学习' },

    // OSINT
    { name: 'Shodan', url: 'https://shodan.io', cat: 'osint', desc: '物联网搜索引擎' },
    { name: 'Censys', url: 'https://censys.io', cat: 'osint', desc: '互联网资产测绘' },
    { name: 'Maltego', url: 'https://maltego.com', cat: 'osint', desc: '开源情报可视化' },
    { name: 'theHarvester', url: 'https://github.com/laramies/theHarvester', cat: 'osint', desc: '子域名与邮箱收集' },
    { name: 'SpiderFoot', url: 'https://spiderfoot.net', cat: 'osint', desc: '自动化 OSINT 框架' },

    // Crypto
    { name: 'CyberChef', url: 'https://gchq.github.io/CyberChef', cat: 'crypto', desc: 'GCHQ 数据转换工具' },
    { name: 'Cryptool', url: 'https://cryptool.org', cat: 'crypto', desc: '密码学教学软件' },
    { name: 'Hashcat', url: 'https://hashcat.net', cat: 'crypto', desc: '世界上最快的密码恢复' },
    { name: 'John the Ripper', url: 'https://openwall.com/john', cat: 'crypto', desc: '密码破解工具' },
  ]

  const categories = [
    { key: 'all', label: t('aggregate.all') },
    { key: 'dev', label: t('aggregate.dev') },
    { key: 'security', label: t('aggregate.security') },
    { key: 'ai', label: t('aggregate.ai') },
    { key: 'design', label: t('aggregate.design') },
    { key: 'docs', label: t('aggregate.docs') },
    { key: 'learn', label: t('aggregate.learn') },
    { key: 'osint', label: t('aggregate.osint') },
    { key: 'crypto', label: t('aggregate.crypto') },
  ]

  const filtered = resources.filter(r => {
    if (category !== 'all' && r.cat !== category) return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function toggleBookmark(name) {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('aggregate.title')}</h1>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('aggregate.search')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-obelisk-border text-sm focus:outline-none focus:border-obelisk-line"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              category === c.key ? 'bg-obelisk-line text-white' : 'bg-white border border-obelisk-border text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 hover:bg-white/80 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold text-obelisk-line hover:underline">{r.name}</a>
              <button onClick={() => toggleBookmark(r.name)} className="text-obelisk-textMuted hover:text-amber-500 transition-colors">
                <svg className={`w-5 h-5 ${bookmarks.has(r.name) ? 'fill-amber-400 text-amber-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
            </div>
            <p className="text-xs text-obelisk-textMuted">{r.desc}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted uppercase">{r.cat}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-obelisk-textMuted">{t('settings.empty')}</div>
      )}
    </div>
  )
}
