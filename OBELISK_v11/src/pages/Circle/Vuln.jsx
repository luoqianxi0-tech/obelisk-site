import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { db, getFirebaseInitStatus } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CircleVuln = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', cve: '', severity: 'medium', description: '', reproduction: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'circle'), where('type', '==', 'vuln'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const addItem = async () => {
    if (!db || !newItem.title.trim()) return;
    await addDoc(collection(db, 'circle'), {
      ...newItem, type: 'vuln',
      authorId: user?.uid, authorName: user?.displayName || 'Anonymous',
      createdAt: serverTimestamp(),
    });
    setNewItem({ title: '', cve: '', severity: 'medium', description: '', reproduction: '' });
    setShowAdd(false);
  };

  const deleteItem = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return;
    await deleteDoc(doc(db, 'circle', id));
  };

  const severityColor = (s) => {
    if (s === 'critical') return 'bg-black text-white';
    if (s === 'high') return 'bg-black/80 text-white';
    if (s === 'medium') return 'bg-black/40 text-white';
    return 'bg-black/10';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/circle" className="text-sm text-black/40 hover:text-black transition">{t('nav.circle')}</Link>
          <span className="text-black/20">/</span>
          <h1 className="text-2xl font-light tracking-wide">{t('circle.vuln.title')}</h1>
        </div>
        <p className="text-black/40">{t('circle.vuln.desc')}</p>
      </motion.div>

      {user && (
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4" />Add Vuln
        </button>
      )}

      {showAdd && (
        <GlassCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input placeholder="Vulnerability Name" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="input-field" />
            <input placeholder="CVE ID" value={newItem.cve} onChange={e => setNewItem({...newItem, cve: e.target.value})} className="input-field" />
            <select value={newItem.severity} onChange={e => setNewItem({...newItem, severity: e.target.value})} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="input-field w-full min-h-[60px] resize-none mb-3" />
          <textarea placeholder="Reproduction Steps" value={newItem.reproduction} onChange={e => setNewItem({...newItem, reproduction: e.target.value})} className="input-field w-full min-h-[80px] resize-none mb-3" />
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
                    <AlertTriangle className="w-5 h-5 text-black/30 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      {item.cve && <div className="text-xs text-black/40 font-mono mt-0.5">{item.cve}</div>}
                      <p className="text-xs text-black/50 mt-2">{item.description}</p>
                      {item.reproduction && (
                        <div className="mt-2 p-2 bg-black/5 rounded text-xs font-mono text-black/60 whitespace-pre-wrap">{item.reproduction}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 ${severityColor(item.severity)}`}>{item.severity}</span>
                    {user?.uid === item.authorId && (
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-black/5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-black/30" /></button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          {items.length === 0 && <GlassCard className="text-center py-12 text-black/30">No vuln records yet</GlassCard>}
        </div>
      )}
    </div>
  );
};