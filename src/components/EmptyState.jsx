import { FileX } from 'lucide-react'

export default function EmptyState({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 struct-line mb-4">
        <FileX size={32} className="text-obelisk-muted" />
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-obelisk-muted mt-1 max-w-xs">{desc}</p>
    </div>
  )
}
