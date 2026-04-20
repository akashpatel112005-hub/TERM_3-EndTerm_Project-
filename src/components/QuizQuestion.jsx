import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

export default function QuizQuestion({
  question,
  currentIndex,
  total,
  selectedAnswer,
  showExplanation,
  onSelect,
  onNext,
  isLast,
}) {
  function getOptionStyle(index) {
    if (selectedAnswer === null) {
      return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
    }
    if (index === question.correctIndex) {
      return 'border-green-400 bg-green-50 cursor-default'
    }
    if (index === selectedAnswer && index !== question.correctIndex) {
      return 'border-red-400 bg-red-50 cursor-default'
    }
    return 'border-gray-100 bg-gray-50 opacity-60 cursor-default'
  }

  function getOptionIcon(index) {
    if (selectedAnswer === null) return null
    if (index === question.correctIndex) {
      return <AiOutlineCheck className="text-green-500 flex-shrink-0" size={16} />
    }
    if (index === selectedAnswer) {
      return <AiOutlineClose className="text-red-500 flex-shrink-0" size={16} />
    }
    return null
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">

      {/* Progress */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <span className="text-xs sm:text-sm text-gray-400">
          Question {currentIndex + 1} of {total}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${
                i < currentIndex
                  ? 'bg-blue-500'
                  : i === currentIndex
                  ? 'bg-blue-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question text */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-5 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between gap-2 sm:gap-3 ${getOptionStyle(index)}`}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                selectedAnswer === null
                  ? 'border-gray-300 text-gray-500'
                  : index === question.correctIndex
                  ? 'border-green-400 bg-green-400 text-white'
                  : index === selectedAnswer
                  ? 'border-red-400 bg-red-400 text-white'
                  : 'border-gray-200 text-gray-400'
              }`}>
                {['A', 'B', 'C', 'D'][index]}
              </span>
              <span className="text-gray-700 leading-snug">{option}</span>
            </div>
            {getOptionIcon(index)}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 text-xs sm:text-sm ${
          selectedAnswer === question.correctIndex
            ? 'bg-green-50 border border-green-200'
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <p className={`font-medium mb-1 ${
            selectedAnswer === question.correctIndex
              ? 'text-green-700'
              : 'text-orange-700'
          }`}>
            {selectedAnswer === question.correctIndex ? '✅ Correct!' : '❌ Not quite'}
          </p>
          <p className="text-gray-600 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selectedAnswer !== null && (
        <button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-xl text-sm font-medium transition"
        >
          {isLast ? 'See results' : 'Next question →'}
        </button>
      )}
    </div>
  )
}