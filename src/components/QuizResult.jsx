import { AiOutlineReload } from 'react-icons/ai'

export default function QuizResult({ score, total, answers, onRetry, onClose }) {
  const percentage = Math.round((score / total) * 100)

  function getMessage() {
    if (percentage >= 90) return { text: 'Outstanding! 🎉', color: 'text-green-600 dark:text-green-400' }
    if (percentage >= 70) return { text: 'Great job! 👍', color: 'text-blue-600 dark:text-blue-400' }
    if (percentage >= 50) return { text: 'Good effort! Keep going 💪', color: 'text-yellow-600 dark:text-yellow-400' }
    return { text: 'Keep practicing! You got this 🔥', color: 'text-orange-600 dark:text-orange-400' }
  }

  const { text, color } = getMessage()

  const ringClass = percentage >= 70
    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
    : percentage >= 50
    ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'

  const scoreColor = percentage >= 70
    ? 'text-green-500 dark:text-green-400'
    : percentage >= 50
    ? 'text-yellow-500 dark:text-yellow-400'
    : 'text-red-500 dark:text-red-400'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 sm:p-8">

      <div className="text-center mb-5 sm:mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${ringClass} mb-3 sm:mb-4`}>
          <div>
            <div className={`text-xl sm:text-2xl font-bold ${scoreColor}`}>{percentage}%</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{score}/{total}</div>
          </div>
        </div>
        <h3 className={`text-base sm:text-lg font-bold ${color}`}>{text}</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          You got {score} out of {total} questions right
        </p>
      </div>

      <div className="space-y-2 mb-5 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">
          Question breakdown
        </h4>
        <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2 pr-1">
          {answers.map((answer, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                answer.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <span className="mt-0.5 flex-shrink-0">{answer.isCorrect ? '✅' : '❌'}</span>
              <p className="text-gray-700 dark:text-gray-200 leading-snug">{answer.question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Back to topic
        </button>
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs sm:text-sm font-medium transition"
        >
          <AiOutlineReload size={14} />
          Try again
        </button>
      </div>
    </div>
  )
}