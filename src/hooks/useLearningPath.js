import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'
import { generateLearningPath } from '../services/aiService'
import {
  saveLearningPath,
  getLearningPath,
  updateTaskStatus,
} from '../services/pathService'

export function useLearningPath(topicId = null) {
  const { user } = useAuth()
  const { topics } = useStudy()

  const [selectedTopicId, setSelectedTopicId] = useState(topicId)
  const [path, setPath] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  const [activeWeek, setActiveWeek] = useState(0)

  // Auto-select first topic when topics load
  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id)
    }
  }, [topics])

  // Load existing path when selected topic changes
  useEffect(() => {
    if (!selectedTopicId || !user) return
    loadExistingPath()
  }, [selectedTopicId, user])

  const loadExistingPath = useCallback(async () => {
    if (!selectedTopicId || !user) return
    try {
      setFetching(true)
      setPath(null)
      const existing = await getLearningPath(user.uid, selectedTopicId)
      setPath(existing)
      setActiveWeek(0)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }, [selectedTopicId, user])

  // Generate new path via AI
  const generatePath = useCallback(async (weeks = 3) => {
    if (!selectedTopicId || !user) return
    const topic = topics.find(t => t.id === selectedTopicId)
    if (!topic) return

    setLoading(true)
    setError(null)
    try {
      const generated = await generateLearningPath(
        topic.name,
        topic.subject,
        topic.level,
        topic.goal,
        weeks
      )
      await saveLearningPath(user.uid, selectedTopicId, generated)
      setPath({ ...generated, topicId: selectedTopicId })
      setActiveWeek(0)
    } catch (err) {
      setError('Failed to generate learning path. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedTopicId, topics, user])

  // Toggle a task done/undone
  const toggleTask = useCallback(async (weekIndex, taskIndex, currentDone) => {
    if (!selectedTopicId || !user || !path) return
    try {
      const updatedWeeks = await updateTaskStatus(
        user.uid,
        selectedTopicId,
        weekIndex,
        taskIndex,
        !currentDone
      )
      setPath(prev => ({ ...prev, weeks: updatedWeeks }))
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }, [selectedTopicId, user, path])

  // useMemo for progress calculation
  const progress = useMemo(() => {
    if (!path) return { done: 0, total: 0, percent: 0 }
    const allTasks = path.weeks.flatMap(w => w.tasks)
    const done = allTasks.filter(t => t.done).length
    return {
      done,
      total: allTasks.length,
      percent: Math.round((done / allTasks.length) * 100)
    }
  }, [path])

  const selectedTopic = useMemo(() =>
    topics.find(t => t.id === selectedTopicId),
    [topics, selectedTopicId]
  )

  return {
    topics,
    selectedTopicId,
    setSelectedTopicId,
    selectedTopic,
    path,
    loading,
    fetching,
    error,
    activeWeek,
    setActiveWeek,
    generatePath,
    toggleTask,
    progress,
  }
}
