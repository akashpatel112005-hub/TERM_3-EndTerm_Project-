export default function PathProgress({ progress, weeks }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5">

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Overall progress</h3>
        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{progress.percent}%</span>
      </div>

      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4 sm:mb-5">
        <span>{progress.done} tasks completed</span>
        <span>{progress.total - progress.done} remaining</span>
      </div>

      <div className="space-y-2.5">
        {weeks.map((week, i) => {
          const done = week.tasks.filter(t => t.done).length
          const total = week.tasks.length
          const pct = Math.round((done / total) * 100)
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-14 flex-shrink-0">
                Week {week.weekNumber}
              </span>
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}