import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Save generated path to Firestore
export async function saveLearningPath(userId, topicId, pathData) {
  const ref = doc(db, 'users', userId, 'learningPaths', topicId)
  await setDoc(ref, {
    ...pathData,
    topicId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Get existing path for a topic
export async function getLearningPath(userId, topicId) {
  const ref = doc(db, 'users', userId, 'learningPaths', topicId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Update a single task's done status
export async function updateTaskStatus(userId, topicId, weekIndex, taskIndex, done) {
  const ref = doc(db, 'users', userId, 'learningPaths', topicId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const data = snap.data()
  const weeks = [...data.weeks]
  weeks[weekIndex] = {
    ...weeks[weekIndex],
    tasks: weeks[weekIndex].tasks.map((task, i) =>
      i === taskIndex ? { ...task, done } : task
    )
  }

  await updateDoc(ref, {
    weeks,
    updatedAt: serverTimestamp(),
  })

  return weeks
}