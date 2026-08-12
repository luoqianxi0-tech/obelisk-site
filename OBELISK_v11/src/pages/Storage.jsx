import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, storage, getFirebaseInitStatus } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Upload, Download, Trash2, File, Film, Image, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = [
  { key: 'software', label: 'Software', icon: File },
  { key: 'video', label: 'Video', icon: Film },
  { key: 'image', label: 'Image', icon: Image },
];

export const Storage = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'files'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [status.initialized]);

  const handleUpload = useCallback(async (fileList) => {
    if (!user || !storage || !db || uploading) return;
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;
    setUploading(true);
    for (const file of filesArray) {
      const category = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : 'software';
      const ext = file.name.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const storageRef = ref(storage, `files/${category}/${filename}`);
      try {
        const snap = await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(snap.ref);
        await addDoc(collection(db, 'files'), {
          name: file.name, filename, category, url,
          size: file.size, type: file.type,
          uploaderId: user.uid, uploaderName: user.displayName,
          downloads: 0, createdAt: serverTimestamp(),
        });
      } catch (e) { console.error('Upload error:', e); alert('Upload failed: ' + e.message); }
    }
    setUploading(false);
  }, [user, storage, db, uploading]);

  const handleDelete = async (file) => {
    if (!isAdmin && file.uploaderId !== user?.uid) return;
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      if (storage) await deleteObject(ref(storage, `files/${file.category}/${file.filename}`));
      await deleteDoc(doc(db, 'files', file.id));
    } catch (e) { console.error('Delete error:', e); }
  };

  const filtered = activeTab === 'all' ? files : files.filter(f => f.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('storage.title')}</h1>
        <p className="text-black/40">{t('storage.subtitle')}</p>
      </motion.div>

      {user && (
        <GlassCard className="mb-8">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${dragOver ? 'border-black bg-black/5' : 'border-black/10'}`}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-black/20" />
            <p className="text-sm text-black/40 mb-2">{t('storage.dropzone')}</p>
            <input type="file" multiple onChange={(e) => handleUpload(e.target.files)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="btn-secondary cursor-pointer inline-block">{t('storage.upload')}</label>
            {uploading && <div className="mt-3 flex items-center justify-center gap-2 text-sm text-black/40"><Loader2 className="w-4 h-4 animate-spin" />Uploading...</div>}
          </div>
        </GlassCard>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm border transition-colors ${activeTab==='all'?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>{t('circle.filter.all')}</button>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveTab(cat.key)} className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${activeTab===cat.key?'bg-black text-white border-black':'border-black/10 hover:bg-black/5'}`}>
            <cat.icon className="w-4 h-4" />{t(`storage.${cat.key}`)}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : filtered.length === 0 ? (
        <GlassCard className="text-center py-20"><p className="text-black/40">{t('storage.noFiles')}</p></GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((file, i) => (
            <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard className="group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-black/10 flex items-center justify-center">
                      {file.category==='video'?<Film className="w-5 h-5 text-black/30"/>:file.category==='image'?<Image className="w-5 h-5 text-black/30"/>:<File className="w-5 h-5 text-black/30"/>}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate max-w-[180px]">{file.name}</div>
                      <div className="text-xs text-black/30">{file.uploaderName} · {(file.size/1024/1024).toFixed(1)} MB</div>
                    </div>
                  </div>
                  {(isAdmin || file.uploaderId === user?.uid) && (
                    <button onClick={() => handleDelete(file)} className="p-1.5 hover:bg-black/5 rounded transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-black/30" /></button>
                  )}
                </div>
                {file.category==='image' && <img src={file.url} alt="" className="w-full h-40 object-cover rounded-lg mb-3 bg-black/5" />}
                {file.category==='video' && <video src={file.url} className="w-full h-40 rounded-lg mb-3 bg-black/5" controls />}
                <div className="flex items-center justify-between pt-3 border-t border-black/5">
                  <span className="text-xs text-black/30 capitalize">{file.category}</span>
                  <a href={file.url} target="_blank" rel="noreferrer" className="btn-secondary text-xs flex items-center gap-1"><Download className="w-3 h-3" />{t('storage.download')}</a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};