import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAlvwV6tQMdLGAYnGZsMxwIW5B8cYdiKNY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'obelisk-ca117.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'obelisk-ca117',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'obelisk-ca117.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;
let initError = null;
let initDone = false;

const isPlaceholder = (value) => {
  if (!value) return true;
  if (value.includes('your-') || value.includes('YOUR_')) return true;
  if (value === '123456789') return true;
  if (value === '1:123456789:web:abcdef') return true;
  return false;
};

export const isFirebaseConfigured = () => {
  const { apiKey, projectId, messagingSenderId, appId } = firebaseConfig;
  if (isPlaceholder(apiKey)) return false;
  if (isPlaceholder(projectId)) return false;
  if (isPlaceholder(messagingSenderId)) return false;
  if (isPlaceholder(appId)) return false;
  return true;
};

try {
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  initDone = true;
} catch (err) {
  console.error('[Firebase] 初始化失败，功能将降级为离线模式：', err);
  initError = err;
  initDone = false;
}

export const getFirebaseInitStatus = () => ({
  initialized: initDone,
  configured: isFirebaseConfigured(),
  error: initError,
});

export { auth, db, storage, googleProvider, app };
