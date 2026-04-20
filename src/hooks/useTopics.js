import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTopics, addTopic, updateTopic, deleteTopic } from '../services/topicService'

export function useTopics() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all topics
  const fetchTopics = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await getTopics(user.uid)
      setTopics(data)
    } catch (err) {
      setError('Failed to load topics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  // Add new topic
  async function handleAdd(topicData) {
    try {
      await addTopic(user.uid, topicData)
      await fetchTopics() // refresh list
    } catch (err) {
      setError('Failed to add topic')
      console.error(err)
    }
  }

  // Update existing topic
  async function handleUpdate(topicId, updates) {
    try {
      await updateTopic(user.uid, topicId, updates)
      await fetchTopics()
    } catch (err) {
      setError('Failed to update topic')
      console.error(err)
    }
  }

  // Delete topic
  async function handleDelete(topicId) {
    try {
      await deleteTopic(user.uid, topicId)
      setTopics(prev => prev.filter(t => t.id !== topicId))
    } catch (err) {
      setError('Failed to delete topic')
      console.error(err)
    }
  }

  return { topics, loading, error, handleAdd, handleUpdate, handleDelete, fetchTopics }
}