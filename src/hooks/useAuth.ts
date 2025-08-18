import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { loginStart, loginSuccess, loginFailure, logout } from '../features/auth/authSlice'
import { authService, LoginCredentials } from '../services/api/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(loginStart())
        const response = await authService.login(credentials)
        dispatch(loginSuccess(response))
        navigate('/dashboard')
        return { success: true }
      } catch (error: any) {
        dispatch(loginFailure(error.message))
        return { success: false, error: error.message }
      }
    },
    [dispatch, navigate]
  )

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if API call fails
      dispatch(logout())
      navigate('/login')
    }
  }, [dispatch, navigate])

  const checkAuth = useCallback(async () => {
    if (authService.isAuthenticated() && !user) {
      try {
        const userData = await authService.getCurrentUser()
        // Create a mock login response for the current user
        const mockResponse = {
          user: userData,
          access_token: authService.getToken() || '',
          token_type: 'Bearer'
        }
        dispatch(loginSuccess(mockResponse))
      } catch (error) {
        dispatch(logout())
        navigate('/login')
      }
    }
  }, [dispatch, navigate, user])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    checkAuth,
  }
} 