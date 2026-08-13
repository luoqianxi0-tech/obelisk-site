import { useState, useEffect, useRef } from 'react';
import { Music, Pause, Play, SkipForward, Volume2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showList, setShowList] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'audio'), where('active', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      setPlaylist(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (playing) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [current, playing, volume, playlist]);

  const toggle = () => setPlaying(p => !p);
  const next = () => setCurrent(i => (i + 1) % (playlist.length || 1));
  const src = playlist[current]?.url;

  if (playlist.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={src} onEnded={next} loop={false} />
      <div className="glass-strong rounded-2xl p-3 shadow-lg flex items-center gap-3">
        <button onClick={toggle} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="hidden sm:block">
          <div className="text-xs font-medium max-w-[120px] truncate">{playlist[current]?.title || 'OBELISK Radio'}</div>
          <div className="text-[10px] text-black/40">{playlist[current]?.artist || 'Admin'}</div>
        </div>
        <button onClick={next} className="p-2 hover:bg-black/5 rounded-full transition"><SkipForward className="w-4 h-4" /></button>
        <button onClick={() => setShowList(s => !s)} className="p-2 hover:bg-black/5 rounded-full transition relative">
          <Music className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">{playlist.length}</span>
        </button>
      </div>
      <AnimatePresence>
        {showList && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-3 w-64 glass-strong rounded-xl p-3 shadow-xl max-h-64 overflow-y-auto">
            {playlist.map((track, i) => (
              <div key={track.id} onClick={() => { setCurrent(i); setPlaying(true); }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${i === current ? 'bg-black/5' : 'hover:bg-black/5'}`}>
                <Music className="w-4 h-4 text-black/30" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{track.title}</div>
                  <div className="text-[10px] text-black/40 truncate">{track.artist}</div>
                </div>
                {i === current && playing && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-black/10 flex items-center gap-2">
              <Volume2 className="w-3 h-3 text-black/30" />
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-black/10 rounded-lg appearance-none cursor-pointer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};