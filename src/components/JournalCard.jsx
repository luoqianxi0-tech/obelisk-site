import { Link } from 'react-router-dom'
import { Clock, CheckCircle, Circle } from 'lucide-react'

export default function JournalCard({ entry }) {
  const created = entry.createdAt && entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt || Date.now())
  return (
    <Link to={'/journal/' + entry.category + '/' + entry.id} className="glass p-4 hover:bg-white/70 transition-colors block">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-sm tracking-tight line-clamp-1">{entry.title}</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-black/5 struct-line shrink-0">{entry.difficulty}</span>
      </div>
      <p className="text-xs text-obelisk-muted line-clamp-2 mb-3">{entry.content}</p>
      <div className="flex items-center gap-3 text-[10px] text-obelisk-muted struct-line-t pt-2">
        <span className="flex items-center gap-1"><Clock size={10} /> {created.toLocaleDateString()}</span>
        <span className="flex items-center gap-1">
          {entry.status === 'completed' ? <CheckCircle size={10} /> : <Circle size={10} />}
          {entry.status}
        </span>
      </div>
    </Link>
  )
}
