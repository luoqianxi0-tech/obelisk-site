import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/GlassCard';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Users, User, Hash, Flame } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const BeiKeTopics = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map(d => d.data());
      const tagCounts = {};
      const tagLikes = {};
      posts.forEach(p => {
        (p.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          tagLikes[tag] = (tagLikes[tag] || 0) + (p.likes?.length || 0);
        });
      });
      const all = Object.entries(tagCounts).map(([name, count]) => ({ name, count, likes: tagLikes[name] || 0 }));
      setTopics(all.sort((a, b) => b.count - a.count));
      setTrending(all.sort((a, b) => b.likes - a.likes).slice(0, 5));
    });
    return unsub;
  }, []);

  const tabs = [
    { path: '/beike', label: t('beike.discover'), icon: TrendingUp },
    { path: '/beike/following', label: t('beike.following'), icon: Users },
    { path: '/beike/mine', label: t('beike.mine'), icon: User },
    { path: '/beike/topics', label: t('beike.topics'), icon: Hash },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light tracking-wide mb-8">{t('beike.topics')}</h1>
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-black/10">
        {tabs.map((tab) => (
          <Link key={tab.path} to={tab.path}
            className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors -mb-[1px] ${
              isActive(tab.path) ? 'border-black text-black font-medium' : 'border-transparent text-black/40 hover:text-black/60'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </Link>
        ))}
      </div>

      {trending.length > 0 && (
        <GlassCard className="mb-6">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-black/40" /> Trending</h3>
          <div className="flex flex-wrap gap-2">
            {trending.map((topic, i) => (
              <span key={topic.name} className="text-sm bg-black/5 px-3 py-1.5 flex items-center gap-2">
                <span className="text-xs text-black/30">#{i + 1}</span> #{topic.name}
                <span className="text-xs text-black/30">{topic.likes} likes</span>
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topics.length === 0 ? (
          <GlassCard className="col-span-full text-center py-20">
            <Hash className="w-12 h-12 mx-auto mb-4 text-black/15" />
            <p className="text-black/40">{t('beike.topicsEmpty')}</p>
          </GlassCard>
        ) : (
          topics.map((topic) => (
            <GlassCard key={topic.name} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <Hash className="w-8 h-8 mx-auto mb-3 text-black/20" />
              <h3 className="font-medium mb-1">#{topic.name}</h3>
              <p className="text-xs text-black/40">{topic.count} {t('beike.posts')} · {topic.likes} likes</p>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
