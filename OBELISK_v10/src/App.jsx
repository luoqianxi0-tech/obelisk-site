import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { ParticleBackground } from './components/ParticleBackground';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { BeiKe } from './pages/BeiKe';
import { BeiKeFollowing } from './pages/BeiKe/Following';
import { BeiKeMine } from './pages/BeiKe/Mine';
import { BeiKeTopics } from './pages/BeiKe/Topics';
import { Circle } from './pages/Circle';
import { CircleRange } from './pages/Circle/Range';
import { CircleProjects } from './pages/Circle/Projects';
import { CircleVuln } from './pages/Circle/Vuln';
import { CircleNotes } from './pages/Circle/Notes';
import { Arsenal } from './pages/Arsenal';
import { Design } from './pages/Design';
import { Admin } from './pages/Admin';
import { Settings } from './pages/Settings';

const AppShell = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [forceSkipSplash, setForceSkipSplash] = useState(false);
  const { authReady, loading, firebaseConfigured, initError, firebaseMissing } = useAuth();

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setForceSkipSplash(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const showSplash = !splashDone && !forceSkipSplash;

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <ParticleBackground />

      {(!authReady || loading) && !showSplash ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-2xl font-light tracking-[0.25em] mb-4">OBELISK</div>
            <div className="h-[1px] w-16 bg-black/20 mx-auto mb-6" />
            <div className="flex justify-center gap-1 mb-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-black/30 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <div className="text-xs text-black/40 tracking-wide">正在初始化...</div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/beike" element={<BeiKe />} />
            <Route path="/beike/following" element={<BeiKeFollowing />} />
            <Route path="/beike/mine" element={<BeiKeMine />} />
            <Route path="/beike/topics" element={<BeiKeTopics />} />
            <Route path="/circle" element={<Circle />} />
            <Route path="/circle/range" element={<CircleRange />} />
            <Route path="/circle/projects" element={<CircleProjects />} />
            <Route path="/circle/vuln" element={<CircleVuln />} />
            <Route path="/circle/notes" element={<CircleNotes />} />
            <Route path="/arsenal" element={<Arsenal />} />
            <Route path="/design" element={<Design />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="*"
              element={
                <div className="max-w-xl mx-auto px-4 py-24 text-center">
                  <div className="text-5xl font-light tracking-[0.2em] mb-4">404</div>
                  <div className="h-[1px] w-16 bg-black/20 mx-auto mb-6" />
                  <p className="text-black/50">页面未找到</p>
                </div>
              }
            />
          </Route>
        </Routes>
      )}

      {!firebaseConfigured && splashDone && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40">
          <div className="glass rounded-lg p-4 border-l-2 border-black/40">
            <div className="text-xs font-medium tracking-wide mb-1">Firebase 未配置</div>
            <p className="text-xs text-black/50 leading-relaxed mb-2">
              缺少 Firebase 环境变量，登录与数据持久化功能不可用。本地请在 .env 中填写，部署平台请在环境变量设置中填写后重新部署。
            </p>
            {firebaseMissing?.length > 0 && (
              <p className="text-[10px] font-mono text-black/40 break-all mb-2">
                {firebaseMissing.map(key => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`).join(', ')}
              </p>
            )}
            {initError && initError !== 'FIREBASE_NOT_CONFIGURED' && (
              <p className="text-[10px] font-mono text-black/40 break-all">
                {initError}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
