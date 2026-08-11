import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link } from 'react-router-dom';
import { Target, ArrowLeft, Calendar, Flag, CheckCircle, Clock, Trophy } from 'lucide-react';

const mockRanges = [
  { id: 1, title: 'Hack The Box - Starting Point', platform: 'Hack The Box', date: '2024-01-15', difficulty: 'Easy', status: 'completed', tags: ['Linux', 'Privilege Escalation'], rating: 5 },
  { id: 2, title: 'TryHackMe - Blue', platform: 'TryHackMe', date: '2024-02-20', difficulty: 'Easy', status: 'completed', tags: ['Windows', 'EternalBlue'], rating: 4 },
  { id: 3, title: 'VulnHub - Kioptrix Level 1', platform: 'VulnHub', date: '2024-03-10', difficulty: 'Medium', status: 'completed', tags: ['Samba', 'Buffer Overflow'], rating: 5 },
  { id: 4, title: 'Hack The Box - Bashed', platform: 'Hack The Box', date: '2024-04-05', difficulty: 'Easy', status: 'in-progress', tags: ['PHP', 'Cron'], rating: 3 },
  { id: 5, title: 'TryHackMe - RootMe', platform: 'TryHackMe', date: '2024-05-12', difficulty: 'Easy', status: 'completed', tags: ['Web', 'Upload'], rating: 4 },
  { id: 6, title: 'PentesterLab - XXE', platform: 'PentesterLab', date: '2024-06-01', difficulty: 'Medium', status: 'completed', tags: ['XML', 'XXE'], rating: 5 },
  { id: 7, title: 'Hack The Box - Lame', platform: 'Hack The Box', date: '2024-06-15', difficulty: 'Easy', status: 'completed', tags: ['Samba', 'CVE-2007-2447'], rating: 4 },
  { id: 8, title: 'TryHackMe - Wreath', platform: 'TryHackMe', date: '2024-06-20', difficulty: 'Hard', status: 'in-progress', tags: ['Pivoting', 'AD'], rating: 5 },
];

const difficultyColor = {
  Easy: 'bg-black/10 text-black/60',
  Medium: 'bg-black/30 text-white',
  Hard: 'bg-black text-white',
};

export const CircleRange = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockRanges : mockRanges.filter(r => r.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/circle" className="p-2 hover:bg-black/5 rounded transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-3xl font-light tracking-wide">{t('circle.range.title')}</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'completed', 'in-progress'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm border transition-colors ${
              filter === f ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'
            }`}>
            {t(`circle.filter.${f}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-black/5 px-2 py-1">{item.platform}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 ${difficultyColor[item.difficulty]}`}>{item.difficulty}</span>
                  {item.status === 'completed' ? <CheckCircle className="w-4 h-4 text-black/30" /> : <Clock className="w-4 h-4 text-black/30" />}
                </div>
              </div>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <div className="flex items-center gap-2 text-xs text-black/40 mb-3">
                <Calendar className="w-3 h-3" /> {item.date}
              </div>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Trophy key={i} className={`w-3 h-3 ${i < item.rating ? 'text-black/60' : 'text-black/10'}`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => <span key={tag} className="text-xs bg-black/5 px-2 py-1">{tag}</span>)}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
