import { useReducer, useCallback } from 'react'
import { generateQuiz } from '../services/aiService'
import { saveQuizResult } from '../services/quizService'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'

const initialState = {
  phase: 'idle',
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  showExplanation: false,
  answers: [],
  error: null,
}

function quizReducer(state, action) {
  switch (action.type) {

    case 'FETCH_START':
      return { ...initialState, phase: 'loading' }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        phase: 'active',
        questions: action.payload,
        currentIndex: 0,
        answers: [],
        selectedAnswer: null,
        showExplanation: false,
        error: null,
      }

    case 'FETCH_ERROR':
      return { ...state, phase: 'idle', error: action.payload }

    case 'SELECT_ANSWER':
      if (state.selectedAnswer !== null) return state
      const currentQ = state.questions[state.currentIndex]
      const isCorrect = action.payload === currentQ.correctIndex
      return {
        ...state,
        selectedAnswer: action.payload,
        showExplanation: true,
        answers: [...state.answers, {
          question: currentQ.question,
          selected: action.payload,
          correct: currentQ.correctIndex,
          isCorrect,
        }]
      }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        showExplanation: false,
      }

    case 'FINISH':
      return { ...state, phase: 'result' }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function useQuiz(topic) {
  const { user } = useAuth()
  const { incrementQuizCount, updateTopicMastery } = useStudy()
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const {
    phase,
    questions,
    currentIndex,
    selectedAnswer,
    showExplanation,
    answers,
    error,
  } = state

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const score = answers.filter(a => a.isCorrect).length

  const startQuiz = useCallback(async () => {
    if (!topic) return
    dispatch({ type: 'FETCH_START' })
    try {
      const generated = await generateQuiz(
        topic.name, topic.subject, topic.level, 5
      )
      dispatch({ type: 'FETCH_SUCCESS', payload: generated })
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: 'Failed to generate quiz. Check your API key and try again.'
      })
    }
  }, [topic])

  function selectAnswer(index) {
    dispatch({ type: 'SELECT_ANSWER', payload: index })
  }

  const nextQuestion = useCallback(async () => {
    if (isLast) {
      const finalScore = answers.filter(a => a.isCorrect).length
      const newMastery = Math.round((finalScore / questions.length) * 100)
      try {
        await saveQuizResult(
          user.uid,
          topic.id,
          topic.name,
          finalScore,
          questions.length,
          answers
        )
        incrementQuizCount()
        updateTopicMastery(topic.id, newMastery)
      } catch (err) {
        console.error('Failed to save quiz result:', err)
      }
      dispatch({ type: 'FINISH' })
    } else {
      dispatch({ type: 'NEXT_QUESTION' })
    }
  }, [isLast, answers, questions, user, topic, incrementQuizCount, updateTopicMastery])

  function resetQuiz() {
    dispatch({ type: 'RESET' })
  }

  return {
    phase,
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    showExplanation,
    answers,
    score,
    error,
    startQuiz,
    selectAnswer,
    nextQuestion,
    resetQuiz,
  }
}