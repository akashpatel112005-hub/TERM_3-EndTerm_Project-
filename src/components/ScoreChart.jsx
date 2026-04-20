import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length && payload[0].value !== null) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-bold text-blue-600">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function ScoreChart({ data }) {
  const hasData = data.some(d => d.score !== null)

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          Complete some quizzes to see your score history
        </p>
      </div>
    )
  }

  // Fill nulls with 0 for display
  const chartData = data.map(d => ({ ...d, score: d.score ?? 0 }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#scoreGradient)"
          dot={{ fill: '#3b82f6', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}