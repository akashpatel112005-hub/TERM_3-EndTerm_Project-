import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BiBook } from 'react-icons/bi'

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        if (!formData.name.trim()) { setError('Please enter your name'); setLoading(false); return }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
        await signup(formData.email, formData.password, formData.name)
      } else {
        await login(formData.email, formData.password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email'
      case 'auth/wrong-password': return 'Incorrect password'
      case 'auth/email-already-in-use': return 'An account with this email already exists'
      case 'auth/invalid-email': return 'Please enter a valid email address'
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later'
      case 'auth/invalid-credential': return 'Invalid email or password'
      default: return 'Something went wrong. Please try again'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-2xl mb-3">
              <BiBook className="text-white text-xl sm:text-2xl" />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Study Companion</h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5 sm:mb-6">
            <button
              onClick={() => { setIsSignUp(false); setError('') }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError('') }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required={isSignUp}
                  className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isSignUp ? 'Minimum 6 characters' : 'Enter your password'}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword
                    ? <AiOutlineEyeInvisible size={17} />
                    : <AiOutlineEye size={17} />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition mt-1"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 sm:my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition"
          >
            <FcGoogle size={18} />
            Continue with Google
          </button>
        </div>

        {/* Back to landing */}
        <p className="text-center text-xs text-gray-400 mt-4 sm:mt-6">
          <Link to="/" className="hover:text-blue-500 transition">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}