import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, Hash, Send, TrendingUp, Users, User, Sparkles, AlertTriangle } from 'lucide-react';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';

const MOCK_POSTS = [
  {
    id: 'mock-1',
    content: '欢迎使用 OBELISK ✨ 当前 Firebase 尚未配置，这是示例帖子。\n在项目根目录创建 .env 文件并填入真实凭证后即可解锁完整功能。',
    authorId: 'demo',
    authorName: 'OBELISK Team',
    authorPhoto: '',
    tags: ['公告', '入门指南'],
    imageUrl: null,
    likes: [],
    comments: 0,
    bookmarks: [],
    createdAt: { toDate: () => new Date() },
  },
  {
    id: 'mock-2',
    content: '碑刻功能支持标签、图片、点赞和收藏，快去登录后发布你的第一条动态吧！',
    authorId: 'demo',
    authorName: 'OBELISK Team',
    authorPhoto: '',
    tags: ['功能介绍'],
    imageUrl: null,
    likes: [],
    comments: 0,
    bookmarks: [],
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) },
  },
];

export const BeiKe = () => {
  const { user, firebaseConfigured } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const status = getFirebaseInitStatus();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let unsub = null;

    if (!firebaseConfigured || !status.initialized || !db) {
      setPosts(MOCK_POSTS);
      setLoading(false);
      setError('FIREBASE_OFFLINE');
      return;
    }

    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      unsub = onSnapshot(q, (snap) => {
        if (cancelled) return;
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPosts(items);
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error('[BeiKe] Posts error:', err);
        if (cancelled) return;
        setLoading(false);
        setError(err.message || 'SNAPSHOT_ERROR');
        setPosts(MOCK_POSTS);
      });
    } catch (err) {
      console.error('[BeiKe] Query setup error:', err);
      if (cancelled) return;
      setLoading(false);
      setError(err.message || 'QUERY_ERROR');
      setPosts(MOCK_POSTS);
    }

    return () => {
      cancelled = true;
      try { unsub && unsub(); } catch (e) { /* noop */ }
    };
  }, [firebaseConfigured, status.initialized]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const submitPost = async () => {
    if (!user || !newPost.trim() || posting) return;
    if (!db) {
      alert('Firebase 未配置，离线模式下无法发布帖子');
      return;
    }
    setPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost.trim(),
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        tags,
        imageUrl: imageUrl.trim() || null,
        likes: [],
        comments: 0,
        bookmarks: [],
        createdAt: serverTimestamp(),
      });
      setNewPost('');
      setTags([]);
      setImageUrl('');
    } catch (err) {
      console.error('[BeiKe] Post error:', err);
      alert('发布失败：' + (err.message || '未知错误'));
    }
    setPosting(false);
  };

  const toggleLike = async (post) => {
    if (!user || !db) return;
    try {
      const ref = doc(db, 'posts', post.id);
      const liked = post.likes?.includes(user.uid);
      await updateDoc(ref, {
        likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) {
      console.error('[BeiKe] Like error:', err);
    }
  };

  const toggleBookmark = async (post) => {
    if (!user || !db) return;
    try {
      const ref = doc(db, 'posts', post.id);
      const bookmarked = post.bookmarks?.includes(user.uid);
      await updateDoc(ref, {
        bookmarks: bookmarked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) {
      console.error('[BeiKe] Bookmark error:', err);
    }
  };

  const tabs = [
    { path: '/beike', label: t('beike.discover'), icon: TrendingUp },
    { path: '/beike/following', label: t('beike.following'), icon: Users },
    { path: '/beike/mine', label: t('beike.mine'), icon: User },
    { path: '/beike/topics', label: t('beike.topics'), icon: Hash },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light tracking-wide">{t('nav.beike')}</h1>
        <Sparkles className="w-5 h-5 text-black/20" />
      </div>

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

      {error && (
        <GlassCard className="mb-6 border-l-2 border-amber-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-1">当前为离线演示模式</div>
              <p className="text-xs text-black/50 leading-relaxed">
                Firebase 未正确配置或连接失败，页面显示的是本地示例数据。请在 .env 中填入真实凭证后刷新以启用发布、点赞等实时功能。
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {user && (
        <GlassCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full border border-black/10" />
            <div className="text-sm text-black/40">{user.displayName}</div>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t('beike.placeholder')}
            className="w-full p-4 bg-white/30 border border-black/5 rounded resize-none focus:outline-none focus:border-black/20 text-sm min-h-[100px]"
          />
          {imageUrl && (
            <div className="mt-3 p-2 bg-white/40 rounded border border-black/5">
              <img src={imageUrl} alt="preview" className="max-h-48 rounded object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {tags.map(tag => (
              <span key={tag} className="text-xs bg-black/5 px-2 py-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> {tag}
              </span>
            ))}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder={t('beike.addTag')} className="input-field flex-1 text-xs" />
              <button onClick={addTag} className="btn-secondary text-xs">{t('common.add')}</button>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder={t('beike.imageUrl')} className="input-field text-xs w-40" />
              <button onClick={submitPost} disabled={!newPost.trim() || posting || !db}
                className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" /> {posting ? '...' : t('beike.post')}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-20 text-black/30">{t('common.loading')}</div>
      ) : posts.length === 0 ? (
        <GlassCard className="text-center py-20">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-black/15" />
          <p className="text-black/40">{t('beike.empty')}</p>
          <p className="text-sm text-black/30 mt-2">{t('beike.emptyHint')}</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div key={post.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassCard className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <img src={post.authorPhoto || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full border border-black/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{post.authorName}</span>
                        <span className="text-xs text-black/30">
                          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt="" className="max-h-80 rounded-lg mb-3 object-cover w-full" onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-xs text-black/50 bg-black/5 px-2 py-1">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-6 pt-3 border-t border-black/5">
                        <button onClick={() => toggleLike(post)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${post.likes?.includes(user?.uid) ? 'text-black' : 'text-black/40 hover:text-black'}`}>
                          <Heart className={`w-4 h-4 ${post.likes?.includes(user?.uid) ? 'fill-black' : ''}`} /> {post.likes?.length || 0}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors">
                          <MessageCircle className="w-4 h-4" /> {post.comments || 0}
                        </button>
                        <button onClick={() => toggleBookmark(post)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${post.bookmarks?.includes(user?.uid) ? 'text-black' : 'text-black/40 hover:text-black'}`}>
                          <Bookmark className={`w-4 h-4 ${post.bookmarks?.includes(user?.uid) ? 'fill-black' : ''}`} /> {post.bookmarks?.length || 0}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors ml-auto">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
