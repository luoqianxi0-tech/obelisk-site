import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { File, Film, Image, Music, MessageCircle, Plus, Trash2 } from 'lucide-react';

const QQ_LINK = 'https://qm.qq.com/cgi-bin/qm/qr?k=YOUR_QQ_KEY';

const CATEGORIES = [
  { key: 'software', label: 'Software', icon: File },
  { key: 'video', label: 'Video', icon: Film },
  { key: 'image', label: 'Image', icon: Image },
  { key: 'audio', label: 'Audio', icon: Music },
];

export const Storage = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'software', desc: '', qqLink: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'downloads'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const addItem = async () => {
    if (!db || !newItem.name.trim()) return;
    await addDoc(collection(db, 'downloads'), {
      name: newItem.name, category: newItem.category, description: newItem.desc,
      qqLink: newItem.qqLink || QQ_LINK, authorId: user?.uid,
      authorName: user?.displayName || 'Anonymous', createdAt: serverTimestamp(),
    });
    setNewItem({ name: '', category: 'software', desc: '', qqLink: '' });
    setShowAdd(false);
  };

  const deleteItem = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return;
    await deleteDoc(doc(db, 'downloads', id));
  };

  const filtered = activeTab === 'all' ? items : items.filter(f => f.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('storage.title')}</h1>
        <p className="text-black/40">{t('storage.subtitle')}</p>
      </motion.div>
      {user && (
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2 mb-6">
          {showAdd ? 'Close' : <><Plus className="w-4 h-4" />Add Download</>}
        </button>
      )}
      {showAdd && (
        <GlassCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input placeholder="Resource Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="input-field" />
            <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="input-field">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <input placeholder="Description" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} className="input-field md:col-span-2" />
            <input placeholder="QQ Link (optional)" value={newItem.qqLink} onChange={e => setNewItem({...newItem, qqLink: e.target.value})} className="input-field md:col-span-2" />
          </div>
          <button onClick={addItem} className="btn-primary text-xs">Save</button>
        </GlassCard>
      )}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm border transition-colors ${activeTab==='all'?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>{t('circle.filter.all')}</button>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveTab(cat.key)} className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${activeTab===cat.key?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>
            <cat.icon className="w-4 h-4" />{cat.label}
          </button>
        ))}
      </div>
      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : filtered.length === 0 ? (
        <GlassCard className="text-center py-20">
          <p className="text-black/40">{t('storage.noFiles')}</p>
          <p className="text-xs text-black/30 mt-2">Contact admin via QQ to request resources</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard className="group hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-black/10 flex items-center justify-center">
                      {item.category==='video'?<Film className="w-5 h-5 text-black/30"/>:item.category==='image'?<Image className="w-5 h-5 text-black/30"/>:item.category==='audio'?<Music className="w-5 h-5 text-black/30"/>:<File className="w-5 h-5 text-black/30"/>}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate max-w-[180px]">{item.name}</div>
                      <div className="text-xs text-black/30 capitalize">{item.category}</div>
                    </div>
                  </div>
                  {(isAdmin || item.authorId === user?.uid) && (
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-black/5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-black/30" /></button>
                  )}
                </div>
                <p className="text-xs text-black/40 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-black/5">
                  <a href={item.qqLink || QQ_LINK} target="_blank" rel="noreferrer" className="btn-primary text-xs flex-1 text-center flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3" />Get via QQ
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};