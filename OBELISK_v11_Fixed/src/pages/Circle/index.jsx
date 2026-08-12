import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { Target, FolderGit2, AlertTriangle, BookOpen, ArrowRight } from 'lucide-react';

const sections = [
  { icon: Target, title: 'circle.range.title', desc: 'circle.range.desc', path: '/circle/range', color: 'border-black' },
  { icon: FolderGit2, title: 'circle.projects.title', desc: 'circle.projects.desc', path: '/circle/projects', color: 'border-black/60' },
  { icon: AlertTriangle, title: 'circle.vuln.title', desc: 'circle.vuln.desc', path: '/circle/vuln', color: 'border-black/40' },
  { icon: BookOpen, title: 'circle.notes.title', desc: 'circle.notes.desc', path: '/circle/notes', color: 'border-black/20' },
];

export const Circle = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.circle')}</h1>
        <p className="text-black/40">{t('circle.subtitle')}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <Link key={section.path} to={section.path}>
            <GlassCard delay={i * 0.08} className={`h-full group ${section.color} border-l-2 hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-4">
                <section.icon className="w-6 h-6 text-black/40" />
                <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-black/60 transition-colors" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t(section.title)}</h3>
              <p className="text-sm text-black/40 leading-relaxed">{t(section.desc)}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
};