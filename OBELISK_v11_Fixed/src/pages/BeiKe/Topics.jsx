import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';

export const BeiKeTopics = () => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const tagMap = {};
      snap.docs.forEach(d => {
        const data = d.data();
        (data.tags || []).forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      });
      setTopics(Object.entries(tagMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.beike')}</h1>
        <div className="flex gap-4 text-sm text-black/40">
          <Link to="/beike" className="hover:text-black transition">{t('beike.discover')}</Link>
          <Link to="/beike/following" className="hover:text-black transition">{t('beike.following')}</Link>
          <Link to="/beike/mine" className="hover:text-black transition">{t('beike.mine')}</Link>
          <Link to="/beike/topics" className="text-black font-medium">{t('beike.topics')}</Link>
        </div>
      </motion.div>

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : topics.length === 0 ? (
        <GlassCard className="text-center py-20">
          <Hash className="w-8 h-8 mx-auto mb-3 text-black/10" />
          <p className="text-black/40">{t('beike.topicsEmpty')}</p>
        </GlassCard>
      ) : (
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, i) => (
            <motion.div key={topic.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 glass text-sm hover:shadow-md transition-shadow cursor-pointer">
                <Hash className="w-3.5 h-3.5 text-black/30" />{topic.name}
                <span className="text-[10px] text-black/30">{topic.count}</span>
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};