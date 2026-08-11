import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAgent } from '../hooks/useAgent';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Cpu, Wifi, Settings, Shield, BookOpen, MessageSquare, FolderGit2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const { agentUrl, customIp, setCustomIp, updateUrl } = useAgent();
  const { connected, data, connect, disconnect } = useWebSocket(agentUrl);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const mock = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      cpu: 15 + Math.random() * 25,
      traffic: Math.random() * 80,
    }));
    setHistory(mock);
  }, []);

  useEffect(() => {
    if (data?.system_stats) {
      setHistory(prev => {
        const next = [...prev.slice(1), {
          time: prev.length,
          cpu: data.system_stats.cpu_percent ?? prev[prev.length - 1]?.cpu ?? 20,
          traffic: data.system_stats.network_io?.bytes_sent ? data.system_stats.network_io.bytes_sent / 1024 : prev[prev.length - 1]?.traffic ?? 50,
        }];
        return next;
      });
    }
  }, [data]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <GlassCard>
          <p className="text-black/40">{t('profile.pleaseLogin')}</p>
        </GlassCard>
      </div>
    );
  }

  const stats = data?.system_stats || {};
  const latest = history[history.length - 1] || { cpu: 0, traffic: 0 };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'agent', label: 'Agent', icon: Zap },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <GlassCard className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img src={user.photoURL || 'https://via.placeholder.com/80'} alt="" className="w-20 h-20 rounded-full border-2 border-black/10" />
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-black text-white px-1.5 py-0.5 tracking-wider">ADMIN</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-light mb-1">{user.displayName}</h1>
            <p className="text-sm text-black/40">{user.email}</p>
            <div className="flex gap-6 mt-4 flex-wrap">
              <Link to="/beike/mine" className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors">
                <MessageSquare className="w-4 h-4" /> {t('profile.myPosts')}
              </Link>
              <Link to="/settings" className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors">
                <Settings className="w-4 h-4" /> {t('profile.settings')}
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-1 mb-6 border-b border-black/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id ? 'text-black border-b-2 border-black -mb-[1px]' : 'text-black/40 hover:text-black/60'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: t('profile.posts'), value: '12', icon: MessageSquare },
              { label: t('profile.tools'), value: '8', icon: Shield },
              { label: t('profile.notes'), value: '5', icon: BookOpen },
              { label: t('profile.projects'), value: '3', icon: FolderGit2 },
            ].map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.05} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-black/30" />
                <div className="text-2xl font-light">{stat.value}</div>
                <div className="text-xs text-black/40 mt-1">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard delay={0.1}>
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-black/60">
                <BookOpen className="w-4 h-4" /> Recent Notes
              </h3>
              <div className="space-y-3">
                {['Frida Hook Basics', 'Wireshark Analysis', 'Ghidra Decompiler Intro'].map((note, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                    <span className="text-sm text-black/70">{note}</span>
                    <span className="text-xs text-black/30">2024-06-{20 - i}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard delay={0.15}>
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-black/60">
                <FolderGit2 className="w-4 h-4" /> Recent Projects
              </h3>
              <div className="space-y-3">
                {['OBELISK Platform', 'Android Hook Framework', 'Network Scanner'].map((proj, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                    <span className="text-sm text-black/70">{proj}</span>
                    <span className="text-xs text-black/30">Active</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {activeTab === 'agent' && (
        <GlassCard delay={0.1}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Activity className="w-5 h-5" /> {t('profile.agent')}
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-black' : 'bg-black/20'}`} />
              <span className="text-xs text-black/40">{connected ? t('agent.online') : t('agent.offline')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder={t('agent.ipPlaceholder')}
              value={customIp}
              onChange={(e) => setCustomIp(e.target.value)}
              className="input-field flex-1"
            />
            <div className="flex gap-2">
              <button onClick={updateUrl} className="btn-secondary">{t('agent.setIp')}</button>
              <button onClick={connected ? disconnect : connect} className="btn-primary">
                {connected ? t('agent.disconnect') : t('agent.connect')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-black/50 flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU</h3>
                <span className="text-2xl font-light">{latest.cpu?.toFixed(1) || '--'}%</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', fontSize: 12, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="cpu" stroke="#000" strokeWidth={1} fill="url(#cpuGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-black/50 flex items-center gap-2"><Wifi className="w-4 h-4" /> {t('agent.traffic')}</h3>
                <span className="text-2xl font-light">{latest.traffic?.toFixed(1) || '--'} KB/s</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', fontSize: 12, borderRadius: 4 }} />
                  <Area type="monotone" dataKey="traffic" stroke="#000" strokeWidth={1} fill="url(#trafficGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {stats.memory && (
            <div className="mt-8 pt-6 border-t border-black/5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><div className="text-xs text-black/40">Memory Used</div><div className="text-lg font-light">{(stats.memory.used / 1024 / 1024 / 1024).toFixed(1)} GB</div></div>
              <div><div className="text-xs text-black/40">Memory Total</div><div className="text-lg font-light">{(stats.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB</div></div>
              <div><div className="text-xs text-black/40">Disk Used</div><div className="text-lg font-light">{(stats.disk?.used / 1024 / 1024 / 1024).toFixed(1)} GB</div></div>
              <div><div className="text-xs text-black/40">Disk Total</div><div className="text-lg font-light">{(stats.disk?.total / 1024 / 1024 / 1024).toFixed(1)} GB</div></div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
