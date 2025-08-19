import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        // If we have user data but Redux state is not authenticated, 
        // we'll let the component render and let useAuth handle it
      } catch (error) {
        console.error('Invalid user data in localStorage:', error)
        localStorage.removeItem('user_data')
      }
    }
    setIsChecking(false)
  }, [])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    )
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute 