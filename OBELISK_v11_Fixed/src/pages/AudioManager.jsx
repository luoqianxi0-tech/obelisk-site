import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, Trash2, Music, ExternalLink } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const AudioManager = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [tracks, setTracks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTrack, setNewTrack] = useState({ title: '', artist: 'Admin', url: '' });
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) return;
    const unsub = onSnapshot(query(collection(db, 'audio')), (snap) => {
      setTracks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [status.initialized]);

  const addTrack = async () => {
    if (!db || !newTrack.title.trim() || !newTrack.url.trim()) return;
    await addDoc(collection(db, 'audio'), {
      title: newTrack.title, artist: newTrack.artist || 'Admin', url: newTrack.url,
      active: true, uploadedBy: user.uid, createdAt: serverTimestamp(),
    });
    setNewTrack({ title: '', artist: 'Admin', url: '' });
    setShowAdd(false);
  };

  const toggleActive = async (track) => {
    await updateDoc(doc(db, 'audio', track.id), { active: !track.active });
  };

  const handleDelete = async (track) => {
    if (!confirm(t('common.confirmDelete'))) return;
    await deleteDoc(doc(db, 'audio', track.id));
  };

  if (!isAdmin) return <Navigate to="/" />;
  if (!status.initialized) return <div className="max-w-xl mx-auto px-4 py-24 text-center text-black/40">Firebase not initialized</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('audio.title')}</h1>
        <p className="text-black/40">{t('audio.subtitle')}</p>
      </motion.div>
      <GlassCard className="mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />{showAdd ? 'Close' : 'Add Audio Link'}
          </button>
        </div>
      </GlassCard>
      {showAdd && (
        <GlassCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input placeholder="Title" value={newTrack.title} onChange={e => setNewTrack({...newTrack, title: e.target.value})} className="input-field" />
            <input placeholder="Artist" value={newTrack.artist} onChange={e => setNewTrack({...newTrack, artist: e.target.value})} className="input-field" />
          </div>
          <input placeholder="Audio URL (direct link, e.g. .mp3, .ogg, or external hosting)" value={newTrack.url} onChange={e => setNewTrack({...newTrack, url: e.target.value})} className="input-field w-full mb-3" />
          <button onClick={addTrack} className="btn-primary text-xs">Save</button>
        </GlassCard>
      )}
      <div className="space-y-3">
        {tracks.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-black/5 flex items-center justify-center shrink-0"><Music className="w-5 h-5 text-black/30" /></div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{track.title}</div>
                  <div className="text-xs text-black/30">{track.artist}</div>
                  <a href={track.url} target="_blank" rel="noreferrer" className="text-[10px] text-black/30 hover:text-black flex items-center gap-1 mt-0.5">
                    <ExternalLink className="w-2.5 h-2.5" />{track.url.substring(0, 40)}...
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(track)} className={`px-3 py-1 text-xs border transition ${track.active ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
                  {track.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDelete(track)} className="p-2 hover:bg-black/5 rounded transition"><Trash2 className="w-4 h-4 text-black/30" /></button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {tracks.length === 0 && <div className="text-center py-12 text-black/30">{t('audio.noAudio')}</div>}
      </div>
    </div>
  );
};