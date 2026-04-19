import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SavedPropertiesProvider } from './context/SavedPropertiesContext'
import { MainLayout } from './layouts/MainLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { HomePage } from './pages/HomePage'
import { PropertyListPage } from './pages/PropertyListPage'
import { ChatAssistantPage } from './pages/ChatAssistantPage'
import { SavedPropertiesPage } from './pages/SavedPropertiesPage'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <SavedPropertiesProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Main Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/buy" element={<PropertyListPage />} />
              <Route path="/rent" element={<PropertyListPage />} />

              {/* Protected Routes */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatAssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedPropertiesPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#000',
              },
            }}
          />
        </SavedPropertiesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
