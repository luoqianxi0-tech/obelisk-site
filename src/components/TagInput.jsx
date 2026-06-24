import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    const val = input.trim().replace(/^#/, '')
    if (val && !tags.includes(val) && tags.length < 8) {
      onChange([...tags, val])
      setInput('')
    }
  }

  const remove = (tag) => onChange(tags.filter(t => t !== tag))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-black/5 struct-line">
            #{tag}
            <button onClick={() => remove(tag)} className="hover:text-red-600"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="#tag"
          className="input-struct text-sm py-2"
        />
        <button onClick={add} className="btn-secondary px-3"><Plus size={16} /></button>
      </div>
    </div>
  )
}
