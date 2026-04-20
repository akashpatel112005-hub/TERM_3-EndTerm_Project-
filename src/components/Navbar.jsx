import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { BiBook } from 'react-icons/bi'
import {
  AiOutlineDashboard,
  AiOutlineBook,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
} from 'react-icons/ai'
import { BsMap, BsSun, BsMoon } from 'react-icons/bs'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: AiOutlineDashboard },
  { to: '/topics', label: 'Topics', icon: AiOutlineBook },
  { to: '/path', label: 'My path', icon: BsMap },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className="bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BiBook className="text-white text-lg" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
              Study Companion
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition ${
                  location.pathname === to
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {theme === 'dark' 
                  ? <BsSun size={11} className="text-blue-600" /> 
                  : <BsMoon size={11} className="text-gray-400" />
                }
              </span>
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                <span className="text-white text-sm font-bold">{initials}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.displayName || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                    >
                      <AiOutlineUser size={16} /> View Profile
                    </button>
                    <button
                      onClick={() => { handleLogout(); setProfileOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
                    >
                      <AiOutlineLogout size={16} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <BiBook className="text-white text-lg" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">Study Companion</span>
            </div>

            <div className="space-y-1 flex-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${
                    location.pathname === to
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
              >
                <AiOutlineLogout size={20} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}