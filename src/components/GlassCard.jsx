export default function GlassCard({ children, className, strong }) {
  return (
    <div className={`${strong ? 'glass-strong' : 'glass'} p-5 ${className || ''}`}>
      {children}
    </div>
  )
}
