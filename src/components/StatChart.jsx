import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function StatChart({ data, dataKey, color }) {
  const c = color || '#111111'
  if (!data || data.length === 0) return (
    <div className="h-32 flex items-center justify-center text-xs text-obelisk-muted struct-line">
      No data
    </div>
  )
  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={'grad-' + dataKey} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={0.3} />
              <stop offset="100%" stopColor={c} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip contentStyle={{ background: '#fff', border: '2px solid #111', borderRadius: 2, fontSize: 12 }} />
          <Area type="monotone" dataKey={dataKey} stroke={c} strokeWidth={2} fill={'url(#grad-' + dataKey + ')'} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
