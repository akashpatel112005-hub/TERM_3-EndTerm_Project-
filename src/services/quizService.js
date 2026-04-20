import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Save quiz result to Firestore
export async function saveQuizResult(userId, topicId, topicName, score, totalQuestions, questions) {
  // Save result document
  await addDoc(collection(db, 'users', userId, 'quizResults'), {
    topicId,
    topicName,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    questions,
    completedAt: serverTimestamp(),
  })

  // Update mastery % on the topic (rolling score)
  const newMastery = Math.round((score / totalQuestions) * 100)
  const topicRef = doc(db, 'users', userId, 'topics', topicId)
  await updateDoc(topicRef, {
    masteryPercent: newMastery,
    lastStudied: serverTimestamp(),
  })
}
