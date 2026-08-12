import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CircleNotes = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: '', content: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'circle'), where('type', '==', 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const addItem = async () => {
    if (!db || !newItem.title.trim()) return;
    await addDoc(collection(db, 'circle'), {
      ...newItem, type: 'notes',
      authorId: user?.uid, authorName: user?.displayName || 'Anonymous',
      createdAt: serverTimestamp(),
    });
    setNewItem({ title: '', category: '', content: '' });
    setShowAdd(false);
  };

  const deleteItem = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return;
    await deleteDoc(doc(db, 'circle', id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/circle" className="text-sm text-black/40 hover:text-black transition">{t('nav.circle')}</Link>
          <span className="text-black/20">/</span>
          <h1 className="text-2xl font-light tracking-wide">{t('circle.notes.title')}</h1>
        </div>
        <p className="text-black/40">{t('circle.notes.desc')}</p>
      </motion.div>

      {user && (
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4" />Add Note
        </button>
      )}

      {showAdd && (
        <GlassCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input placeholder="Note Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="input-field" />
            <input placeholder="Category (e.g. Reverse Engineering)" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="input-field" />
          </div>
          <textarea placeholder="Content (Markdown supported in future)" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="input-field w-full min-h-[120px] resize-none mb-3" />
          <button onClick={addItem} className="btn-primary text-xs">Save</button>
        </GlassCard>
      )}

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard className="h-full group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-5 h-5 text-black/30" />
                  {user?.uid === item.authorId && (
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-black/5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-black/30" /></button>
                  )}
                </div>
                <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                {item.category && <div className="text-[10px] bg-black/5 px-2 py-0.5 inline-block mb-2">{item.category}</div>}
                <p className="text-xs text-black/50 whitespace-pre-wrap">{item.content}</p>
              </GlassCard>
            </motion.div>
          ))}
          {items.length === 0 && <GlassCard className="text-center py-12 text-black/30 md:col-span-2">No notes yet</GlassCard>}
        </div>
      )}
    </div>
  );
};