export default function StructureLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 bottom-0 w-px bg-obelisk-line/5" style={{ left: '10%' }} />
      <div className="absolute top-0 bottom-0 w-px bg-obelisk-line/5" style={{ left: '25%' }} />
      <div className="absolute top-0 bottom-0 w-px bg-obelisk-line/5" style={{ left: '50%' }} />
      <div className="absolute top-0 bottom-0 w-px bg-obelisk-line/5" style={{ left: '75%' }} />
      <div className="absolute top-0 bottom-0 w-px bg-obelisk-line/5" style={{ left: '90%' }} />

      <div className="absolute left-0 right-0 h-px bg-obelisk-line/5" style={{ top: '20%' }} />
      <div className="absolute left-0 right-0 h-px bg-obelisk-line/5" style={{ top: '50%' }} />
      <div className="absolute left-0 right-0 h-px bg-obelisk-line/5" style={{ top: '80%' }} />

      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-obelisk-line/10" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-obelisk-line/10" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-obelisk-line/10" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-obelisk-line/10" />
    </div>
  )
}
