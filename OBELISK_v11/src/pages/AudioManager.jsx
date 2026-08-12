import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, storage, getFirebaseInitStatus } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Upload, Trash2, Music, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const AudioManager = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [tracks, setTracks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) return;
    const unsub = onSnapshot(query(collection(db, 'audio')), (snap) => {
      setTracks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [status.initialized]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !storage || !db || !isAdmin) return;
    setUploading(true);
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `audio/${filename}`);
    try {
      const snap = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      await addDoc(collection(db, 'audio'), {
        title: file.name.replace(/\.[^/.]+$/, ''), artist: 'Admin', url, filename,
        active: true, uploadedBy: user.uid, createdAt: serverTimestamp(),
      });
    } catch (err) { alert('Upload failed: ' + err.message); }
    setUploading(false);
  };

  const toggleActive = async (track) => {
    await updateDoc(doc(db, 'audio', track.id), { active: !track.active });
  };

  const handleDelete = async (track) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      await deleteObject(ref(storage, `audio/${track.filename}`));
      await deleteDoc(doc(db, 'audio', track.id));
    } catch (e) { console.error(e); }
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
          <input type="file" accept="audio/*" onChange={handleUpload} className="hidden" id="audio-upload" />
          <label htmlFor="audio-upload" className="btn-primary cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />{t('audio.upload')}
          </label>
          {uploading && <div className="flex items-center gap-2 text-sm text-black/40"><Loader2 className="w-4 h-4 animate-spin" />Uploading...</div>}
        </div>
      </GlassCard>

      <div className="space-y-3">
        {tracks.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-black/5 flex items-center justify-center shrink-0"><Music className="w-5 h-5 text-black/30" /></div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{track.title}</div>
                  <div className="text-xs text-black/30">{track.artist}</div>
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