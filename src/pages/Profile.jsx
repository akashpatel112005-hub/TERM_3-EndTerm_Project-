import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { BiUser, BiBook, BiTargetLock } from 'react-icons/bi'
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose, AiOutlineLogout } from 'react-icons/ai'
import { BsShieldCheck } from 'react-icons/bs'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.displayName || '')
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [error, setError] = useState('')

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  async function handleSaveName() {
    if (!newName.trim()) return
    setSavingName(true)
    setError('')
    try {
      await updateProfile(auth.currentUser, { displayName: newName.trim() })
      await updateDoc(doc(db, 'users', user.uid), { displayName: newName.trim() })
      setEditingName(false)
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch (err) {
      setError('Failed to update name. Try again.')
    } finally {
      setSavingName(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 sm:mb-6">Profile</h1>

        {/* Avatar + name */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 mb-4">
          <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg sm:text-xl font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                {user?.displayName || 'No name set'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Member since {joinDate}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 sm:pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Display name</label>
              {!editingName && (
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
                >
                  <AiOutlineEdit size={13} /> Edit
                </button>
              )}
            </div>

            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') setEditingName(false)
                  }}
                  autoFocus
                  className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-w-0 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition"
                >
                  {savingName
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <AiOutlineCheck size={15} />
                  }
                </button>
                <button
                  onClick={() => { setEditingName(false); setNewName(user?.displayName || '') }}
                  className="w-9 h-9 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0 transition"
                >
                  <AiOutlineClose size={15} />
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 px-1">{user?.displayName || '—'}</p>
            )}

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {nameSuccess && <p className="text-xs text-green-500 mt-2">Name updated successfully</p>}
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 flex items-center gap-2">
            <BsShieldCheck className="text-blue-500" size={15} />
            Account info
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 gap-3">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Email</span>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium truncate text-right">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sign-in method</span>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
                {user?.providerData?.[0]?.providerId === 'google.com' ? '🔵 Google' : '📧 Email'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Account ID</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{user?.uid?.slice(0, 10)}...</span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Quick links</h3>
          <div className="space-y-1">
            {[
              { label: 'My topics', icon: <BiBook size={15} />, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-500', to: '/topics' },
              { label: 'My learning path', icon: <BiTargetLock size={15} />, bg: 'bg-purple-50 dark:bg-purple-900/30', color: 'text-purple-500', to: '/path' },
              { label: 'Dashboard', icon: <BiUser size={15} />, bg: 'bg-green-50 dark:bg-green-900/30', color: 'text-green-500', to: '/dashboard' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.to)}
                className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 ${item.bg} rounded-lg flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/40 rounded-2xl p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold text-red-500 mb-3 sm:mb-4">Account actions</h3>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition"
          >
            <AiOutlineLogout size={15} />
            Sign out
          </button>
        </div>

      </div>
    </div>
  )
}