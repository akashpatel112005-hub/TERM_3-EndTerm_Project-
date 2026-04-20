import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'

export function useDashboard() {
  const { user } = useAuth()
  const { topics } = useStudy()

  const [stats, setStats] = useState(null)
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [topicsForReview, setTopicsForReview] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !topics) return
    fetchDashboardData()
  }, [user, topics])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // Fetch quiz results
      const quizzesSnap = await getDocs(
        query(
          collection(db, 'users', user.uid, 'quizResults'),
          orderBy('completedAt', 'desc'),
          limit(10)
        )
      )
      const quizzes = quizzesSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Calculate stats using topics from global context
      const avgMastery = topics.length
        ? Math.round(
            topics.reduce((sum, t) => sum + (t.masteryPercent || 0), 0) / topics.length
          )
        : 0

      const avgScore = quizzes.length
        ? Math.round(
            quizzes.reduce((sum, q) => sum + ((q.score / q.totalQuestions) * 100), 0) / quizzes.length
          )
        : 0

      // Topics due for review
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const dueForReview = topics.filter(t => {
        if (!t.lastStudied) return true
        const lastStudied = t.lastStudied.toDate?.() || new Date(t.lastStudied)
        return lastStudied < threeDaysAgo
      }).slice(0, 3)

      const chartData = buildChartData(quizzes)

      setStats({
        totalTopics: topics.length,
        totalQuizzes: quizzes.length,
        avgMastery,
        avgScore,
        chartData,
      })
      setRecentQuizzes(quizzes.slice(0, 5))
      setTopicsForReview(dueForReview)

    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  function buildChartData(quizzes) {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const label = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dateStr = date.toDateString()

      const dayQuizzes = quizzes.filter(q => {
        const qDate = q.completedAt?.toDate?.() || new Date(q.completedAt)
        return qDate.toDateString() === dateStr
      })

      const avg = dayQuizzes.length
        ? Math.round(
            dayQuizzes.reduce((s, q) => s + ((q.score / q.totalQuestions) * 100), 0) / dayQuizzes.length
          )
        : null

      days.push({ day: label, score: avg })
    }
    return days
  }

  return { stats, recentQuizzes, topicsForReview, loading, refetch: fetchDashboardData }
}