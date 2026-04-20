import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getTopics, addTopic, updateTopic, deleteTopic } from '../services/topicService'

const StudyContext = createContext(null)

export function StudyProvider({ children }) {
  const { user } = useAuth()

  const [topics, setTopics] = useState([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [topicsError, setTopicsError] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0)

  const fetchTopics = useCallback(async () => {
    if (!user) return
    try {
      setTopicsLoading(true)
      setTopicsError(null)
      const data = await getTopics(user.uid)
      setTopics(data)
    } catch (err) {
      setTopicsError('Failed to load topics')
      console.error(err)
    } finally {
      setTopicsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchTopics()
    } else {
      setTopics([])
      setTopicsLoading(false)
    }
  }, [user, fetchTopics])

  const handleAddTopic = useCallback(async (topicData) => {
    if (!user) return
    try {
      await addTopic(user.uid, topicData)
      await fetchTopics()
    } catch (err) {
      setTopicsError('Failed to add topic')
      console.error(err)
    }
  }, [user, fetchTopics])

  const handleUpdateTopic = useCallback(async (topicId, updates) => {
    if (!user) return
    try {
      await updateTopic(user.uid, topicId, updates)
      setTopics(prev =>
        prev.map(t => t.id === topicId ? { ...t, ...updates } : t)
      )
    } catch (err) {
      setTopicsError('Failed to update topic')
      console.error(err)
      await fetchTopics()
    }
  }, [user, fetchTopics])

  const handleDeleteTopic = useCallback(async (topicId) => {
    if (!user) return
    try {
      await deleteTopic(user.uid, topicId)
      setTopics(prev => prev.filter(t => t.id !== topicId))
    } catch (err) {
      setTopicsError('Failed to delete topic')
      console.error(err)
    }
  }, [user])

  const incrementQuizCount = useCallback(() => {
    setTotalQuizzesTaken(prev => prev + 1)
  }, [])

  const updateTopicMastery = useCallback((topicId, newMastery) => {
    setTopics(prev =>
      prev.map(t => t.id === topicId
        ? { ...t, masteryPercent: newMastery }
        : t
      )
    )
  }, [])

  const value = {
    topics,
    topicsLoading,
    topicsError,
    fetchTopics,
    handleAddTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    activeTopic,
    setActiveTopic,
    totalQuizzesTaken,
    incrementQuizCount,
    updateTopicMastery,
  }

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used inside StudyProvider')
  }
  return context
}