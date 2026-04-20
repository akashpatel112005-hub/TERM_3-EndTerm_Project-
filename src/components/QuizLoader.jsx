export default function QuizLoader() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-200">Generating your quiz...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">AI is crafting questions just for you</p>
        </div>
      </div>
    </div>
  )
}