import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { FolderGit2, Bug, BookOpen, ArrowRight } from 'lucide-react';

export const Circle = () => {
  const { t } = useTranslation();
  const sections = [
    { path: '/circle/projects', icon: FolderGit2, title: t('circle.projects.title'), desc: t('circle.projects.desc'), color: 'bg-black/5' },
    { path: '/circle/vuln', icon: Bug, title: t('circle.vuln.title'), desc: t('circle.vuln.desc'), color: 'bg-black/5' },
    { path: '/circle/notes', icon: BookOpen, title: t('circle.notes.title'), desc: t('circle.notes.desc'), color: 'bg-black/5' },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.circle')}</h1>
        <p className="text-black/40">{t('circle.subtitle')}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div key={section.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={section.path}>
              <GlassCard className="h-full group hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${section.color} border border-black/10 flex items-center justify-center`}>
                      <section.icon className="w-7 h-7 text-black/50" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">{section.title}</h3>
                      <p className="text-sm text-black/40 mt-1">{section.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs text-black/30">{t('circle.enter')}</span>
                  <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-black/60 transition-colors" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};