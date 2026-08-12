import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, db, getFirebaseInitStatus } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  let device = 'Desktop';
  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  if (/iPad|Tablet/i.test(ua)) device = 'Tablet';
  return { browser, device, userAgent: ua };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [initError, setInitError] = useState(null);
  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.configured) {
      setInitError('FIREBASE_NOT_CONFIGURED');
      setLoading(false); setAuthReady(true); return;
    }
    if (!status.initialized || !auth || !db) {
      setInitError(status.error?.message || 'FIREBASE_INIT_FAILED');
      setLoading(false); setAuthReady(true); return;
    }
    let cancelled = false;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return;
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              displayName: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email, photoURL: firebaseUser.photoURL,
              createdAt: new Date().toISOString(), isAdmin: false,
            });
            setIsAdmin(false);
          } else {
            const data = snap.data();
            setIsAdmin(Boolean(data?.isAdmin));
          }
          // Record login history
          try {
            const { browser, device, userAgent } = getBrowserInfo();
            const ipRes = await fetch('https://ipapi.co/json/').catch(() => null);
            const ipData = ipRes ? await ipRes.json() : {};
            await addDoc(collection(db, 'users', firebaseUser.uid, 'loginHistory'), {
              timestamp: serverTimestamp(),
              ip: ipData.ip || 'unknown',
              city: ipData.city || 'unknown',
              country: ipData.country_name || 'unknown',
              region: ipData.region || 'unknown',
              browser, device, userAgent, method: 'Google',
            });
          } catch (e) { console.error('[LoginHistory] record failed:', e); }
        } catch (err) {
          console.error('[AuthProvider] user data error:', err);
          setIsAdmin(false);
        }
      } else {
        setUser(null); setIsAdmin(false);
      }
      setLoading(false); setAuthReady(true);
    }, (err) => {
      console.error('[AuthProvider] auth listener error:', err);
      setInitError(err.message || 'AUTH_LISTENER_ERROR');
      setLoading(false); setAuthReady(true);
    });
    return () => { cancelled = true; unsubscribe && unsubscribe(); };
  }, [status.configured, status.initialized, status.error]);

  const login = useCallback(async () => {
    if (!status.initialized || !auth || !googleProvider) throw new Error('Firebase not initialized');
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }, [status.initialized]);

  const logout = useCallback(async () => {
    if (!status.initialized || !auth) return;
    await signOut(auth);
  }, [status.initialized]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, authReady, initError, firebaseConfigured: status.configured, firebaseMissing: status.missing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};