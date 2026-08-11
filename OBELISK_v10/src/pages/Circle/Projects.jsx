import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link } from 'react-router-dom';
import { FolderGit2, ArrowLeft, Github, ExternalLink, Star, GitBranch } from 'lucide-react';

const mockProjects = [
  { id: 1, title: 'OBELISK Platform', desc: '极客资源整合与社交平台，支持社交、资源管理、Agent监控', tech: ['React', 'Firebase', 'Vite', 'Tailwind'], github: 'https://github.com', demo: 'https://obelisk.vercel.app', stars: 128, forks: 32 },
  { id: 2, title: 'Android Hook Framework', desc: '基于Frida的动态分析框架，支持Java/Native层Hook', tech: ['Python', 'Frida', 'Android', 'ADB'], github: 'https://github.com', demo: null, stars: 86, forks: 18 },
  { id: 3, title: 'Network Scanner', desc: '轻量级网络扫描工具，支持端口扫描、服务识别', tech: ['Go', 'libpcap', 'BPF'], github: 'https://github.com', demo: null, stars: 64, forks: 12 },
  { id: 4, title: 'CTF Toolkit', desc: 'CTF竞赛辅助工具集，包含编码解码、密码学工具', tech: ['Python', 'Flask', 'React'], github: 'https://github.com', demo: 'https://ctf-toolkit.vercel.app', stars: 245, forks: 56 },
  { id: 5, title: 'Web Fuzzer', desc: 'Web模糊测试工具，支持参数爆破、路径扫描', tech: ['Rust', 'Tokio'], github: 'https://github.com', demo: null, stars: 42, forks: 8 },
  { id: 6, title: 'Memory Forensics', desc: '内存取证分析工具，支持Volatility插件扩展', tech: ['Python', 'Volatility3'], github: 'https://github.com', demo: null, stars: 37, forks: 6 },
];

export const CircleProjects = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockProjects : mockProjects.filter(p => filter === 'demo' ? p.demo : !p.demo);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/circle" className="p-2 hover:bg-black/5 rounded transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-3xl font-light tracking-wide">{t('circle.projects.title')}</h1>
      </div>

      <div className="flex gap-2 mb-8">
        {['all', 'demo', 'repo'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm border transition-colors ${filter === f ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
            {f === 'all' ? 'All' : f === 'demo' ? 'With Demo' : 'Repo Only'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 border border-black/10 flex items-center justify-center">
                  <FolderGit2 className="w-6 h-6 text-black/30" />
                </div>
                <div className="flex gap-2">
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/5 rounded transition-colors">
                      <Github className="w-4 h-4 text-black/30" />
                    </a>
                  )}
                  {item.demo && (
                    <a href={item.demo} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/5 rounded transition-colors">
                      <ExternalLink className="w-4 h-4 text-black/30" />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-black/50 mb-4 leading-relaxed">{item.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tech.map(t => <span key={t} className="text-xs border border-black/10 px-2 py-1">{t}</span>)}
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-black/5 text-xs text-black/40">
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {item.stars}</span>
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {item.forks}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
