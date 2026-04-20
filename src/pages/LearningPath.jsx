import { useState } from 'react'
import { useLearningPath } from '../hooks/useLearningPath'
import WeekCard from '../components/WeekCard'
import PathProgress from '../components/PathProgress'
import { AiOutlineReload, AiOutlineDown } from 'react-icons/ai'
import { BsMap, BsLightningCharge } from 'react-icons/bs'
import { BiBook } from 'react-icons/bi'
import { Link } from 'react-router-dom'

export default function LearningPath() {
  const {
    topics, selectedTopicId, setSelectedTopicId, selectedTopic,
    path, loading, fetching, error, activeWeek, setActiveWeek,
    generatePath, toggleTask, progress,
  } = useLearningPath()

  const [weeks, setWeeks] = useState(3)
  const [showConfig, setShowConfig] = useState(false)

  if (topics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-4">
            <BsMap className="text-blue-500 text-2xl" />
          </div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-2">No topics yet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            Add a topic first before generating a learning path
          </p>
          <Link
            to="/topics"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Go to topics
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">My learning path</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                AI-generated study plan tailored to your goals
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedTopicId || ''}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-3 sm:pl-4 pr-8 py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <AiOutlineDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
              </div>

              <button
                onClick={() => setShowConfig(p => !p)}
                className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition"
              >
                ⚙️ <span className="hidden sm:inline">Options</span>
              </button>

              <button
                onClick={() => {
                  if (path) {
                    const confirmed = window.confirm('Regenerating will delete your current progress. Are you sure?')
                    if (!confirmed) return
                  }
                  generatePath(weeks)
                }}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <BsLightningCharge size={13} />
                    <span>{path ? 'Regenerate' : 'Generate path'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {showConfig && (
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-wrap">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Duration (weeks)
                  </label>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {[1, 2, 3, 4, 6, 8].map(w => (
                      <button
                        key={w}
                        onClick={() => setWeeks(w)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition border ${
                          weeks === w
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedTopic && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                    <BiBook size={13} />
                    <span>{selectedTopic.subject}</span>
                    <span>·</span>
                    <span className="capitalize">{selectedTopic.level}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl px-4 py-3 mb-4 sm:mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => generatePath(weeks)} className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium ml-3 flex-shrink-0">
              <AiOutlineReload size={13} /> Retry
            </button>
          </div>
        )}

        {(loading || fetching) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
                  <div className="h-16 sm:h-20 bg-blue-200 dark:bg-blue-900/40" />
                  <div className="p-4 sm:p-5 space-y-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-10 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-40 sm:h-48 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 animate-pulse" />
          </div>
        )}

        {!loading && !fetching && !path && (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-4 sm:mb-5">
              <BsMap className="text-blue-400 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No path yet for this topic
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6 max-w-sm mx-auto px-4">
              {selectedTopic
                ? `Generate a personalized ${weeks}-week study plan for "${selectedTopic.name}"`
                : 'Select a topic and generate your learning path'
              }
            </p>
            <button
              onClick={() => generatePath(weeks)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition"
            >
              <BsLightningCharge size={15} />
              Generate my learning path
            </button>
          </div>
        )}

        {!loading && !fetching && path && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Your study plan</p>
                  <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 leading-snug">{path.title}</h2>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed hidden sm:block">{path.overview}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-bold">{progress.percent}%</div>
                  <div className="text-blue-200 text-xs mt-1">complete</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 -mx-1 px-1">
                  {path.weeks.map((week, i) => {
                    const done = week.tasks.filter(t => t.done).length
                    const total = week.tasks.length
                    const isComplete = done === total
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveWeek(i)}
                        className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition border ${
                          activeWeek === i
                            ? 'bg-blue-600 text-white border-blue-600'
                            : isComplete
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {isComplete && activeWeek !== i ? '✅' : `Week ${week.weekNumber}`}
                        {!isComplete && (
                          <span className={`ml-1 text-xs ${activeWeek === i ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                            {done}/{total}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {path.weeks[activeWeek] && (
                  <WeekCard week={path.weeks[activeWeek]} weekIndex={activeWeek} onToggleTask={toggleTask} />
                )}

                <div className="flex justify-between mt-3 sm:mt-4">
                  <button
                    onClick={() => setActiveWeek(w => Math.max(0, w - 1))}
                    disabled={activeWeek === 0}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setActiveWeek(w => Math.min(path.weeks.length - 1, w + 1))}
                    disabled={activeWeek === path.weeks.length - 1}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <PathProgress progress={progress} weeks={path.weeks} />

                {selectedTopic && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Topic info</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400 dark:text-gray-500">Subject</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{selectedTopic.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 dark:text-gray-500">Level</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium capitalize">{selectedTopic.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 dark:text-gray-500">Mastery</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{selectedTopic.masteryPercent ?? 0}%</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-gray-400 dark:text-gray-500 block mb-1">Goal</span>
                        <span className="text-gray-700 dark:text-gray-200 text-xs leading-relaxed">{selectedTopic.goal}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl p-3 sm:p-4">
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    <span className="font-medium">Tip:</span> You can regenerate your path anytime. Change duration in Options for a shorter or longer plan.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}