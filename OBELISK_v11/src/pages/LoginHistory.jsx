import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { db, getFirebaseInitStatus } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Clock, MapPin, Monitor, Globe, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const LoginHistory = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!user || !status.initialized || !db) { setLoading(false); return; }
    const q = query(collection(db, 'users', user.uid, 'loginHistory'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user, status.initialized]);

  if (!user) return <Navigate to="/" />;
  if (!status.initialized) return <div className="max-w-xl mx-auto px-4 py-24 text-center text-black/40">Firebase not initialized</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('loginHistory.title')}</h1>
        <p className="text-black/40">Recent login activity for your account</p>
      </motion.div>

      {loading ? <div className="text-center py-20 text-black/30">{t('common.loading')}</div> : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-black/5 flex items-center justify-center shrink-0 mt-0.5"><Clock className="w-5 h-5 text-black/30" /></div>
                    <div>
                      <div className="text-sm font-medium">
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : item.timestamp}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-black/40">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{item.ip}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.city}, {item.country}</span>
                        <span className="flex items-center gap-1"><Monitor className="w-3 h-3" />{item.device}</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{item.browser}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-black/5 px-2 py-1 self-start">{item.method}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          {history.length === 0 && <div className="text-center py-12 text-black/30">No login history found</div>}
        </div>
      )}
    </div>
  );
};