import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Target, CheckCircle2, Circle as CircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CircleRange = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', platform: '', status: 'in-progress', notes: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'circle'), where('type', '==', 'range'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const addItem = async () => {
    if (!db || !newItem.title.trim()) return;
    await addDoc(collection(db, 'circle'), {
      ...newItem, type: 'range',
      authorId: user?.uid, authorName: user?.displayName || 'Anonymous',
      createdAt: serverTimestamp(),
    });
    setNewItem({ title: '', platform: '', status: 'in-progress', notes: '' });
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
          <h1 className="text-2xl font-light tracking-wide">{t('circle.range.title')}</h1>
        </div>
        <p className="text-black/40">{t('circle.range.desc')}</p>
      </motion.div>

      {user && (
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4" />Add Record
        </button>
      )}

      {showAdd && (
        <GlassCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input placeholder="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="input-field" />
            <input placeholder="Platform (e.g. HackTheBox)" value={newItem.platform} onChange={e => setNewItem({...newItem, platform: e.target.value})} className="input-field" />
            <select value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})} className="input-field">
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <textarea placeholder="Notes" value={newItem.notes} onChange={e => setNewItem({...newItem, notes: e.target.value})} className="input-field w-full min-h-[80px] resize-none mb-3" />
          <button onClick={addItem} className="btn-primary text-xs">Save</button>
        </GlassCard>
      )}

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard className="group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-black/30 shrink-0 mt-0.5" /> : <CircleIcon className="w-5 h-5 text-black/20 shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-black/40 mt-0.5">{item.platform}</div>
                      {item.notes && <p className="text-xs text-black/50 mt-2">{item.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 ${item.status==='completed'?'bg-black text-white':'bg-black/5'}`}>{item.status}</span>
                    {user?.uid === item.authorId && (
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-black/5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-black/30" /></button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          {items.length === 0 && <GlassCard className="text-center py-12 text-black/30">No records yet</GlassCard>}
        </div>
      )}
    </div>
  );
};