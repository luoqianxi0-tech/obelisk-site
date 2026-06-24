import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useAgent } from '../hooks/useAgent.jsx'
import { usePosts } from '../hooks/usePosts.jsx'
import { useCircles } from '../hooks/useCircles.jsx'
import GlassCard from '../components/GlassCard.jsx'
import PostCard from '../components/PostCard.jsx'
import CircleCard from '../components/CircleCard.jsx'
import StatChart from '../components/StatChart.jsx'
import { Zap, PenSquare, BookOpen, Hammer, FileText, ArrowRight, TrendingUp } from 'lucide-react'

export default function Home() {
  const { user, profile, isAdmin } = useAuth()
  const { t } = useTranslation()
  const { status, data, history } = useAgent()
  const { posts } = usePosts()
  const { circles } = useCircles()

  const latestPosts = posts.slice(0, 3)
  const hotCircles = circles.slice(0, 4)
  const demoResources = [
    { name: 'Burp Suite', category: 'tools', desc: 'Web vulnerability scanner' },
    { name: 'OWASP Top 10', category: 'docs', desc: 'Web security standard' },
    { name: 'HackTheBox', category: 'mirrors', desc: 'Penetration testing labs' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="glass-strong p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">{t('home.greeting')}</h1>
        <p className="text-obelisk-muted text-sm md:text-base max-w-xl">{t('home.subtitle')}</p>
        {isAdmin && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-obelisk-accent/10 struct-line">
            <Zap size={14} className="text-obelisk-accent" />
            <span className="text-xs font-bold tracking-widest text-obelisk-accent">{t('auth.rootAccess')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {user && (
            <GlassCard strong>
              <div className="flex items-center gap-3 mb-3">
                <img src={user.photoURL || ''} alt="" className="w-12 h-12 object-cover struct-line" onError={e => { e.target.style.display='none' }} />
                <div>
                  <p className="font-bold text-sm">{profile && profile.displayName ? profile.displayName : user.displayName}</p>
                  <p className="text-[10px] text-obelisk-muted">{profile && profile.bio ? profile.bio : 'No bio'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center struct-line-t pt-3">
                <div><p className="text-lg font-bold">{profile && profile.postsCount ? profile.postsCount : 0}</p><p className="text-[10px] text-obelisk-muted">{t('archive.postCount')}</p></div>
                <div><p className="text-lg font-bold">{profile && profile.arsenal ? profile.arsenal.length : 0}</p><p className="text-[10px] text-obelisk-muted">{t('archive.toolCount')}</p></div>
                <div><p className="text-lg font-bold">{profile && profile.following ? profile.following.length : 0}</p><p className="text-[10px] text-obelisk-muted">{t('nav.following')}</p></div>
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-3 flex items-center gap-2">
              <Zap size={14} /> {t('home.agentStatus')}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-600' : 'bg-gray-400'}`} />
              <span className="text-xs font-mono uppercase">{status === 'online' ? t('home.online') : t('home.offline')}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-obelisk-muted">CPU</span><span className="font-mono">{data.cpu.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-obelisk-muted">MEM</span><span className="font-mono">{data.memory.toFixed(1)}%</span></div>
            </div>
            <StatChart data={history} dataKey="cpu" color="#111" />
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-3">{t('home.quickNav')}</h3>
            <div className="space-y-1">
              {[{to:'/monument',icon:PenSquare,label:t('nav.monument')},{to:'/vault',icon:BookOpen,label:t('nav.vault')},{to:'/workshop',icon:Hammer,label:t('nav.workshop')},{to:'/journal',icon:FileText,label:t('nav.journal')}].map(item => (
                <Link key={item.to} to={item.to} className="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-black/5 struct-line">
                  <item.icon size={14} /> {item.label}
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">{t('home.latestPosts')}</h2>
            <Link to="/monument" className="text-xs flex items-center gap-1 hover:text-obelisk-accent">{t('home.viewAll')} <ArrowRight size={12} /></Link>
          </div>
          {latestPosts.length > 0 ? latestPosts.map(p => <PostCard key={p.id} post={p} />) : (
            <GlassCard><p className="text-sm text-obelisk-muted text-center py-8">{t('monument.emptyPlaza')}</p></GlassCard>
          )}

          <div className="flex items-center justify-between pt-4">
            <h2 className="text-lg font-bold tracking-tight">{t('home.hotResources')}</h2>
            <Link to="/vault" className="text-xs flex items-center gap-1 hover:text-obelisk-accent">{t('home.viewAll')} <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {demoResources.map(r => (
              <div key={r.name} className="glass p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-obelisk-muted">{r.desc}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-black/5 struct-line">{r.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-3 flex items-center gap-2">
              <TrendingUp size={14} /> {t('home.activeCircles')}
            </h3>
            <div className="space-y-2">
              {hotCircles.map(c => <CircleCard key={c.id} circle={c} />)}
              {hotCircles.length === 0 && <p className="text-xs text-obelisk-muted">{t('monument.emptyCircles')}</p>}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-3">{t('home.recommended')}</h3>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 struct-line bg-black/5 flex items-center justify-center text-xs font-bold">{String.fromCharCode(64+i)}</div>
                  <div>
                    <p className="text-xs font-medium">User {String.fromCharCode(64+i)}</p>
                    <p className="text-[10px] text-obelisk-muted">Security researcher</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
