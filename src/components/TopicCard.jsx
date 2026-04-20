import { useState, memo } from 'react'
import { AiOutlineEdit, AiOutlineDelete, AiOutlineRight } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const LEVEL_COLORS = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const SUBJECT_COLORS = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
]

function TopicCard({ topic, onDelete, onEdit }) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const colorIndex = topic.subject ? topic.subject.charCodeAt(0) % SUBJECT_COLORS.length : 0
  const subjectColor = SUBJECT_COLORS[colorIndex]

  function handleDeleteClick(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(topic.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  function handleEditClick(e) {
    e.stopPropagation()
    onEdit(topic)
  }

  return (
    <div
      onClick={() => navigate(`/topics/${topic.id}`)}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 sm:p-7 hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-800 transition-all cursor-pointer group h-full flex flex-col justify-between"
    >
      <div>
        {/* Header: Topic and Subject side-by-side */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0 flex-1">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg sm:text-xl leading-tight">
              {topic.name}
            </h3>
            <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap ${subjectColor}`}>
              {topic.subject}
            </span>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">
            <button
              onClick={handleEditClick}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <AiOutlineEdit size={18} />
            </button>
            <button
              onClick={handleDeleteClick}
              className={`flex items-center justify-center rounded-xl transition text-xs ${
                confirmDelete
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-3 h-9'
                  : 'w-9 h-9 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500'
              }`}
            >
              {confirmDelete ? 'Confirm?' : <AiOutlineDelete size={18} />}
            </button>
          </div>
        </div>

        {/* Goal Section */}
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
          {topic.goal}
        </p>
      </div>

      {/* Footer: Level and Mastery */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${LEVEL_COLORS[topic.level] || 'bg-gray-100 text-gray-600'}`}>
              {topic.level}
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {topic.masteryPercent ?? 0}% mastery
            </span>
          </div>
          <AiOutlineRight className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" size={18} />
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${topic.masteryPercent ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(TopicCard)