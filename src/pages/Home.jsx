import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal } from '../components/Terminal.jsx'

const cards = [
  { icon: '◈', title: 'Reverse Notes', titleZh: '逆向手记', desc: 'APK Analyzer & Decompiler\nPermission & Risk Scanner', to: '/reverse', color: 'rgba(100,255,150,0.6)' },
  { icon: '◉', title: 'Dark Nav', titleZh: '暗网导航', desc: 'Security Resource Index\nTor & Protocol Tools', to: '/darknav', color: 'rgba(80,180,255,0.6)' },
  { icon: '◊', title: 'Inspo Ruins', titleZh: '灵感废墟', desc: 'Code Snippets & Scripts\nCommunity Share', to: '/inspo', color: 'rgba(255,200,80,0.7)' },
  { icon: '◆', title: 'Motion Lab', titleZh: '动效实验室', desc: 'APK Structure Visualizer\nNetwork Topology & Graphs', to: '/motion', color: 'rgba(255,80,80,0.6)' },
]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-4">
      <div className="text-center mb-10">
        <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-light tracking-[0.15em] mb-3 text-gradient">
          Prism for App Insight
        </h2>
        <div className="text-[0.75rem] text-white/20 tracking-[0.2em] uppercase mb-4">App Insight Prism</div>
        <p className="max-w-[520px] text-[#555560] text-[0.9rem] font-light leading-8 tracking-wide mx-auto">
          Between binaries and permissions, retrieving the hidden flow of data.
          <br />
          <span className="text-white/20 text-[0.8rem]">Real-time monitoring, hook interception, and behavioral analysis.</span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-[880px] w-full">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link
              to={c.to}
              className="block glass-panel p-6 text-center transition-all duration-400 hover:border-white/20 hover:-translate-y-1 hover:bg-white/[0.04] group"
            >
              <div className="text-[1.4rem] mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{c.icon}</div>
              <div className="text-[0.8rem] tracking-[0.1em] font-normal text-white/80 mb-1">{c.title}</div>
              <div className="text-[0.6rem] text-white/25 tracking-[0.08em] uppercase mb-2">{c.titleZh}</div>
              <div className="text-[0.68rem] text-white/30 tracking-wide leading-relaxed whitespace-pre-line">{c.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Terminal />
    </div>
  )
}
