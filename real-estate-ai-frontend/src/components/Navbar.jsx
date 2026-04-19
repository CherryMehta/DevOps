import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏠</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Real Estate AI</h1>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Home
            </Link>
            <Link to="/buy" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Buy
            </Link>
            <Link to="/rent" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Rent
            </Link>
            <Link to="/chat" className="text-gray-600 hover:text-gray-900 font-medium transition">
              AI Assistant
            </Link>
            {isAuthenticated && (
              <Link
                to="/saved"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Saved
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
