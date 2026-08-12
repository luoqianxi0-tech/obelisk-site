import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { MessageSquare, Target, FolderGit2, BookOpen, Wrench, Palette, HardDrive, ArrowUpRight } from 'lucide-react';

export const Home = () => {
  const { t } = useTranslation();

  const sections = [
    { icon: MessageSquare, title: t('home.beike.title'), desc: t('home.beike.desc'), path: '/beike', border: 'border-l-2 border-black' },
    { icon: Target, title: t('home.range.title'), desc: t('home.range.desc'), path: '/circle/range', border: 'border-l-2 border-black/60' },
    { icon: FolderGit2, title: t('home.projects.title'), desc: t('home.projects.desc'), path: '/circle/projects', border: 'border-l-2 border-black/40' },
    { icon: BookOpen, title: t('home.notes.title'), desc: t('home.notes.desc'), path: '/circle/notes', border: 'border-l-2 border-black/30' },
    { icon: Wrench, title: t('home.arsenal.title'), desc: t('home.arsenal.desc'), path: '/arsenal', border: 'border-l-2 border-black/20' },
    { icon: Palette, title: t('home.design.title'), desc: t('home.design.desc'), path: '/design', border: 'border-l-2 border-black/10' },
    { icon: HardDrive, title: t('home.storage.title'), desc: t('home.storage.desc'), path: '/storage', border: 'border-l-2 border-black/10' },
  ];

  const featured = [
    { title: 'Frida', desc: 'Dynamic instrumentation toolkit', url: 'https://frida.re' },
    { title: 'Ghidra', desc: 'Software reverse engineering framework', url: 'https://ghidra-sre.org' },
    { title: 'Burp Suite', desc: 'Web vulnerability scanner', url: 'https://portswigger.net/burp' },
    { title: 'Wireshark', desc: 'Network protocol analyzer', url: 'https://wireshark.org' },
    { title: 'Metasploit', desc: 'Penetration testing framework', url: 'https://metasploit.com' },
    { title: 'Nmap', desc: 'Network discovery and auditing', url: 'https://nmap.org' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 pt-24">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.15em] mb-8">OBELISK</h1>
        <div className="h-[1px] w-24 bg-black/20 mx-auto mb-8" />
        <p className="text-lg text-black/40 max-w-lg mx-auto leading-relaxed tracking-wide">{t('home.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {sections.map((section, i) => (
          <Link key={section.path} to={section.path}>
            <GlassCard delay={i * 0.08} className={`h-full group ${section.border} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-4">
                <section.icon className="w-5 h-5 text-black/40" />
                <ArrowUpRight className="w-4 h-4 text-black/20 group-hover:text-black/60 transition-colors" />
              </div>
              <h3 className="text-lg font-medium mb-2 group-hover:underline decoration-1 underline-offset-4">{section.title}</h3>
              <p className="text-sm text-black/40 leading-relaxed">{section.desc}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="text-xl font-light tracking-wide whitespace-nowrap">{t('home.featured')}</h2>
          <div className="flex-1 h-[1px] bg-black/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((tool, i) => (
            <GlassCard key={tool.title} delay={i * 0.05} className="flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-sm">{tool.title}</h4>
                <p className="text-xs text-black/40 mt-1">{tool.desc}</p>
              </div>
              <a href={tool.url} target="_blank" rel="noreferrer" className="text-xs border border-black/10 px-3 py-1.5 hover:bg-black hover:text-white transition-colors shrink-0 ml-4">
                {t('common.visit')}
              </a>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
};