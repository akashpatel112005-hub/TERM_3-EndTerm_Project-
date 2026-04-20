import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const topicsRef = (userId) =>
  collection(db, 'users', userId, 'topics')

// CREATE
export async function addTopic(userId, topicData) {
  return addDoc(topicsRef(userId), {
    ...topicData,
    masteryPercent: 0,
    createdAt: serverTimestamp(),
    lastStudied: null,
  })
}

// READ — get all topics for a user
export async function getTopics(userId) {
  const q = query(topicsRef(userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// UPDATE
export async function updateTopic(userId, topicId, updates) {
  const topicDoc = doc(db, 'users', userId, 'topics', topicId)
  return updateDoc(topicDoc, updates)
}

// DELETE
export async function deleteTopic(userId, topicId) {
  const topicDoc = doc(db, 'users', userId, 'topics', topicId)
  return deleteDoc(topicDoc)
}