import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'

export default function Labs() {
  const { t } = useI18n()
  const [filter, setFilter] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const labs = [
    { id: '1', name: "Pwnable.kr - Toddler\'s Bottle", type: 'pwn', difficulty: 'easy', status: 'solved', points: 150, platform: 'Pwnable.kr', tags: ['BOF', 'Shellcode'] },
    { id: '2', name: 'HackTheBox - Starting Point', type: 'web', difficulty: 'easy', status: 'solved', points: 200, platform: 'HackTheBox', tags: ['Nmap', 'Metasploit'] },
    { id: '3', name: 'CTFtime - Crypto 101', type: 'crypto', difficulty: 'easy', status: 'solved', points: 100, platform: 'CTFtime', tags: ['RSA', 'XOR'] },
    { id: '4', name: 'Pwnable.tw - Start', type: 'pwn', difficulty: 'medium', status: 'inProgress', points: 250, platform: 'Pwnable.tw', tags: ['ROP', 'ASLR'] },
    { id: '5', name: 'VulnHub - Kioptrix Level 1', type: 'web', difficulty: 'easy', status: 'solved', points: 180, platform: 'VulnHub', tags: ['SMB', 'Kernel'] },
    { id: '6', name: 'Root-Me - ELF x86 Stack BOF', type: 'pwn', difficulty: 'medium', status: 'solved', points: 220, platform: 'Root-Me', tags: ['Stack', 'Ret2libc'] },
    { id: '7', name: 'PicoCTF - Reverse Engineering', type: 'reverse', difficulty: 'easy', status: 'solved', points: 120, platform: 'PicoCTF', tags: ['Ghidra', 'x86'] },
    { id: '8', name: 'HackTheBox - Pro Labs RastaLabs', type: 'web', difficulty: 'hard', status: 'unsolved', points: 500, platform: 'HackTheBox', tags: ['AD', 'BloodHound'] },
    { id: '9', name: 'CryptoHack - Introduction', type: 'crypto', difficulty: 'easy', status: 'solved', points: 80, platform: 'CryptoHack', tags: ['Python', 'Math'] },
    { id: '10', name: 'Pwnable.kr - Rookiss', type: 'pwn', difficulty: 'hard', status: 'inProgress', points: 400, platform: 'Pwnable.kr', tags: ['UAF', 'FSOP'] },
    { id: '11', name: 'TryHackMe - OWASP Top 10', type: 'web', difficulty: 'medium', status: 'solved', points: 300, platform: 'TryHackMe', tags: ['OWASP', 'Burp'] },
    { id: '12', name: 'Flare-On Challenge 2023', type: 'reverse', difficulty: 'insane', status: 'unsolved', points: 1000, platform: 'Flare-On', tags: ['VM', 'Obfuscation'] },
  ]

  const filtered = labs.filter(l => {
    if (filter !== 'all' && l.type !== filter) return false
    if (difficulty !== 'all' && l.difficulty !== difficulty) return false
    return true
  })

  const typeColors = {
    web: 'bg-blue-50 text-blue-700', pwn: 'bg-red-50 text-red-700', reverse: 'bg-orange-50 text-orange-700',
    crypto: 'bg-purple-50 text-purple-700', forensics: 'bg-amber-50 text-amber-700', misc: 'bg-gray-50 text-gray-700',
    blockchain: 'bg-emerald-50 text-emerald-700'
  }

  const diffColors = {
    easy: 'text-emerald-600', medium: 'text-amber-600', hard: 'text-orange-600', insane: 'text-red-600'
  }

  const statusIcons = {
    solved: '✅', inProgress: '🔄', unsolved: '⭕'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('labs.title')}</h1>
        <p className="text-sm text-obelisk-textMuted mt-1">{t('labs.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-obelisk-border text-sm">
          <option value="all">{t('aggregate.all')}</option>
          <option value="web">Web</option>
          <option value="pwn">Pwn</option>
          <option value="reverse">Reverse</option>
          <option value="crypto">Crypto</option>
          <option value="forensics">Forensics</option>
          <option value="misc">Misc</option>
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-obelisk-border text-sm">
          <option value="all">{t('labs.difficulty')}</option>
          <option value="easy">{t('labs.easy')}</option>
          <option value="medium">{t('labs.medium')}</option>
          <option value="hard">{t('labs.hard')}</option>
          <option value="insane">{t('labs.insane')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lab => (
          <div key={lab.id} className="glass-card rounded-2xl p-5 hover:bg-white/80 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[lab.type] || 'bg-gray-50'}`}>{lab.type.toUpperCase()}</span>
              <span className="text-lg">{statusIcons[lab.status]}</span>
            </div>
            <h3 className="font-semibold text-obelisk-line mb-1">{lab.name}</h3>
            <p className="text-xs text-obelisk-textMuted mb-3">{lab.platform}</p>
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className={diffColors[lab.difficulty]}>{t(`labs.${lab.difficulty}`)}</span>
              <span className="text-obelisk-textMuted">{lab.points} {t('labs.points')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lab.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-obelisk-textMuted">{t('labs.noLabs')}</div>
      )}
    </div>
  )
}
