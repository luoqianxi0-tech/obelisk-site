import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/GlassCard';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Users, User, Hash, Heart, MessageCircle, Bookmark, UserPlus } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const BeiKeFollowing = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  const tabs = [
    { path: '/beike', label: t('beike.discover'), icon: TrendingUp },
    { path: '/beike/following', label: t('beike.following'), icon: Users },
    { path: '/beike/mine', label: t('beike.mine'), icon: User },
    { path: '/beike/topics', label: t('beike.topics'), icon: Hash },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light tracking-wide mb-8">{t('beike.following')}</h1>
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
      {!user ? (
        <GlassCard className="text-center py-20">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-black/15" />
          <p className="text-black/40">{t('beike.loginToView')}</p>
        </GlassCard>
      ) : loading ? (
        <div className="text-center py-20 text-black/30">{t('common.loading')}</div>
      ) : posts.length === 0 ? (
        <GlassCard className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-4 text-black/15" />
          <p className="text-black/40">{t('beike.followingEmpty')}</p>
          <p className="text-sm text-black/30 mt-2">Follow more users to see their posts here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <GlassCard key={post.id}>
              <div className="flex items-start gap-3">
                <img src={post.authorPhoto || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full border border-black/10 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.authorName}</span>
                    <span className="text-xs text-black/30">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="" className="max-h-80 rounded-lg mb-3 object-cover w-full" />}
                  <div className="flex items-center gap-6 pt-3 border-t border-black/5">
                    <span className="flex items-center gap-1 text-xs text-black/40"><Heart className="w-4 h-4" /> {post.likes?.length || 0}</span>
                    <span className="flex items-center gap-1 text-xs text-black/40"><MessageCircle className="w-4 h-4" /> {post.comments || 0}</span>
                    <span className="flex items-center gap-1 text-xs text-black/40"><Bookmark className="w-4 h-4" /> {post.bookmarks?.length || 0}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
