export default function StatCard({ label, value, sub, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-500',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-500',
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</span>
        {icon && (
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}