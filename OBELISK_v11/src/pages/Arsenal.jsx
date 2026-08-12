import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Plus, ExternalLink, Tag, X } from 'lucide-react';

export const Arsenal = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState({ name: '', url: '', description: '', tags: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const filtered = resources.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const addResource = async () => {
    if (!db || !newRes.name.trim() || !newRes.url.trim()) return;
    await addDoc(collection(db, 'resources'), {
      name: newRes.name, url: newRes.url, description: newRes.description,
      tags: newRes.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: serverTimestamp(), addedBy: user?.uid || 'anonymous',
    });
    setNewRes({ name: '', url: '', description: '', tags: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.arsenal')}</h1>
        <p className="text-black/40">{t('arsenal.subtitle')}</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('arsenal.search')} className="input-field w-full pl-10" />
        </div>
        {user && (
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{showAdd ? t('common.close') : t('arsenal.addResource')}
          </button>
        )}
      </div>

      {showAdd && (
        <GlassCard className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input placeholder={t('arsenal.resourceName')} value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} className="input-field" />
            <input placeholder={t('arsenal.resourceUrl')} value={newRes.url} onChange={e => setNewRes({...newRes, url: e.target.value})} className="input-field" />
            <input placeholder={t('arsenal.resourceDesc')} value={newRes.description} onChange={e => setNewRes({...newRes, description: e.target.value})} className="input-field md:col-span-2" />
            <input placeholder={t('arsenal.resourceTags')} value={newRes.tags} onChange={e => setNewRes({...newRes, tags: e.target.value})} className="input-field md:col-span-2" />
          </div>
          <button onClick={addResource} className="btn-primary text-sm">{t('arsenal.submit')}</button>
        </GlassCard>
      )}

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : filtered.length === 0 ? (
        <GlassCard className="text-center py-20"><p className="text-black/40">{t('arsenal.noResults')}</p></GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((res, i) => (
            <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard className="h-full group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-medium">{res.name}</h3>
                  <a href={res.url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-black/5 rounded transition">
                    <ExternalLink className="w-4 h-4 text-black/30" />
                  </a>
                </div>
                <p className="text-xs text-black/40 mb-3 line-clamp-2">{res.description}</p>
                <div className="flex flex-wrap gap-1">
                  {res.tags?.map(tag => (
                    <span key={tag} className="text-[10px] bg-black/5 px-2 py-0.5 flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{tag}</span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};