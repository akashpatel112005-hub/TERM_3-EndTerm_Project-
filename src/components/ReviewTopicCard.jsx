import { useNavigate } from 'react-router-dom'
import { BiBook } from 'react-icons/bi'
import { AiOutlineClockCircle } from 'react-icons/ai'

export default function ReviewTopicCard({ topic }) {
  const navigate = useNavigate()

  function getLastStudiedLabel() {
    if (!topic.lastStudied) return 'Never studied'
    const date = topic.lastStudied.toDate?.() || new Date(topic.lastStudied)
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Studied today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/40 rounded-xl">
      <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
        <BiBook className="text-orange-500 dark:text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{topic.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <AiOutlineClockCircle size={11} className="text-orange-400" />
          <span className="text-xs text-orange-500 dark:text-orange-400">{getLastStudiedLabel()}</span>
        </div>
      </div>
      <button
        onClick={() => navigate(`/topics/${topic.id}`)}
        className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 px-3 py-1.5 rounded-lg transition flex-shrink-0"
      >
        Review
      </button>
    </div>
  )
}