import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { MessageSquare, Heart, Share2, Send, Image as ImageIcon, Hash, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BeiKe = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const handlePost = async () => {
    if (!user || !db || !content.trim() || posting) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: imageUrl.trim() || null,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      setContent(''); setTags(''); setImageUrl('');
    } catch (e) { alert('Post failed: ' + e.message); }
    setPosting(false);
  };

  const toggleLike = async (post) => {
    if (!user || !db) return;
    const liked = post.likes?.includes(user.uid);
    const ref = doc(db, 'posts', post.id);
    await updateDoc(ref, { likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
  };

  const addComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!user || !db || !text) return;
    const ref = doc(db, 'posts', postId);
    await updateDoc(ref, {
      comments: arrayUnion({
        id: Date.now().toString(),
        text, authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
      })
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.beike')}</h1>
        <div className="flex gap-4 text-sm text-black/40">
          <Link to="/beike" className="text-black font-medium">{t('beike.discover')}</Link>
          <Link to="/beike/following" className="hover:text-black transition">{t('beike.following')}</Link>
          <Link to="/beike/mine" className="hover:text-black transition">{t('beike.mine')}</Link>
          <Link to="/beike/topics" className="hover:text-black transition">{t('beike.topics')}</Link>
        </div>
      </motion.div>

      {user && (
        <GlassCard className="mb-8">
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('beike.placeholder')}
            className="w-full bg-transparent border-b border-black/5 pb-3 text-sm focus:outline-none resize-none min-h-[80px]" />
          <div className="flex items-center gap-2 mt-3">
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder={t('beike.addTag')} className="input-field flex-1 text-xs" />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder={t('beike.imageUrl')} className="input-field flex-1 text-xs" />
            <button onClick={handlePost} disabled={!content.trim() || posting} className="btn-primary text-xs flex items-center gap-1">
              {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}{t('beike.post')}
            </button>
          </div>
        </GlassCard>
      )}

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : posts.length === 0 ? (
        <GlassCard className="text-center py-20">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-black/10" />
          <p className="text-black/40">{t('beike.empty')}</p>
          <p className="text-xs text-black/30 mt-1">{t('beike.emptyHint')}</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <img src={post.authorPhoto || 'https://via.placeholder.com/32'} alt="" className="w-8 h-8 rounded-full border border-black/10" />
                  <div>
                    <div className="text-sm font-medium">{post.authorName}</div>
                    <div className="text-[10px] text-black/30">{post.createdAt?.toDate?.().toLocaleString?.() || 'Just now'}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="" className="w-full rounded-lg mb-3 bg-black/5 max-h-80 object-cover" />}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map(tag => <span key={tag} className="text-[10px] bg-black/5 px-2 py-0.5 flex items-center gap-1"><Hash className="w-2.5 h-2.5" />{tag}</span>)}
                  </div>
                )}
                <div className="flex items-center gap-4 pt-3 border-t border-black/5">
                  <button onClick={() => toggleLike(post)} className="flex items-center gap-1 text-xs text-black/40 hover:text-black transition">
                    <Heart className={`w-4 h-4 ${post.likes?.includes(user?.uid) ? 'fill-black text-black' : ''}`} />
                    {post.likes?.length || 0}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-black/40">
                    <MessageSquare className="w-4 h-4" />{post.comments?.length || 0}
                  </span>
                </div>
                {post.comments?.length > 0 && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-black/5">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <div className="text-xs font-medium shrink-0">{c.authorName}</div>
                        <div className="text-xs text-black/60">{c.text}</div>
                      </div>
                    ))}
                  </div>
                )}
                {user && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/5">
                    <input value={commentInputs[post.id] || ''} onChange={e => setCommentInputs(prev => ({...prev, [post.id]: e.target.value}))}
                      placeholder={t('beike.addComment')} className="input-field flex-1 text-xs" />
                    <button onClick={() => addComment(post.id)} className="p-1.5 hover:bg-black/5 rounded transition"><Send className="w-3.5 h-3.5 text-black/30" /></button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};