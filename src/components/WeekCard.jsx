import { AiOutlineCheck } from 'react-icons/ai'
import { BsClockHistory } from 'react-icons/bs'

const DAY_COLORS = {
  Mon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Tue: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Wed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Thu: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Fri: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  Sat: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  Sun: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export default function WeekCard({ week, weekIndex, onToggleTask }) {
  const completedTasks = week.tasks.filter(t => t.done).length
  const totalTasks = week.tasks.length
  const weekProgress = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-blue-200 text-xs font-medium uppercase tracking-wide">
            Week {week.weekNumber}
          </span>
          <span className="text-blue-200 text-xs">{completedTasks}/{totalTasks} done</span>
        </div>
        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug">{week.theme}</h3>
        <div className="mt-2 sm:mt-3 h-1.5 bg-blue-500/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700">
        {week.tasks.map((task, taskIndex) => (
          <div
            key={taskIndex}
            onClick={() => onToggleTask(weekIndex, taskIndex, task.done)}
            className={`flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 cursor-pointer transition-colors ${
              task.done
                ? 'bg-green-50/50 dark:bg-green-900/10'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
              task.done
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}>
              {task.done && <AiOutlineCheck className="text-white" size={11} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-md ${
                  DAY_COLORS[task.day] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {task.day}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <BsClockHistory size={11} />
                  <span>{task.duration}</span>
                </div>
              </div>
              <p className={`text-xs sm:text-sm leading-snug transition-all ${
                task.done
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-200'
              }`}>
                {task.task}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/30">
        <div className="flex items-start gap-2">
          <span className="text-sm sm:text-base flex-shrink-0">🎯</span>
          <div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">Week milestone</p>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{week.milestone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}