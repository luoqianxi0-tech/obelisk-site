import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Clock, Tag, Search } from 'lucide-react';

const mockNotes = [
  { id: 1, title: 'Frida Hook 基础教程', category: 'Mobile', tags: ['Frida', 'Android', 'Hook'], date: '2024-06-20', readTime: '15 min', content: 'Frida是一个动态代码插桩工具，可以在运行时修改应用行为...' },
  { id: 2, title: 'Wireshark 流量分析实战', category: 'Network', tags: ['Wireshark', 'PCAP', 'Analysis'], date: '2024-06-18', readTime: '20 min', content: 'Wireshark是最强大的网络协议分析工具之一...' },
  { id: 3, title: 'Ghidra 反编译入门', category: 'Reverse', tags: ['Ghidra', 'RE', 'Static'], date: '2024-06-15', readTime: '30 min', content: 'Ghidra是由NSA开发的开源软件逆向工程框架...' },
  { id: 4, title: 'Docker 安全最佳实践', category: 'DevSecOps', tags: ['Docker', 'Security', 'Container'], date: '2024-06-10', readTime: '12 min', content: '容器安全是现代DevOps流程中不可忽视的一环...' },
  { id: 5, title: 'Burp Suite 插件开发', category: 'Web', tags: ['Burp', 'Java', 'Extension'], date: '2024-06-05', readTime: '25 min', content: 'Burp Suite提供了强大的API用于开发自定义插件...' },
  { id: 6, title: 'Linux 提权技术总结', category: 'Linux', tags: ['Privilege', 'Escalation', 'Linux'], date: '2024-06-01', readTime: '18 min', content: 'Linux提权是渗透测试中的核心技能之一...' },
  { id: 7, title: 'Windows 内核调试指南', category: 'Windows', tags: ['Kernel', 'WinDbg', 'Driver'], date: '2024-05-28', readTime: '35 min', content: 'Windows内核调试是逆向工程的高级主题...' },
  { id: 8, title: 'ARM 汇编速查手册', category: 'Mobile', tags: ['ARM', 'Assembly', 'Mobile'], date: '2024-05-20', readTime: '10 min', content: 'ARM架构在移动设备中占据主导地位...' },
];

const categories = ['All', 'Mobile', 'Network', 'Reverse', 'DevSecOps', 'Web', 'Linux', 'Windows'];

export const CircleNotes = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = mockNotes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === 'All' || n.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/circle" className="p-2 hover:bg-black/5 rounded transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-3xl font-light tracking-wide">{t('circle.notes.title')}</h1>
      </div>

      <GlassCard className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..." className="w-full pl-10 pr-4 py-2 bg-white/30 border border-black/5 text-sm focus:outline-none focus:border-black/20" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs whitespace-nowrap border transition-colors ${activeCategory === cat ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-black/5 px-2 py-1">{item.category}</span>
                <BookOpen className="w-4 h-4 text-black/15 group-hover:text-black/30 transition-colors" />
              </div>
              <h3 className="font-medium mb-3 group-hover:underline decoration-1 underline-offset-4">{item.title}</h3>
              <p className="text-sm text-black/40 mb-4 line-clamp-2">{item.content}</p>
              <div className="flex items-center gap-4 text-xs text-black/30 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readTime}</span>
                <span>{item.date}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => <span key={tag} className="text-xs flex items-center gap-1 text-black/40"><Tag className="w-2 h-2" /> {tag}</span>)}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-black/30">No notes found.</div>
      )}
    </div>
  );
};
