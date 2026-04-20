import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { useQuiz } from '../hooks/useQuiz'
import { useChat } from '../hooks/useChat'
import QuizLoader from '../components/QuizLoader'
import QuizQuestion from '../components/QuizQuestion'
import QuizResult from '../components/QuizResult'
import ChatBubble from '../components/ChatBubble'
import TypingIndicator from '../components/TypingIndicator'
import SuggestedQuestions from '../components/SuggestedQuestions'
import {
  AiOutlineArrowLeft, AiOutlineTrophy,
  AiOutlinePlayCircle, AiOutlineSend,
} from 'react-icons/ai'
import { BiBook, BiTargetLock, BiBot } from 'react-icons/bi'

const TABS = ['Quiz', 'AI Tutor']

export default function TopicDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [topicLoading, setTopicLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Quiz')

  useEffect(() => {
    async function fetchTopic() {
      try {
        const ref = doc(db, 'users', user.uid, 'topics', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setTopic({ id: snap.id, ...snap.data() })
        } else {
          navigate('/topics')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setTopicLoading(false)
      }
    }
    fetchTopic()
  }, [id, user])

  const {
    phase, currentQuestion, currentIndex, questions,
    selectedAnswer, showExplanation, answers, score,
    error: quizError, startQuiz, selectAnswer, nextQuestion,
  } = useQuiz(topic)

  const {
    messages, input, setInput, loading: chatLoading,
    fetching: chatFetching, bottomRef, sendMessage, handleKeyDown,
  } = useChat(topic)

  if (topicLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!topic) return null

  const LEVEL_COLORS = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Back */}
        <button
          onClick={() => navigate('/topics')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 sm:mb-6 transition"
        >
          <AiOutlineArrowLeft size={16} />
          Back to topics
        </button>

        {/* Topic header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <BiBook className="text-blue-500 text-lg sm:text-xl" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {topic.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{topic.subject}</p>
              </div>
            </div>
            <span className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ml-2 ${LEVEL_COLORS[topic.level]}`}>
              {topic.level}
            </span>
          </div>

          <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4">
            <BiTargetLock className="text-blue-500 mt-0.5 flex-shrink-0" size={15} />
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{topic.goal}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Mastery</span>
            <span className="font-medium">{topic.masteryPercent ?? 0}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${topic.masteryPercent ?? 0}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 mb-5 sm:mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'Quiz' ? <AiOutlineTrophy size={14} /> : <BiBot size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Quiz tab */}
        {activeTab === 'Quiz' && (
          <div>
            {quizError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl px-4 py-3 mb-4">
                {quizError}
              </div>
            )}

            {phase === 'idle' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-4">
                  <AiOutlinePlayCircle className="text-blue-500 text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-sm sm:text-base">
                  Ready to test yourself?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5 sm:mb-6">
                  AI will generate 5 questions on <strong>{topic.name}</strong> at {topic.level} level
                </p>
                <button
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition"
                >
                  <AiOutlinePlayCircle size={17} />
                  Start quiz
                </button>
              </div>
            )}

            {phase === 'loading' && <QuizLoader />}

            {phase === 'active' && currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                currentIndex={currentIndex}
                total={questions.length}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                onSelect={selectAnswer}
                onNext={nextQuestion}
                isLast={currentIndex === questions.length - 1}
              />
            )}

            {phase === 'result' && (
              <QuizResult
                score={score}
                total={questions.length}
                answers={answers}
                onRetry={startQuiz}
                onClose={() => navigate('/topics')}
              />
            )}
          </div>
        )}

        {/* AI Tutor tab */}
        {activeTab === 'AI Tutor' && (
          <div
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col"
            style={{ height: '70vh', minHeight: '400px', maxHeight: '580px' }}
          >
            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                <BiBot className="text-indigo-600 dark:text-indigo-400 text-base sm:text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100">AI Tutor</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Specialized in {topic.name}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400 hidden sm:block">Online</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
              {chatFetching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  {chatLoading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {messages.length <= 1 && !chatFetching && (
              <SuggestedQuestions topicName={topic.name} onSelect={(q) => setInput(q)} />
            )}

            <div className="px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${topic.name}...`}
                  rows={1}
                  className="flex-1 px-3 sm:px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none leading-relaxed bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  style={{ minHeight: '42px', maxHeight: '120px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || chatLoading}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 dark:disabled:bg-blue-900/30 text-white rounded-xl flex items-center justify-center transition flex-shrink-0"
                >
                  <AiOutlineSend size={15} />
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-center hidden sm:block">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}