import { Link } from 'react-router-dom'
import { BiBook } from 'react-icons/bi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
          <BiBook className="text-blue-400 text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}