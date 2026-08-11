import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, db, getFirebaseInitStatus } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [initError, setInitError] = useState(null);

  const status = getFirebaseInitStatus();

  useEffect(() => {
    if (!status.configured) {
      console.warn('[AuthProvider] Firebase 未配置正确凭证，认证功能已禁用');
      setInitError('FIREBASE_NOT_CONFIGURED');
      setLoading(false);
      setAuthReady(true);
      return;
    }

    if (!status.initialized || !auth || !db) {
      setInitError(status.error?.message || 'FIREBASE_INIT_FAILED');
      setLoading(false);
      setAuthReady(true);
      return;
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
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date().toISOString(),
              isAdmin: false,
            });
            setIsAdmin(false);
          } else {
            const data = snap.data();
            setIsAdmin(Boolean(data?.isAdmin));
          }
        } catch (err) {
          console.error('[AuthProvider] 用户数据读取失败：', err);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
      setAuthReady(true);
    }, (err) => {
      console.error('[AuthProvider] 认证监听错误：', err);
      setInitError(err.message || 'AUTH_LISTENER_ERROR');
      setLoading(false);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      unsubscribe && unsubscribe();
    };
  }, [status.configured, status.initialized, status.error]);

  const login = useCallback(async () => {
    if (!status.initialized || !auth || !googleProvider) {
      throw new Error('Firebase 未初始化，无法登录');
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error('[AuthProvider] 登录错误：', err);
      throw err;
    }
  }, [status.initialized]);

  const logout = useCallback(async () => {
    if (!status.initialized || !auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error('[AuthProvider] 退出错误：', err);
      throw err;
    }
  }, [status.initialized]);

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      login,
      logout,
      authReady,
      initError,
      firebaseConfigured: status.configured,
      firebaseMissing: status.missing,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
