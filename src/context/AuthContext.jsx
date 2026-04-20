import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Create user document in Firestore on first signup
  async function createUserDoc(firebaseUser, displayName = '') {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)

    // Only create if it doesn't exist yet
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        createdAt: serverTimestamp(),
        studyStreak: 0,
        totalQuizzes: 0,
        lastStudied: null,
      })
    }
  }

  // Sign up with email + password
  async function signup(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await createUserDoc(result.user, displayName)
    return result
  }

  // Login with email + password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login with Google
  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await createUserDoc(result.user)
    return result
  }

  // Logout
  async function logout() {
    return signOut(auth)
  }

  const value = { user, loading, signup, login, loginWithGoogle, logout }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}