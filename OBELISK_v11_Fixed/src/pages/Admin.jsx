import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Users, FileText, Wrench, HardDrive, Activity, Shield, Music } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const Admin = () => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ users: 0, posts: 0, resources: 0, files: 0 });
  const [rows, setRows] = useState([{ name: '', url: '', desc: '', tags: '' }]);
  const [saved, setSaved] = useState(false);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) return;
    const unsubUsers = onSnapshot(query(collection(db, 'users')), s => setStats(st => ({ ...st, users: s.size })));
    const unsubPosts = onSnapshot(query(collection(db, 'posts')), s => setStats(st => ({ ...st, posts: s.size })));
    const unsubRes = onSnapshot(query(collection(db, 'resources')), s => setStats(st => ({ ...st, resources: s.size })));
    const unsubFiles = onSnapshot(query(collection(db, 'files')), s => setStats(st => ({ ...st, files: s.size })));
    return () => { unsubUsers(); unsubPosts(); unsubRes(); unsubFiles(); };
  }, [status.initialized]);

  const addRow = () => setRows([...rows, { name: '', url: '', desc: '', tags: '' }]);
  const updateRow = (i, field, value) => {
    const next = [...rows]; next[i][field] = value; setRows(next);
  };
  const save = async () => {
    if (!db) return;
    const valid = rows.filter(r => r.name.trim() && r.url.trim());
    for (const r of valid) {
      await addDoc(collection(db, 'resources'), {
        name: r.name, url: r.url, description: r.desc,
        tags: r.tags.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: serverTimestamp(),
      });
    }
    setRows([{ name: '', url: '', desc: '', tags: '' }]);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  if (!isAdmin) return <Navigate to="/" />;
  if (!status.initialized) return <div className="max-w-xl mx-auto px-4 py-24 text-center text-black/40">Firebase not initialized</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.admin')}</h1>
        <p className="text-black/40">System management panel</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: t('admin.totalUsers'), value: stats.users, icon: Users },
          { label: t('admin.totalPosts'), value: stats.posts, icon: FileText },
          { label: t('admin.totalResources'), value: stats.resources, icon: Wrench },
          { label: t('admin.totalFiles'), value: stats.files, icon: HardDrive },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05} className="text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-black/30" />
            <div className="text-2xl font-light">{s.value}</div>
            <div className="text-xs text-black/40 mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <GlassCard>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Shield className="w-4 h-4" />{t('admin.userManagement')}</h3>
          <p className="text-xs text-black/40">Manage users via Firebase Console</p>
        </GlassCard>
        <Link to="/audio">
          <GlassCard className="hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Music className="w-4 h-4" />{t('admin.audioManagement')}</h3>
            <p className="text-xs text-black/40">Upload and manage background music</p>
          </GlassCard>
        </Link>
      </div>

      <GlassCard>
        <h3 className="text-sm font-medium mb-2">{t('admin.importResources')}</h3>
        <p className="text-xs text-black/40 mb-4">{t('admin.importDesc')}</p>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input placeholder={t('admin.name')} value={row.name} onChange={e => updateRow(i, 'name', e.target.value)} className="input-field" />
              <input placeholder={t('admin.url')} value={row.url} onChange={e => updateRow(i, 'url', e.target.value)} className="input-field" />
              <input placeholder={t('admin.desc')} value={row.desc} onChange={e => updateRow(i, 'desc', e.target.value)} className="input-field" />
              <input placeholder={t('admin.tags')} value={row.tags} onChange={e => updateRow(i, 'tags', e.target.value)} className="input-field" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={addRow} className="btn-secondary text-xs">{t('admin.addRow')}</button>
          <button onClick={save} className="btn-primary text-xs">{t('admin.save')}</button>
          {saved && <span className="text-xs text-black/40">{t('admin.saved')}</span>}
        </div>
      </GlassCard>
    </div>
  );
};