import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, BookOpen, FolderGit2, Clock, Settings, LogIn } from 'lucide-react';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [myPosts, setMyPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, tools: 0, notes: 0, projects: 0 });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!user || !status.initialized || !db) return;
    const q = query(collection(db, 'posts'), where('authorId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyPosts(posts);
      setStats(s => ({ ...s, posts: posts.length }));
    });
    return () => unsub();
  }, [user, status.initialized]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center pt-24">
        <div className="text-5xl font-light tracking-[0.2em] mb-6">OBELISK</div>
        <p className="text-black/40 mb-8">{t('profile.pleaseLogin')}</p>
        <Link to="/" className="btn-primary">{t('auth.login')}</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('profile.myPosts'), icon: MessageSquare },
    { id: 'settings', label: t('profile.settings'), icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <img src={user.photoURL || 'https://via.placeholder.com/80'} alt="" className="w-16 h-16 rounded-full border border-black/10" />
          <div>
            <h1 className="text-2xl font-light tracking-wide flex items-center gap-2">
              {user.displayName}
              {isAdmin && <span className="text-[10px] bg-black text-white px-2 py-0.5 tracking-wider">{t('auth.adminBadge')}</span>}
            </h1>
            <p className="text-sm text-black/40">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-1 border-b border-black/10 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors -mb-[1px] ${activeTab===tab.id?'border-black text-black font-medium':'border-transparent text-black/40 hover:text-black/60'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: t('profile.posts'), value: stats.posts, icon: MessageSquare },
                { label: t('profile.tools'), value: stats.tools, icon: Shield },
                { label: t('profile.notes'), value: stats.notes, icon: BookOpen },
                { label: t('profile.projects'), value: stats.projects, icon: FolderGit2 },
              ].map((stat, i) => (
                <GlassCard key={stat.label} delay={i * 0.05} className="text-center">
                  <div className="text-2xl font-light">{stat.value}</div>
                  <div className="text-xs text-black/40 mt-1">{stat.label}</div>
                </GlassCard>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-black/60 mb-2">Quick Access</h3>
              <Link to="/login-history">
                <GlassCard className="flex items-center gap-3 hover:shadow-md transition-shadow mb-3">
                  <Clock className="w-5 h-5 text-black/30" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t('loginHistory.title')}</div>
                    <div className="text-xs text-black/40">View your recent login activity</div>
                  </div>
                </GlassCard>
              </Link>
              <Link to="/settings">
                <GlassCard className="flex items-center gap-3 hover:shadow-md transition-shadow">
                  <Settings className="w-5 h-5 text-black/30" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t('nav.settings')}</div>
                    <div className="text-xs text-black/40">Language, PWA install, and more</div>
                  </div>
                </GlassCard>
              </Link>
            </div>

            {myPosts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-black/60 mb-3">{t('profile.myPosts')}</h3>
                <div className="space-y-3">
                  {myPosts.map(post => (
                    <GlassCard key={post.id} className="hover:shadow-md transition-shadow">
                      <p className="text-sm">{post.content}</p>
                      <div className="text-xs text-black/30 mt-2">{post.timestamp?.toDate?.().toLocaleString?.() || post.timestamp}</div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <GlassCard>
              <h3 className="text-sm font-medium mb-3">Account</h3>
              <div className="space-y-2 text-sm text-black/60">
                <div className="flex justify-between"><span>Email</span><span>{user.email}</span></div>
                <div className="flex justify-between"><span>UID</span><span className="font-mono text-xs">{user.uid}</span></div>
                <div className="flex justify-between"><span>Admin</span><span>{isAdmin ? 'Yes' : 'No'}</span></div>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </div>
  );
};