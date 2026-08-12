import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MessageSquare, PenLine } from 'lucide-react';

export const BeiKeMine = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!user || !status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user, status.initialized]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center pt-24">
        <p className="text-black/40">{t('beike.loginToView')}</p>
        <Link to="/" className="btn-primary mt-4 inline-block">{t('auth.login')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.beike')}</h1>
        <div className="flex gap-4 text-sm text-black/40">
          <Link to="/beike" className="hover:text-black transition">{t('beike.discover')}</Link>
          <Link to="/beike/following" className="hover:text-black transition">{t('beike.following')}</Link>
          <Link to="/beike/mine" className="text-black font-medium">{t('beike.mine')}</Link>
          <Link to="/beike/topics" className="hover:text-black transition">{t('beike.topics')}</Link>
        </div>
      </motion.div>

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : posts.length === 0 ? (
        <GlassCard className="text-center py-20">
          <PenLine className="w-8 h-8 mx-auto mb-3 text-black/10" />
          <p className="text-black/40">{t('beike.mineEmpty')}</p>
          <Link to="/beike" className="btn-secondary text-xs mt-4 inline-block">{t('beike.goPost')}</Link>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard>
                <p className="text-sm leading-relaxed">{post.content}</p>
                <div className="text-[10px] text-black/30 mt-2">{post.createdAt?.toDate?.().toLocaleString?.() || 'Just now'}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};