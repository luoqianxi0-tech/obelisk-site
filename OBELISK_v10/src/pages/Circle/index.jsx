import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { Target, FolderGit2, Bug, BookOpen, ArrowRight, BarChart3 } from 'lucide-react';

export const Circle = () => {
  const { t } = useTranslation();

  const sections = [
    { path: '/circle/range', icon: Target, title: t('circle.range.title'), desc: t('circle.range.desc'), count: '24', color: 'bg-black/5' },
    { path: '/circle/projects', icon: FolderGit2, title: t('circle.projects.title'), desc: t('circle.projects.desc'), count: '12', color: 'bg-black/5' },
    { path: '/circle/vuln', icon: Bug, title: t('circle.vuln.title'), desc: t('circle.vuln.desc'), count: '8', color: 'bg-black/5' },
    { path: '/circle/notes', icon: BookOpen, title: t('circle.notes.title'), desc: t('circle.notes.desc'), count: '36', color: 'bg-black/5' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.circle')}</h1>
        <p className="text-black/40">{t('circle.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div key={section.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={section.path}>
              <GlassCard className="h-full group hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${section.color} border border-black/10 flex items-center justify-center`}>
                      <section.icon className="w-7 h-7 text-black/50" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">{section.title}</h3>
                      <p className="text-sm text-black/40 mt-1">{section.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-light">{section.count}</div>
                    <div className="text-xs text-black/30">{t('circle.items')}</div>
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

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16">
        <div className="flex items-center gap-6 mb-8">
          <h2 className="text-xl font-light tracking-wide whitespace-nowrap">Activity Overview</h2>
          <div className="flex-1 h-[1px] bg-black/10" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Writeups', value: '80', icon: BarChart3 },
            { label: 'This Month', value: '12', icon: Target },
            { label: 'Contributors', value: '15', icon: FolderGit2 },
            { label: 'Avg Rating', value: '4.8', icon: BookOpen },
          ].map((stat, i) => (
            <GlassCard key={stat.label} delay={i * 0.05} className="text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-black/25" />
              <div className="text-2xl font-light">{stat.value}</div>
              <div className="text-xs text-black/40 mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
