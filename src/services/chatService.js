import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Save a single message to Firestore
export async function saveMessage(userId, topicId, role, text) {
  return addDoc(
    collection(db, 'users', userId, 'topics', topicId, 'messages'),
    {
      role,
      text,
      createdAt: serverTimestamp(),
    }
  )
}

// Load all messages for a topic
export async function getMessages(userId, topicId) {
  const q = query(
    collection(db, 'users', userId, 'topics', topicId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}