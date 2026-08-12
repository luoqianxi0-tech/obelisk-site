import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const isPlaceholder = (value) => {
  if (!value || typeof value !== 'string') return true;
  const v = value.trim();
  if (!v) return true;
  if (v.includes('your-') || v.includes('YOUR_')) return true;
  if (v === '123456789') return true;
  if (v === '1:123456789:web:abcdef') return true;
  return false;
};

const pick = (value) => (isPlaceholder(value) ? undefined : value.trim());
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: pick(env.VITE_FIREBASE_API_KEY) || 'AIzaSyAlvwV6tQMdLGAYnGZsMxwIW5B8cYdiKNY',
  authDomain: pick(env.VITE_FIREBASE_AUTH_DOMAIN) || 'obelisk-ca117.firebaseapp.com',
  projectId: pick(env.VITE_FIREBASE_PROJECT_ID) || 'obelisk-ca117',
  storageBucket: pick(env.VITE_FIREBASE_STORAGE_BUCKET) || 'obelisk-ca117.firebasestorage.app',
  messagingSenderId: pick(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: pick(env.VITE_FIREBASE_APP_ID),
};

export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

export const missingFirebaseKeys = () =>
  Object.entries(firebaseConfig).filter(([, value]) => !value).map(([key]) => key);

let app = null, auth = null, db = null, storage = null, googleProvider = null;
let initError = null, initDone = false;

if (isFirebaseConfigured()) {
  try {
    const definedConfig = Object.fromEntries(Object.entries(firebaseConfig).filter(([, v]) => Boolean(v)));
    const existing = getApps();
    app = existing.length > 0 ? existing[0] : initializeApp(definedConfig);
    auth = getAuth(app); db = getFirestore(app); storage = getStorage(app);
    googleProvider = new GoogleAuthProvider(); initDone = true;
  } catch (err) {
    console.error('[Firebase] Init failed:', err); initError = err; initDone = false;
  }
} else {
  console.warn('[Firebase] Missing env vars, offline mode. Missing:', missingFirebaseKeys().join(', '));
}

export const getFirebaseInitStatus = () => ({
  initialized: initDone, configured: isFirebaseConfigured(), error: initError, missing: missingFirebaseKeys(),
});

export { auth, db, storage, googleProvider, app };