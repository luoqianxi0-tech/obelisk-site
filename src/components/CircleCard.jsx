import { Link } from 'react-router-dom'
import { Users, FileText } from 'lucide-react'

export default function CircleCard({ circle }) {
  return (
    <Link to={'/monument/circle/' + circle.id} className="glass p-4 hover:bg-white/70 transition-colors block">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 struct-line flex items-center justify-center text-xl shrink-0">
          {circle.icon || '◆'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm tracking-tight truncate">{circle.name}</h3>
          <p className="text-xs text-obelisk-muted mt-0.5 line-clamp-2">{circle.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-obelisk-muted">
            <span className="flex items-center gap-1"><Users size={10} /> {circle.memberCount || 0}</span>
            <span className="flex items-center gap-1"><FileText size={10} /> {circle.postCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
