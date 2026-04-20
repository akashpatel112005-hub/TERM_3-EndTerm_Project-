import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboard } from '../hooks/useDashboard'
import StatCard from '../components/StatCard'
import ScoreChart from '../components/ScoreChart'
import ReviewTopicCard from '../components/ReviewTopicCard'
import { AiOutlinePlus, AiOutlineTrophy, AiOutlineBook } from 'react-icons/ai'
import { BiBook, BiTargetLock } from 'react-icons/bi'
import { BsLightningCharge, BsGraphUp } from 'react-icons/bs'

export default function Dashboard() {
  const { user } = useAuth()
  const { stats, recentQuizzes, topicsForReview, loading } = useDashboard()
  const navigate = useNavigate()

  const firstName = user?.displayName?.split(' ')[0] || 'there'

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-48 mb-4 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-50 dark:bg-[#131926] border border-gray-100 dark:border-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header Section */}
<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
  <div className="min-w-0">
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      {getGreeting()}, {firstName}
    </h1>
    <div className="flex items-center gap-2 mt-2">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
      <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {stats?.totalTopics === 0
          ? "System Ready • No Active Topics"
          : `${stats?.totalTopics} Active Learning Session${stats?.totalTopics !== 1 ? 's' : ''}`}
      </p>
    </div>
  </div>
  <button
    onClick={() => navigate('/topics')}
    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 flex-shrink-0"
  >
    <AiOutlinePlus size={16} />
    <span>Add Topic</span>
  </button>
</div>

        {/* Minimalist Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Topics" value={stats?.totalTopics ?? 0} sub="Active learning" />
          <StatCard label="Quizzes" value={stats?.totalQuizzes ?? 0} sub="Completed" />
          <StatCard label="Mastery" value={`${stats?.avgMastery ?? 0}%`} sub="Average" />
          <StatCard label="Avg Score" value={stats?.avgScore ? `${stats.avgScore}%` : '—'} sub="Performance" />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Performance Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#131926] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Performance History</h2>
                
                <p className="text-xs text-gray-400 mt-1">Activity over the last 7 days</p>
              </div>
            </div>
            <ScoreChart data={stats?.chartData || []} />
          </div>

          {/* Review Sidebar */}
          <div className="bg-white dark:bg-[#131926] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Review Required</h2>
             

            {topicsForReview.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
                <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-bold">No topics due</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topicsForReview.map(topic => (
                  <ReviewTopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Table-style Section */}
        {recentQuizzes.length > 0 && (
          <div className="mt-8 bg-white dark:bg-[#131926] border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
              Recent Quizzes
            </h2>
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {recentQuizzes.map(quiz => {
                const pct = Math.round((quiz.score / quiz.totalQuestions) * 100)
                const statusColor = pct >= 80 ? 'text-green-500' : pct >= 60 ? 'text-yellow-500' : 'text-red-500'
                
                return (
                  <div key={quiz.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                        {quiz.topicName || 'General Quiz'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium uppercase tracking-tighter">
                        {quiz.completedAt?.toDate?.() 
                          ? quiz.completedAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Recently'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-bold tabular-nums ${statusColor}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Professional Empty State CTA */}
        {stats?.totalTopics === 0 && (
          <div className="mt-10 bg-blue-600/5 border border-blue-500/10 rounded-2xl p-10 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Build Your Learning Path
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto font-medium">
              Add your first study topic to generate AI-powered quizzes and track your path to mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/topics')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
              >
                Add First Topic
              </button>
              <button
                onClick={() => navigate('/path')}
                className="border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
              >
                View Path
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}