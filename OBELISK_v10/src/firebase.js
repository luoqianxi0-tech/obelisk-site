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

// Firebase Web 配置本身是公开信息；这里保留默认项目，便于未设置环境变量时也能直接部署。
// 环境变量存在时优先使用环境变量。
export const firebaseConfig = {
  apiKey: pick(env.VITE_FIREBASE_API_KEY) || 'AIzaSyAlvwV6tQMdLGAYnGZsMxwIW5B8cYdiKNY',
  authDomain: pick(env.VITE_FIREBASE_AUTH_DOMAIN) || 'obelisk-ca117.firebaseapp.com',
  projectId: pick(env.VITE_FIREBASE_PROJECT_ID) || 'obelisk-ca117',
  storageBucket: pick(env.VITE_FIREBASE_STORAGE_BUCKET) || 'obelisk-ca117.firebasestorage.app',
  messagingSenderId: pick(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: pick(env.VITE_FIREBASE_APP_ID),
};

// apiKey / authDomain / projectId 是登录与 Firestore 的最小必需集合；
// messagingSenderId 与 appId 缺失时其余功能仍可用。
export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

export const missingFirebaseKeys = () =>
  Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;
let initError = null;
let initDone = false;

if (isFirebaseConfigured()) {
  try {
    const definedConfig = Object.fromEntries(
      Object.entries(firebaseConfig).filter(([, value]) => Boolean(value))
    );
    const existing = getApps();
    app = existing.length > 0 ? existing[0] : initializeApp(definedConfig);
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
} else {
  console.warn(
    '[Firebase] 缺少环境变量，已进入离线演示模式。缺失项：',
    missingFirebaseKeys().join(', ')
  );
}

export const getFirebaseInitStatus = () => ({
  initialized: initDone,
  configured: isFirebaseConfigured(),
  error: initError,
  missing: missingFirebaseKeys(),
});

export { auth, db, storage, googleProvider, app };
