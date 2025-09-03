import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, setUser, clearError as clearErrorAction } from '../features/auth/authSlice';
import * as authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(email, password);
      dispatch(loginSuccess(response.user));
      return response;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always dispatch logout action to clear Redux state
      dispatch(logoutAction());
      // Force clear any remaining localStorage items
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
    }
  };

  const checkAuth = async () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch(logoutAction());
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authService.refreshToken();
      dispatch(loginSuccess(response.user));
      return response;
    } catch (error) {
      dispatch(logoutAction());
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      dispatch(setUser(user));
      return user;
    } catch (error) {
      dispatch(logoutAction());
      throw error;
    }
  };

  const getUserPermissions = async () => {
    try {
      return await authService.getUserPermissions();
    } catch (error) {
      console.error('Failed to get user permissions:', error);
      return [];
    }
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    refreshAuth,
    getCurrentUser,
    getUserPermissions,
    clearError,
  };
}; 