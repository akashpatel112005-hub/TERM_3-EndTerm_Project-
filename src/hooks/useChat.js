import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTutorResponse } from '../services/aiService'
import { saveMessage, getMessages } from '../services/chatService'

export function useChat(topic) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const bottomRef = useRef(null)

  // Load existing messages from Firestore
  useEffect(() => {
    if (!topic || !user) return
    loadMessages()
  }, [topic, user])

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    try {
      setFetching(true)
      const data = await getMessages(user.uid, topic.id)
      if (data.length === 0) {
        // Add welcome message if no history
        const welcome = {
          id: 'welcome',
          role: 'assistant',
          text: `Hi! I'm your tutor for **${topic.name}**. Ask me anything — I'll guide you through concepts, answer questions, and help you understand deeply. What would you like to explore?`,
        }
        setMessages([welcome])
      } else {
        setMessages(data)
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setFetching(false)
    }
  }

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return

    const userText = input.trim()
    setInput('')

    // Optimistically add user message to UI
    const userMsg = { id: Date.now().toString(), role: 'user', text: userText }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Save user message to Firestore
      await saveMessage(user.uid, topic.id, 'user', userText)

      // Build message history for context (last 10 messages)
      const history = [...messages.slice(-10), userMsg]

      // Get AI response
      const responseText = await getTutorResponse(topic.name, history)

      // Add assistant message to UI
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
      }
      setMessages(prev => [...prev, assistantMsg])

      // Save assistant message to Firestore
      await saveMessage(user.uid, topic.id, 'assistant', responseText)

    } catch (err) {
      console.error('Tutor error:', err)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: 'Sorry, I ran into an error. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, topic, user])

  // Send on Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return {
    messages,
    input,
    setInput,
    loading,
    fetching,
    bottomRef,
    sendMessage,
    handleKeyDown,
  }
}