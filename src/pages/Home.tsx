import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal } from '../components/Terminal'
import { useAuthStore } from '../store/authStore'
import { Terminal as TerminalIcon, Compass, Lightbulb, Activity } from 'lucide-react'

const cards = [
  { path: '/reverse', icon: TerminalIcon, title: 'Reverse Notes', titleCn: '逆向手记', desc: 'APK Analyzer & Decompiler\nPermission & Risk Scanner' },
  { path: '/darknav', icon: Compass, title: 'Dark Nav', titleCn: '暗网导航', desc: 'Security Resource Index\nTor & Protocol Tools' },
  { path: '/inspo', icon: Lightbulb, title: 'Inspo Ruins', titleCn: '灵感废墟', desc: 'Code Snippets & Scripts\nCommunity Share' },
  { path: '/motion', icon: Activity, title: 'Motion Lab', titleCn: '动效实验室', desc: 'APK Structure Visualizer\nNetwork Topology & Graphs' },
]

export function Home() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="h-full w-full flex flex-col relative z-5 overflow-y-auto overflow-x-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-light tracking-[0.15em] mb-3 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Prism for App Insight
          </h2>
          <div className="text-[0.75rem] text-white/20 tracking-[0.2em] uppercase mb-4">App Insight Prism</div>
          <p className="max-w-[520px] text-[#555560] text-[0.9rem] font-light leading-[2] tracking-[0.05em]">
            Between binaries and permissions, retrieving the hidden flow of data.
            <br />
            <span className="text-white/20 text-[0.8rem]">Real-time monitoring, hook interception, and behavioral analysis.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[880px] w-full">
          {cards.map((card, i) => (
            <motion.button
              key={card.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
              onClick={() => navigate(card.path)}
              className="group bg-obelisk-glass border border-obelisk-glass-border p-6 text-center cursor-pointer transition-all duration-400 hover:border-white/20 hover:-translate-y-1 hover:bg-white/[0.04] relative overflow-hidden backdrop-blur-[10px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <card.icon size={22} className="mx-auto mb-3 text-white/60 group-hover:text-white transition-opacity" />
              <div className="text-[0.8rem] tracking-[0.1em] font-normal text-white/80 mb-1">{card.title}</div>
              <div className="text-[0.6rem] text-white/25 tracking-[0.08em] uppercase mb-2">{card.titleCn}</div>
              <div className="text-[0.68rem] text-white/30 tracking-[0.03em] leading-[1.6] whitespace-pre-line">{card.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <Terminal />

      <div className="relative z-10 text-center py-4 text-[0.6rem] text-white/10 tracking-[0.2em]">
        OBELISK · 2026
      </div>
    </div>
  )
}
