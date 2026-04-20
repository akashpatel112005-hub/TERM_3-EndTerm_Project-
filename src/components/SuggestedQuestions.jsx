export default function SuggestedQuestions({ topicName, onSelect }) {
  const suggestions = [
    `Explain the basics of ${topicName} simply`,
    `What are the most important concepts in ${topicName}?`,
    `Give me a real-world example of ${topicName}`,
    `What are common mistakes when learning ${topicName}?`,
  ]

  return (
    <div className="px-4 pb-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 text-center">Suggested questions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-800 px-3 py-2.5 rounded-xl transition-all leading-snug"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}